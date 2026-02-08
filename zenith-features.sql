-- ZENITH-OS: Fonctionnalités avancées - Schema SQL
-- Exécuter dans l'éditeur SQL Supabase

-- =====================================================
-- 1. STATUS OS: Badges de connexion automatiques
-- =====================================================

-- Table pour suivre le statut des utilisateurs
CREATE TABLE IF NOT EXISTS user_status (
  user_id TEXT PRIMARY KEY DEFAULT 'u1',
  status TEXT NOT NULL DEFAULT 'offline', -- 'online', 'offline', 'deep_sleep', 'away'
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_status_updated_at 
    BEFORE UPDATE ON user_status 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour déterminer le statut automatiquement
CREATE OR REPLACE FUNCTION determine_user_status(last_seen TIMESTAMPTZ)
RETURNS TEXT AS $$
BEGIN
    IF EXTRACT(EPOCH FROM (now() - last_seen)) < 300 THEN -- 5 minutes
        RETURN 'online';
    ELSIF EXTRACT(EPOCH FROM (now() - last_seen)) < 1800 THEN -- 30 minutes
        RETURN 'away';
    ELSIF EXTRACT(EPOCH FROM (now() - last_seen)) < 86400 THEN -- 24 heures
        RETURN 'deep_sleep';
    ELSE
        RETURN 'offline';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. NEURAL SEARCH: Indexation et recherche IA
-- =====================================================

-- Table pour les métadonnées de recherche IA
CREATE TABLE IF NOT EXISTS neural_search_index (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id),
  search_vector TEXT, -- Vector de recherche (tags, contenu analysé)
  image_analysis TEXT, -- Analyse de l'image par IA
  themes TEXT[], -- Thèmes extraits par IA
  confidence_score FLOAT DEFAULT 0.0,
  indexed_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger pour updated_at
CREATE TRIGGER update_neural_search_updated_at 
    BEFORE UPDATE ON neural_search_index 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction de recherche neurale
CREATE OR REPLACE FUNCTION neural_search(query_text TEXT, image_query TEXT DEFAULT NULL)
RETURNS TABLE (
  post_id TEXT,
  relevance_score FLOAT,
  match_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nsi.post_id,
        CASE 
            WHEN image_query IS NOT NULL AND nsi.image_analysis ILIKE '%' || image_query || '%' THEN 0.9
            WHEN nsi.search_vector ILIKE '%' || query_text || '%' THEN 0.8
            WHEN query_text = ANY(nsi.themes) THEN 0.95
            ELSE 0.3
        END as relevance_score,
        CASE 
            WHEN image_query IS NOT NULL AND nsi.image_analysis ILIKE '%' || image_query || '%' THEN 'image_match'
            WHEN query_text = ANY(nsi.themes) THEN 'theme_match'
            ELSE 'text_match'
        END as match_type
    FROM neural_search_index nsi
    WHERE 
        (query_text IS NOT NULL AND (
            nsi.search_vector ILIKE '%' || query_text || '%' OR 
            query_text = ANY(nsi.themes)
        ))
        OR (image_query IS NOT NULL AND nsi.image_analysis ILIKE '%' || image_query || '%')
    ORDER BY relevance_score DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. DATA FRAGMENTS: Système de collection avancé
-- =====================================================

-- Table pour les fragments de données collectés
CREATE TABLE IF NOT EXISTS data_fragments (
  id TEXT PRIMARY KEY,
  original_post_id TEXT NOT NULL REFERENCES posts(id),
  collector_user_id TEXT NOT NULL DEFAULT 'u1',
  fragment_type TEXT NOT NULL DEFAULT 'copy', -- 'copy', 'analysis', 'bookmark', 'lab_sample'
  fragment_data JSONB, -- Données personnalisées du fragment
  collection_reason TEXT, -- Pourquoi ce fragment a été collecté
  tags TEXT[], -- Tags personnels du collectionneur
  is_public BOOLEAN DEFAULT false, -- Visible par les autres
  collected_at TIMESTAMPTZ DEFAULT now(),
  last_accessed TIMESTAMPTZ DEFAULT now(),
  access_count INTEGER DEFAULT 0
);

-- Table pour les "Labos" personnels des utilisateurs
CREATE TABLE IF NOT EXISTS user_labs (
  user_id TEXT PRIMARY KEY DEFAULT 'u1',
  lab_name TEXT DEFAULT 'Mon Labo Zenith',
  lab_description TEXT,
  fragment_count INTEGER DEFAULT 0,
  public_fragments INTEGER DEFAULT 0,
  lab_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger pour updated_at et comptage de fragments
CREATE TRIGGER update_user_labs_updated_at 
    BEFORE UPDATE ON user_labs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour le compteur de fragments
CREATE OR REPLACE FUNCTION update_fragment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_labs 
        SET fragment_count = fragment_count + 1,
            public_fragments = public_fragments + CASE WHEN NEW.is_public THEN 1 ELSE 0 END
        WHERE user_id = NEW.collector_user_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.is_public != NEW.is_public THEN
            UPDATE user_labs 
            SET public_fragments = public_fragments + CASE WHEN NEW.is_public THEN 1 ELSE -1 END
            WHERE user_id = NEW.collector_user_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE user_labs 
        SET fragment_count = fragment_count - 1,
            public_fragments = public_fragments - CASE WHEN OLD.is_public THEN 1 ELSE 0 END
        WHERE user_id = OLD.collector_user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour le comptage automatique
CREATE TRIGGER fragment_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON data_fragments
    FOR EACH ROW
    EXECUTE FUNCTION update_fragment_count();

-- =====================================================
-- 4. VUES UTILITAIRES
-- =====================================================

-- Vue combinée pour le statut des utilisateurs avec leurs posts
CREATE OR REPLACE VIEW user_activity_view AS
SELECT 
    p.user_id,
    us.status,
    us.last_seen,
    COUNT(p.id) as post_count,
    MAX(p.created_at) as last_post_at,
    determine_user_status(us.last_seen) as current_status
FROM posts p
LEFT JOIN user_status us ON p.user_id = us.user_id
GROUP BY p.user_id, us.status, us.last_seen;

-- Vue pour les fragments avec détails des posts originaux
CREATE OR REPLACE VIEW lab_fragments_view AS
SELECT 
    df.id,
    df.collector_user_id,
    df.fragment_type,
    df.collection_reason,
    df.tags,
    df.is_public,
    df.collected_at,
    df.access_count,
    p.content as original_content,
    p.image_url as original_image,
    p.created_at as original_created_at,
    ul.lab_name
FROM data_fragments df
JOIN posts p ON df.original_post_id = p.id
JOIN user_labs ul ON df.collector_user_id = ul.user_id;

-- =====================================================
-- 5. INDEXES pour optimisation
-- =====================================================

-- Index pour la recherche neurale
CREATE INDEX IF NOT EXISTS idx_neural_search_vector ON neural_search_index USING gin(to_tsvector('english', search_vector));
CREATE INDEX IF NOT EXISTS idx_neural_search_themes ON neural_search_index USING gin(themes);
CREATE INDEX IF NOT EXISTS idx_neural_search_image ON neural_search_index USING gin(to_tsvector('english', image_analysis));

-- Index pour les fragments
CREATE INDEX IF NOT EXISTS idx_data_fragments_collector ON data_fragments(collector_user_id);
CREATE INDEX IF NOT EXISTS idx_data_fragments_post ON data_fragments(original_post_id);
CREATE INDEX IF NOT EXISTS idx_data_fragments_tags ON data_fragments USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_data_fragments_public ON data_fragments(is_public) WHERE is_public = true;

-- Index pour le statut utilisateur
CREATE INDEX IF NOT EXISTS idx_user_status_last_seen ON user_status(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_user_status_active ON user_status(is_active) WHERE is_active = true;

-- =====================================================
-- 6. RLS (Row Level Security) - Activer si nécessaire
-- =====================================================

-- Décommenter ces lignes pour activer la sécurité au niveau des lignes
/*
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE neural_search_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_labs ENABLE ROW LEVEL SECURITY;

-- Policies pour user_status
CREATE POLICY "Users can view their own status" ON user_status
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own status" ON user_status
    FOR UPDATE USING (user_id = auth.uid()::text);

-- Policies pour data_fragments
CREATE POLICY "Users can view their own fragments" ON data_fragments
    FOR SELECT USING (collector_user_id = auth.uid()::text);

CREATE POLICY "Users can view public fragments" ON data_fragments
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own fragments" ON data_fragments
    FOR ALL USING (collector_user_id = auth.uid()::text);
*/

-- =====================================================
-- 7. DONNÉES INITIALES
-- =====================================================

-- Créer le labo pour l'utilisateur par défaut
INSERT INTO user_labs (user_id, lab_name, lab_description)
VALUES ('u1', 'Zenith Core Lab', 'Laboratoire principal du système Zenith')
ON CONFLICT (user_id) DO NOTHING;

-- Initialiser le statut de l'utilisateur par défaut
INSERT INTO user_status (user_id, status, is_active)
VALUES ('u1', 'online', true)
ON CONFLICT (user_id) DO UPDATE SET 
    status = EXCLUDED.status,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- =====================================================
-- 8. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour collecter un fragment de données
CREATE OR REPLACE FUNCTION collect_data_fragment(
    post_id_param TEXT,
    collector_id TEXT DEFAULT 'u1',
    fragment_type_param TEXT DEFAULT 'copy',
    reason_param TEXT DEFAULT 'Collection personnelle',
    tags_param TEXT[] DEFAULT '{}',
    is_public_param BOOLEAN DEFAULT false
)
RETURNS TEXT AS $$
DECLARE
    fragment_id TEXT;
BEGIN
    fragment_id := 'f-' || to_char(now(), 'YYYY-MM-DD-HH24-MI-SS') || '-' || substr(md5(random()::text), 1, 8);
    
    INSERT INTO data_fragments (
        id, original_post_id, collector_user_id, fragment_type,
        collection_reason, tags, is_public
    ) VALUES (
        fragment_id, post_id_param, collector_id, fragment_type_param,
        reason_param, tags_param, is_public_param
    );
    
    RETURN fragment_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le statut utilisateur
CREATE OR REPLACE FUNCTION update_user_status(
    user_id_param TEXT DEFAULT 'u1',
    status_param TEXT DEFAULT 'online'
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO user_status (user_id, status, last_seen, is_active)
    VALUES (user_id_param, status_param, now(), true)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        status = EXCLUDED.status,
        last_seen = now(),
        is_active = true,
        updated_at = now();
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

COMMIT;
