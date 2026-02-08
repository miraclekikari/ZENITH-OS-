import { supabase } from './supabaseClient';
import { DEFAULT_USER_ID } from './constants';
import { UserId, SupabasePost, SupabaseComment, SupabasePostLike, SupabaseStory } from '../types';

// Types partiels pour les insertions (id et created_at générés par Supabase)
interface PostInsert {
  content: string | null;
  image_url: string | null;
  user_id: UserId;
}

interface PostLikeInsert {
  post_id: string;
  user_id: UserId;
}

interface StoryInsert {
  user_id: UserId;
  image_url: string;
}

// Service pour les opérations Supabase avec types explicites

export const createPost = async (content: string | null, imageUrl: string | null) => {
  const postData: PostInsert = {
    content: content || '', // Utiliser une chaîne vide par défaut si null
    image_url: imageUrl,
    user_id: DEFAULT_USER_ID as UserId, // Forcé explicitement en string
  };

  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single();

  return { data, error };
};

export const createComment = async (postId: string, content: string) => {
  const commentData: SupabaseComment = {
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    post_id: postId,
    user_id: DEFAULT_USER_ID as UserId, // Forcé explicitement en string
    content,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('comments')
    .insert(commentData);

  return { data, error };
};

export const togglePostLike = async (postId: string, isLiked: boolean) => {
  const userId = DEFAULT_USER_ID as UserId; // Forcé explicitement en string

  if (isLiked) {
    // Supprimer le like
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    return { error };
  } else {
    // Ajouter un like
    const likeData: PostLikeInsert = {
      post_id: postId,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('post_likes')
      .insert(likeData);
    return { data, error };
  }
};

export const createStory = async (imageUrl: string) => {
  const storyData: StoryInsert = {
    user_id: DEFAULT_USER_ID as UserId, // Forcé explicitement en string
    image_url: imageUrl,
  };

  const { data, error } = await supabase
    .from('stories')
    .insert(storyData);

  return { data, error };
};

// Fonctions de lecture
export const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

export const getComments = async (postId?: string) => {
  let query = supabase
    .from('comments')
    .select('*');
  
  if (postId) {
    query = query.eq('post_id', postId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: true });

  return { data, error };
};

export const getPostLikes = async () => {
  const { data, error } = await supabase
    .from('post_likes')
    .select('post_id, user_id');

  return { data, error };
};

export const getStories = async () => {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};
