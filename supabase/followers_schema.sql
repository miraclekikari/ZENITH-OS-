-- Table pour les followers (abonnés)
CREATE TABLE IF NOT EXISTS followers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id TEXT NOT NULL REFERENCES chat_profiles(id) ON DELETE CASCADE,
    following_id TEXT NOT NULL REFERENCES chat_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON followers(following_id);
CREATE INDEX IF NOT EXISTS idx_followers_created_at ON followers(created_at DESC);

-- Politiques RLS (Row Level Security)
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

-- Politiques pour les followers
CREATE POLICY "Users can view all followers" ON followers FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows" ON followers FOR ALL USING (
    auth.uid() = follower_id OR auth.uid() = following_id
);

-- Fonction pour obtenir le nombre de followers
CREATE OR REPLACE FUNCTION get_followers_count(user_id TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM followers
        WHERE following_id = user_id
    );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir le nombre de following
CREATE OR REPLACE FUNCTION get_following_count(user_id TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM followers
        WHERE follower_id = user_id
    );
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement les compteurs
CREATE OR REPLACE FUNCTION update_profile_followers_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Ajout d'un follower
        UPDATE chat_profiles 
        SET followers_count = followers_count + 1 
        WHERE id = NEW.following_id;
        
        UPDATE chat_profiles 
        SET following_count = following_count + 1 
        WHERE id = NEW.follower_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Suppression d'un follower
        UPDATE chat_profiles 
        SET followers_count = GREATEST(followers_count - 1, 0) 
        WHERE id = OLD.following_id;
        
        UPDATE chat_profiles 
        SET following_count = GREATEST(following_count - 1, 0) 
        WHERE id = OLD.follower_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Création des triggers
CREATE TRIGGER trigger_update_profile_followers_count
    AFTER INSERT OR DELETE ON followers
    FOR EACH ROW EXECUTE FUNCTION update_profile_followers_count();
