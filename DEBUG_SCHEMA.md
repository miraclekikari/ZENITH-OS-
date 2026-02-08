# 🔍 DEBUG - Erreurs 404/400 Supabase Cache PostgREST

## 🚨 **Problème identifié**
Le cache PostgREST de Supabase ne reconnaît pas les colonnes `author_id` récemment renommées.

## 📋 **Actions immédiates à exécuter**

### 1. **ACCÈS AU DIAGNOSTIC**
Navigateur → `http://localhost:5173/#/diagnostic`

Cette page affichera :
- ✅ État de connexion Supabase
- ✅ Validation des colonnes `author_id` par table
- ✅ Test des jointures avec `profiles`
- 🔘 Bouton "Recharger Schéma" pour forcer le cache

### 2. **RECHARGEMENT MANUEL DU CACHE**
Si le diagnostic échoue, exécutez dans la console Supabase :
```sql
-- Forcer le rechargement du cache PostgREST
NOTIFY pgrst, 'reload schema';
```

### 3. **VÉRIFICATION VARIABLES ENV**
Vérifiez que `.env.local` contient :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anonyme
```

### 4. **VALIDATION TABLES**
Assurez-vous que les tables ont bien `author_id` :
```sql
-- Vérifier posts
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts' AND column_name = 'author_id';

-- Vérifier comments
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'comments' AND column_name = 'author_id';
```

## 🔧 **Scripts créés**

### `src/lib/schemaReload.ts`
- `reloadSchema()` : Force le rechargement du cache
- `validateSchema()` : Valide toutes les colonnes `author_id`

### `src/components/SchemaDiagnostic.tsx`
- Interface complète de diagnostic
- Tests automatiques de connexion et schéma
- Bouton de rechargement manuel

## 📝 **Vérifications effectuées**

### ✅ **Fichiers vérifiés**
- `supabaseClient.ts` : Commentaire mis à jour
- `supabaseService.ts` : Toutes les requêtes utilisent `author_id`
- `types.ts` : Interfaces avec `author_id`
- `Community.tsx` : Mapping avec `profiles`

### ✅ **Routes ajoutées**
- `/diagnostic` : Outil de diagnostic complet

## 🚀 **Solution recommandée**

1. **Ouvrir** `http://localhost:5173/#/diagnostic`
2. **Cliquer** sur "Recharger Schéma" si nécessaire
3. **Vérifier** que toutes les tables sont vertes
4. **Tester** l'application normale

Si le problème persiste :
- Redémarrer le serveur de développement
- Vider le cache du navigateur
- Contacter le support Supabase pour recharger le cache PostgREST

## 📞 **Support**
- Supabase Dashboard → Settings → Database → Reset Database Password
- Documentation PostgREST : https://postgrest.org/en/latest/configuration.html
