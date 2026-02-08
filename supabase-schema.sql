-- ZENITH-OS: Schéma Supabase (tous les champs concernés en TEXT pour cohérence avec le front)
-- Exécuter dans l’éditeur SQL du projet Supabase si les tables n’existent pas.

-- Table posts (déjà souvent créée)
-- id peut être UUID par défaut Supabase ; si vous voulez du TEXT, créez la table manuellement :
-- CREATE TABLE posts (
--   id TEXT PRIMARY KEY DEFAULT ('p-' || gen_random_uuid()::text),
--   content TEXT,
--   image_url TEXT,
--   user_id TEXT NOT NULL DEFAULT 'u1',
--   created_at TIMESTAMPTZ DEFAULT now()
-- );

-- Table post_likes (composite: un like par (post_id, user_id))
-- post_id doit avoir le même type que posts.id (TEXT ou UUID)
CREATE TABLE IF NOT EXISTS post_likes (
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'u1',
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- Table comments
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'u1',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table stories
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'u1',
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security): activer si besoin et créer des policies pour anon/authenticated.
