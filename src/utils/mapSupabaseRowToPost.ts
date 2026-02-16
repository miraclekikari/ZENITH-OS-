import { Post } from '../types';
import { DEFAULT_USER_ID } from '../lib/constants';

/**
 * Map une ligne Supabase (posts) vers le type Post + merge likes/comments/isLiked depuis post_likes et comments
 * Optimisation: Fonction extraite pour éviter les recréations à chaque render
 */
export function mapSupabaseRowToPost(
  row: Record<string, unknown>,
  likeCount: Record<string, number>,
  commentCount: Record<string, number>,
  likedByUser: Set<string>
): Post {
  const id = typeof row.id === 'string' ? row.id : String(row.id ?? '');
  const content = typeof row.content === 'string' ? row.content : '';
  const imageUrl = row.image_url ?? row.image;
  const image = typeof imageUrl === 'string' ? imageUrl : undefined;
  const authorId = (row.author_id ?? DEFAULT_USER_ID) as string;
  
  // Utiliser les données du profil si disponibles
  const profile = row.profiles as any;
  const username = profile?.username || String(authorId);
  const fullName = profile?.full_name || username;
  const avatarUrl = profile?.avatar_url;
  const isVerified = profile?.is_verified || false;
  
  // Avatar par défaut si non fourni
  const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
  const avatar = avatarUrl || defaultAvatar;
  
  const created = row.created_at ?? row.timestamp;
  const timestamp = typeof created === 'string' ? created : (created ? new Date(created as string).toISOString() : new Date().toISOString());
  
  return {
    id,
    author: fullName,
    username, // Ajouter le username pour la navigation
    avatar,
    content,
    image,
    likes: likeCount[id] ?? Number(row.likes) ?? 0,
    comments: commentCount[id] ?? Number(row.comments) ?? 0,
    shares: Number(row.shares) || 0,
    isVerified,
    timestamp,
    isModerated: false,
    isLiked: likedByUser.has(id),
    isReposted: false
  };
}
