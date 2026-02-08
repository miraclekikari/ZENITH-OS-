-- ZENITH-OS: Synchronisation complète de la base de données
-- Exécuter dans l'éditeur SQL Supabase après avoir appliqué les autres schémas

-- =====================================================
-- 1. Vérification et correction de la table comments
-- =====================================================

-- Vérifier si la colonne user_id existe encore
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'comments' 
        AND column_name = 'user_id'
    ) THEN
        -- Renommer user_id en author_id
        ALTER TABLE comments RENAME COLUMN user_id TO author_id;
        RAISE NOTICE 'Colonne user_id renommée en author_id dans comments';
    END IF;
END $$;

-- Assurer que author_id n'est pas null
ALTER TABLE comments ALTER COLUMN author_id SET NOT NULL;

-- Mettre à jour les valeurs vides ou nulles
UPDATE comments SET author_id = 'u1' WHERE author_id IS NULL OR author_id = '';

-- =====================================================
-- 2. Création de la table profiles si elle n'existe pas
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT 'u1',
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insérer le profil admin s'il n'existe pas
INSERT INTO profiles (id, username, full_name, bio, avatar_url)
VALUES ('u1', 'Zenith_Architect', 'Admin Root', 'Construction du réseau Zenith en cours...', 'https://api.dicebear.com/7.x/bottts/svg?seed=admin')
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = now();

-- =====================================================
-- 3. Vérification des tables principales
-- =====================================================

-- Posts table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
        CREATE TABLE posts (
          id TEXT PRIMARY KEY DEFAULT ('p-' || gen_random_uuid()::text),
          content TEXT,
          image_url TEXT,
          user_id TEXT NOT NULL DEFAULT 'u1',
          created_at TIMESTAMPTZ DEFAULT now()
        );
        RAISE NOTICE 'Table posts créée';
    END IF;
END $$;

-- Post likes table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'post_likes') THEN
        CREATE TABLE post_likes (
          post_id TEXT NOT NULL,
          user_id TEXT NOT NULL DEFAULT 'u1',
          created_at TIMESTAMPTZ DEFAULT now(),
          PRIMARY KEY (post_id, user_id)
        );
        RAISE NOTICE 'Table post_likes créée';
    END IF;
END $$;

-- Stories table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stories') THEN
        CREATE TABLE stories (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL DEFAULT 'u1',
          image_url TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now()
        );
        RAISE NOTICE 'Table stories créée';
    END IF;
END $$;

-- Comments table (déjà gérée ci-dessus)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comments') THEN
        CREATE TABLE comments (
          id TEXT PRIMARY KEY,
          post_id TEXT NOT NULL,
          author_id TEXT NOT NULL DEFAULT 'u1',
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now()
        );
        RAISE NOTICE 'Table comments créée avec author_id';
    END IF;
END $$;

-- =====================================================
-- 4. Données de test si les tables sont vides
-- =====================================================

-- Post de test
INSERT INTO posts (content, image_url, user_id)
SELECT 
  'Premier post du système Zenith - Système d''Exploitation Social',
  'https://picsum.photos/seed/zenith-first-post/400/300',
  'u1'
WHERE NOT EXISTS (SELECT 1 FROM posts LIMIT 1);

-- Commentaire de test
INSERT INTO comments (id, post_id, author_id, content)
SELECT 
  'c-' || gen_random_uuid()::text,
  p.id,
  'u1',
  'Commentaire inaugural du réseau Zenith !'
FROM posts p
WHERE NOT EXISTS (SELECT 1 FROM comments LIMIT 1)
LIMIT 1;

-- Story de test
INSERT INTO stories (id, user_id, image_url)
SELECT 
  's-' || gen_random_uuid()::text,
  'u1',
  'https://picsum.photos/seed/zenith-story/200/300'
WHERE NOT EXISTS (SELECT 1 FROM stories LIMIT 1);

-- =====================================================
-- 5. Vérification finale
-- =====================================================

-- Afficher l'état actuel
SELECT 'posts' as table_name, COUNT(*) as row_count FROM posts
UNION ALL
SELECT 'comments' as table_name, COUNT(*) as row_count FROM comments
UNION ALL
SELECT 'post_likes' as table_name, COUNT(*) as row_count FROM post_likes
UNION ALL
SELECT 'stories' as table_name, COUNT(*) as row_count FROM stories
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
ORDER BY table_name;

-- Afficher les structures des tables pour vérification
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name IN ('posts', 'comments', 'post_likes', 'stories', 'profiles')
ORDER BY table_name, ordinal_position;

RAISE NOTICE 'Synchronisation de la base de données ZENITH terminée !';
