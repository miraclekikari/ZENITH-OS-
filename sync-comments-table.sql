-- ZENITH-OS: Synchronisation de la table comments avec author_id
-- Exécuter dans l'éditeur SQL Supabase pour corriger la structure

-- 1. Mettre à jour la table comments pour utiliser author_id au lieu de user_id
ALTER TABLE comments RENAME COLUMN user_id TO author_id;

-- 2. Ajouter une contrainte pour s'assurer que author_id n'est jamais null
ALTER TABLE comments ALTER COLUMN author_id SET NOT NULL;

-- 3. Mettre à jour les valeurs existantes si nécessaire
UPDATE comments SET author_id = 'u1' WHERE author_id IS NULL OR author_id = '';

-- 4. Vérifier la structure actuelle
\d comments;

-- 5. Insérer quelques données de test si la table est vide
INSERT INTO comments (id, post_id, author_id, content) 
SELECT 
  'c-' || gen_random_uuid()::text,
  p.id,
  'u1',
  'Commentaire de test du système Zenith'
FROM posts p 
WHERE NOT EXISTS (SELECT 1 FROM comments LIMIT 1)
LIMIT 1;

-- 6. Afficher les commentaires pour vérification
SELECT * FROM comments ORDER BY created_at DESC LIMIT 5;
