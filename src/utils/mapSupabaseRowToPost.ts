import { Post } from '../types';
import { DEFAULT_USER_ID } from '../lib/constants';

export function mapSupabaseRowToPost(
  row: any, // Use 'any' for flexibility with Supabase rows
  likeCount: Record<string, number>,
  commentCount: Record<string, number>,
  likedByUser: Set<string>
): Post {

  // ID is a string (UUID) from Supabase, no conversion needed.
  const id = row.id;

  const content = typeof row.content === 'string' ? row.content : '';
  const image = typeof row.image_url === 'string' ? row.image_url : undefined;
  
  // Author and Profile data
  const authorId = row.author_id ?? row.user_id ?? DEFAULT_USER_ID;
  const profile = row.profiles || {}; // Ensure profile is an object
  const username = profile.username || String(authorId);
  const avatarUrl = profile.avatar_url;
  const isVerified = profile.is_verified || false;

  const avatar = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
  const timestamp = row.created_at || new Date().toISOString();

  return {
    id, // Keep as string
    author: profile.full_name || username,
    username,
    avatar,
    content,
    image,
    likes: likeCount[id] ?? Number(row.likes_count ?? row.likes ?? 0),
    comments: commentCount[id] ?? Number(row.comments_count ?? row.comments ?? 0),
    shares: Number(row.shares ?? 0),
    isVerified,
    timestamp,
    isModerated: false, // Default value
    isLiked: likedByUser.has(id), // Check if the user has liked this post
    isReposted: false // Default value
  };
}
