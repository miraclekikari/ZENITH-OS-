-- 1. Table pour gérer les Sessions LIVE (Style TikTok)
CREATE TABLE IF NOT EXISTS live_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    status VARCHAR(50) DEFAULT 'live' CHECK (status IN ('live', 'ended')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    viewer_count INTEGER DEFAULT 0
);

-- 2. Table pour gérer les APPELS 1-vs-1 (Style WhatsApp)
CREATE TABLE IF NOT EXISTS active_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'ringing' CHECK (status IN ('ringing', 'accepted', 'rejected', 'ended')),
    offer JSONB, -- Pour la connexion technique WebRTC (SDP)
    answer JSONB, -- La réponse technique
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sécurité : Tout le monde peut voir les lives, seul les participants voient l'appel
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Voir les lives" ON live_sessions FOR SELECT USING (status = 'live');
CREATE POLICY "Gerer son live" ON live_sessions FOR ALL USING (auth.uid() = host_id);

CREATE POLICY "Voir ses appels" ON active_calls FOR SELECT 
USING (auth.uid() = caller_id OR auth.uid() = receiver_id);

CREATE POLICY "Gerer ses appels" ON active_calls FOR UPDATE 
USING (auth.uid() = caller_id OR auth.uid() = receiver_id);

CREATE POLICY "Lancer un appel" ON active_calls FOR INSERT 
WITH CHECK (auth.uid() = caller_id);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON live_sessions(status);
CREATE INDEX IF NOT EXISTS idx_live_sessions_host_id ON live_sessions(host_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_started_at ON live_sessions(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_active_calls_caller_id ON active_calls(caller_id);
CREATE INDEX IF NOT EXISTS idx_active_calls_receiver_id ON active_calls(receiver_id);
CREATE INDEX IF NOT EXISTS idx_active_calls_status ON active_calls(status);
CREATE INDEX IF NOT EXISTS idx_active_calls_created_at ON active_calls(created_at DESC);

-- Fonctions pour les sessions LIVE
CREATE OR REPLACE FUNCTION start_live_session(
    p_channel_id UUID,
    p_host_id UUID,
    p_title VARCHAR(255)
)
RETURNS UUID AS $$
DECLARE
    v_session_id UUID;
BEGIN
    INSERT INTO live_sessions (channel_id, host_id, title, status)
    VALUES (p_channel_id, p_host_id, p_title, 'live')
    RETURNING id INTO v_session_id;
    
    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION end_live_session(p_session_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE live_sessions 
    SET status = 'ended' 
    WHERE id = p_session_id AND host_id = auth.uid();
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_live_viewers(p_session_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE live_sessions 
    SET viewer_count = viewer_count + 1 
    WHERE id = p_session_id AND status = 'live';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonctions pour les appels
CREATE OR REPLACE FUNCTION initiate_call(
    p_receiver_id UUID,
    p_offer JSONB
)
RETURNS UUID AS $$
DECLARE
    v_call_id UUID;
BEGIN
    INSERT INTO active_calls (caller_id, receiver_id, offer)
    VALUES (auth.uid(), p_receiver_id, p_offer)
    RETURNING id INTO v_call_id;
    
    RETURN v_call_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION accept_call(
    p_call_id UUID,
    p_answer JSONB
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE active_calls 
    SET status = 'accepted', answer = p_answer
    WHERE id = p_call_id AND receiver_id = auth.uid() AND status = 'ringing';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reject_call(p_call_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE active_calls 
    SET status = 'rejected'
    WHERE id = p_call_id AND receiver_id = auth.uid() AND status = 'ringing';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION end_call(p_call_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE active_calls 
    SET status = 'ended'
    WHERE id = p_call_id AND (caller_id = auth.uid() OR receiver_id = auth.uid());
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers pour les notifications en temps réel
CREATE OR REPLACE FUNCTION notify_live_session_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Notifier tous les clients qu'une session live a changé
    PERFORM pg_notify(
        'live_session_update',
        json_build_object(
            'id', NEW.id,
            'channel_id', NEW.channel_id,
            'host_id', NEW.host_id,
            'title', NEW.title,
            'status', NEW.status,
            'viewer_count', NEW.viewer_count,
            'started_at', NEW.started_at
        )::text
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_call_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Notifier uniquement les participants de l'appel
    PERFORM pg_notify(
        'call_update_' || COALESCE(NEW.caller_id, OLD.caller_id) || '_' || COALESCE(NEW.receiver_id, OLD.receiver_id),
        json_build_object(
            'id', COALESCE(NEW.id, OLD.id),
            'caller_id', COALESCE(NEW.caller_id, OLD.caller_id),
            'receiver_id', COALESCE(NEW.receiver_id, OLD.receiver_id),
            'status', COALESCE(NEW.status, OLD.status),
            'created_at', COALESCE(NEW.created_at, OLD.created_at)
        )::text
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Création des triggers
CREATE TRIGGER trigger_live_session_update
    AFTER INSERT OR UPDATE ON live_sessions
    FOR EACH ROW EXECUTE FUNCTION notify_live_session_update();

CREATE TRIGGER trigger_call_update
    AFTER INSERT OR UPDATE ON active_calls
    FOR EACH ROW EXECUTE FUNCTION notify_call_update();

-- Vue pour les sessions live actives
CREATE OR REPLACE VIEW active_live_sessions AS
SELECT 
    ls.id,
    ls.channel_id,
    ls.host_id,
    ls.title,
    ls.status,
    ls.started_at,
    ls.viewer_count,
    cp.username as host_username,
    cp.full_name as host_name,
    cp.avatar_url as host_avatar
FROM live_sessions ls
LEFT JOIN chat_profiles cp ON ls.host_id = cp.id
WHERE ls.status = 'live'
ORDER BY ls.started_at DESC;

-- Vue pour les appels actifs
CREATE OR REPLACE VIEW user_active_calls AS
SELECT 
    ac.id,
    ac.caller_id,
    ac.receiver_id,
    ac.status,
    ac.created_at,
    caller.username as caller_username,
    caller.full_name as caller_name,
    caller.avatar_url as caller_avatar,
    receiver.username as receiver_username,
    receiver.full_name as receiver_name,
    receiver.avatar_url as receiver_avatar
FROM active_calls ac
LEFT JOIN chat_profiles caller ON ac.caller_id = caller.id
LEFT JOIN chat_profiles receiver ON ac.receiver_id = receiver.id
WHERE ac.status IN ('ringing', 'accepted')
ORDER BY ac.created_at DESC;
