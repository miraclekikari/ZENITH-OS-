import { supabase } from './supabaseClient';

// Stats du profil
export const getProfileStats = async (userId: string) => {
  try {
    // Nombre de posts (fragments)
    const { count: postsCount, error: postsError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId);

    // Followers (simulation - à implémenter avec une table follows)
    const followersCount = 0; // Placeholder

    // Following (simulation - à implémenter avec une table follows)
    const followingCount = 0; // Placeholder

    return {
      posts: postsCount || 0,
      followers: followersCount,
      following: followingCount,
      error: postsError
    };
  } catch (error) {
    console.error('Erreur récupération stats profil:', error);
    return {
      posts: 0,
      followers: 0,
      following: 0,
      error
    };
  }
};

// Récupérer les posts d'un utilisateur
export const getUserPosts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(username, avatar_url, full_name, is_verified)')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error('Erreur récupération posts utilisateur:', error);
    return { data: [], error };
  }
};

// Récupérer un profil par username
export const getProfileByUsername = async (username: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    return { data, error };
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    return { data: null, error };
  }
};

// Recherche de profils
export const searchProfiles = async (query: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url, is_verified')
      .ilike('username', `%${query}%`)
      .limit(10);

    return { data, error };
  } catch (error) {
    console.error('Erreur recherche profils:', error);
    return { data: [], error };
  }
};

export default {
  getProfileStats,
  getUserPosts,
  getProfileByUsername,
  searchProfiles
};
