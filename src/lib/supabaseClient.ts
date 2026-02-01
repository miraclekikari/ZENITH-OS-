import { createClient } from '@supabase/supabase-js';

// GitHub injectera automatiquement tes secrets ici lors du déploiement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
