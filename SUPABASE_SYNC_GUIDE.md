# 🚀 Guide de Synchronisation Supabase - ZENITH-OS

## 📋 État actuel
- ✅ Code TypeScript corrigé (utilise `author_id`)
- ✅ CommentsDrawer optimisé (z-index, opacité, design)
- ⚠️ Base de données Supabase à synchroniser

## 🔧 Étapes à exécuter dans Supabase

### 1. Synchronisation complète (RECOMMANDÉ)
Exécutez le contenu de `full-sync-database.sql` dans l'éditeur SQL Supabase :

```sql
-- Copier-coller tout le contenu du fichier full-sync-database.sql
```

### 2. Ou synchronisation manuelle

#### A. Corriger la table comments
```sql
-- Renommer user_id en author_id
ALTER TABLE comments RENAME COLUMN user_id TO author_id;

-- Mettre à jour les valeurs
UPDATE comments SET author_id = 'u1' WHERE author_id IS NULL;
```

#### B. Créer la table profiles
```sql
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT 'u1',
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insérer l'admin
INSERT INTO profiles (id, username, full_name, bio, avatar_url)
VALUES ('u1', 'Zenith_Architect', 'Admin Root', 'Construction du réseau Zenith...', 'https://api.dicebear.com/7.x/bottts/svg?seed=admin');
```

#### C. Désactiver RLS (déjà fait)
```sql
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
```

## 🧪 Vérification

Après exécution, vérifiez avec :

```sql
-- Vérifier les structures
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('posts', 'comments', 'profiles')
ORDER BY table_name;

-- Vérifier les données
SELECT COUNT(*) as posts_count FROM posts;
SELECT COUNT(*) as comments_count FROM comments;
SELECT * FROM profiles;
```

## 🎯 Résultat attendu

- ✅ Table `comments` avec colonne `author_id`
- ✅ Table `profiles` avec admin `u1`
- ✅ RLS désactivé pour les tests
- ✅ Données de test disponibles

## 🔄 Si problèmes

### Erreur "column user_id does not exist"
-> Exécutez le script de synchronisation complète

### Erreur "table comments does not exist"
-> La table sera créée automatiquement par le script

### Comments ne s'affichent pas
-> Vérifiez que `author_id` est bien utilisé dans le code

## 📞 Support

Le code est prêt, il ne manque que l'exécution SQL dans Supabase !
