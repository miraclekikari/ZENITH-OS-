export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
  status?: 'online' | 'offline' | 'streaming'; // Added for LIVE indicator
  // Instagram-style fields
  banner_url?: string;
  website?: string;
  location?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_verified?: boolean;
}

export interface Post {
  id: number; // Corrected from string to number
  user_id: string; // Kept as string (UUID)
  image_url: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  is_liked?: boolean;
  type?: 'image' | 'video';
}
