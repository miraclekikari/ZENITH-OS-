import { supabase } from './supabaseClient';
import { DEFAULT_USER_ID } from './constants';
import { UserId, Community } from '../types';

// Types partiels pour les insertions
interface PostInsert {
  content: string | null;
  image_url: string | null;
  author_id: UserId;
}

interface CommentInsert {
    post_id: string;
    author_id: UserId;
    content: string;
}

interface PostLikeInsert {
  post_id: string;
  author_id: UserId;
}

interface StoryInsert {
  author_id: UserId;
  image_url: string;
}

interface CommunityInsert {
    name: string;
    description: string;
    is_private: boolean;
    topic: string;
    owner_id: UserId;
}


// --- Fonctions d'écriture ---

export const createPost = (content: string | null, imageUrl: string | null) => {
  const postData: PostInsert = {
    content,
    image_url: imageUrl,
    author_id: DEFAULT_USER_ID,
  };
  return supabase.from('posts').insert(postData).select().single();
};

export const createComment = (postId: string, content: string) => {
    const commentData: CommentInsert = {
        post_id: postId,
        author_id: DEFAULT_USER_ID,
        content,
    };
    return supabase.from('comments').insert(commentData);
};

export const togglePostLike = async (postId: string, isLiked: boolean) => {
  const authorId = DEFAULT_USER_ID;
  
  if (isLiked) {
    return supabase.from('post_likes').delete().eq('post_id', postId).eq('author_id', authorId);
  } else {
    const likeData: PostLikeInsert = { post_id: postId, author_id: authorId };
    return supabase.from('post_likes').insert(likeData);
  }
};

export const createStory = (imageUrl: string) => {
  const storyData: StoryInsert = {
    author_id: DEFAULT_USER_ID,
    image_url: imageUrl,
  };
  return supabase.from('stories').insert(storyData);
};

export const createCommunity = (name: string, description: string, topic: string, isPrivate: boolean) => {
    const communityData: CommunityInsert = {
        name,
        description,
        topic,
        is_private: isPrivate,
        owner_id: DEFAULT_USER_ID
    };
    return supabase.from('communities').insert(communityData).select().single();
}

// --- Fonctions de lecture ---

export const getPosts = () => {
  return supabase
    .from('posts')
    .select('*, profiles(username, avatar_url, full_name)')
    .order('created_at', { ascending: false });
};

export const getComments = (postId?: string) => {
  let query = supabase
    .from('comments')
    .select('*, profiles(username, avatar_url, full_name)');
  
  if (postId) {
    query = query.eq('post_id', postId);
  }
  
  return query.order('created_at', { ascending: true });
};

export const getPostLikes = () => {
  return supabase.from('post_likes').select('post_id, author_id');
};

export const getStories = () => {
  return supabase
    .from('stories')
    .select('*, profiles(username, avatar_url)') // Inclure les profils
    .order('created_at', { ascending: false });
};

export const getCommunities = () => {
    return supabase
        .from('communities')
        .select('*, members_count:profiles!communities_members(count)') // Renommer le comptage pour plus de clarté
        .order('name', { ascending: true });
};
