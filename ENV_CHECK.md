# 🔍 VÉRIFICATION VARIABLES ENVIRONNEMENT

## Variables requises pour le déploiement

### ⚠️ **Vérification manuelle requise**

Dans votre fichier de déploiement (Vercel, Netlify, etc.), assurez-vous d'avoir :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 📍 **Où vérifier**

1. **Dashboard Supabase** → Settings → API
2. **Projet URL** : `https://[project-id].supabase.co`
3. **anon public** : Clé publique (commence par `eyJ...`)

### 🚨 **Points critiques**

- ✅ `VITE_` préfixe requis pour Vite
- ✅ URL complète avec `https://`
- ✅ Clé ANON (pas la SERVICE ROLE KEY)
- ✅ Pas de guillemets supplémentaires

### 🔧 **Test de validation**

```bash
# En local
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Should return valid URL and key
```
