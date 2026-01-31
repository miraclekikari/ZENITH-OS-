
import { createClient } from '@supabase/supabase-js';

// Utilisation des variables d'environnement Vite pour la sécurité
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERREUR : Les clés Supabase sont manquantes dans le fichier .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
