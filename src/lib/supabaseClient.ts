import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/** Client Supabase. Tables attendues: posts, comments, post_likes, stories (ids/user_id en TEXT). */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
