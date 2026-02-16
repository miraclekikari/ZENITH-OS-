-- Table pour les posts Instagram-style
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES chat_profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les likes sur les posts
CREATE TABLE IF NOT EXISTS post_likes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES chat_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Table pour les commentaires sur les posts
CREATE TABLE IF NOT EXISTS post_comments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES chat_profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les posts sauvegardés
CREATE TABLE IF NOT EXISTS saved_posts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES chat_profiles(id) ON DELETE CASCADE,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_posts_user_id ON saved_posts(user_id);

-- Politiques RLS (Row Level Security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

-- Politiques pour les posts
CREATE POLICY "Users can view all posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour les likes
CREATE POLICY "Users can view all likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour les commentaires
CREATE POLICY "Users can view all comments" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON post_comments FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour les posts sauvegardés
CREATE POLICY "Users can manage own saved posts" ON saved_posts FOR ALL USING (auth.uid() = user_id);

-- Fonctions pour mettre à jour les compteurs
CREATE OR REPLACE FUNCTION increment_post_likes(post_id_param TEXT)
RETURNS void AS $$
BEGIN
    UPDATE posts 
    SET likes_count = likes_count + 1 
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_id_param TEXT)
RETURNS void AS $$
BEGIN
    UPDATE posts 
    SET likes_count = GREATEST(likes_count - 1, 0) 
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_post_comments(post_id_param TEXT)
RETURNS void AS $$
BEGIN
    UPDATE posts 
    SET comments_count = comments_count + 1 
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_post_comments(post_id_param TEXT)
RETURNS void AS $$
BEGIN
    UPDATE posts 
    SET comments_count = GREATEST(comments_count - 1, 0) 
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour automatiquement les compteurs
CREATE OR REPLACE FUNCTION update_post_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF TG_TABLE_NAME = 'post_likes' THEN
            PERFORM increment_post_likes(NEW.post_id);
        ELSIF TG_TABLE_NAME = 'post_comments' THEN
            PERFORM increment_post_comments(NEW.post_id);
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF TG_TABLE_NAME = 'post_likes' THEN
            PERFORM decrement_post_likes(OLD.post_id);
        ELSIF TG_TABLE_NAME = 'post_comments' THEN
            PERFORM decrement_post_comments(OLD.post_id);
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Création des triggers
CREATE TRIGGER trigger_update_post_counters
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_counters();

CREATE TRIGGER trigger_update_post_counters_comments
    AFTER INSERT OR DELETE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_post_counters();

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at
    BEFORE UPDATE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
