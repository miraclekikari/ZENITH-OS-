import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in your .env file.');
}

/** Client Supabase. Tables attendues: posts, comments, post_likes, stories (ids/author_id en TEXT). */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
