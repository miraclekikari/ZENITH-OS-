export type UserRole = 'USER' | 'ADMIN' | 'ROOT';
export type PrivacyStatus = 'PUBLIC' | 'PRIVATE' | 'ENCRYPTED';
export type SubscriptionTier = 'LEVEL_1' | 'LEVEL_5' | 'LEVEL_10';

export type UserId = string;

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  is_verified?: boolean;
  privacy: PrivacyStatus;
  created_at: string;
  updated_at: string;
}

export interface PrivacySettings {
  phoneNumber: 'everyone' | 'contacts' | 'nobody';
  lastSeen: 'everyone' | 'contacts' | 'nobody';
  profilePhoto: 'everyone' | 'contacts' | 'nobody';
  forwardedMessages: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
  typingIndicators: boolean;
}

export interface SupabasePost {
  id: string;
  content: string | null;
  image_url: string | null;
  author_id: UserId;
  created_at: string;
  profiles?: Profile;
}

export interface SupabaseComment {
  id: string;
  post_id: string;
  author_id: UserId;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface SupabasePostLike {
  post_id: string;
  author_id: UserId;
  created_at: string;
}

export interface SupabaseStory {
  id: string;
  author_id: UserId;
  image_url: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  image: string;
  price?: number;
  author?: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  isPrivate: boolean;
  topic: string;
}

export interface Post {
  id: string; // Reverted back to string
  author: string;
  username: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isVerified: boolean;
  timestamp: string;
  location?: string;
  tags?: string[];
  isModerated: boolean;
  isLiked?: boolean;
  isReposted?: boolean;
}

export interface Story {
  id: string;
  user: string;
  username: string;
  avatar: string;
  image: string;
  isSeen: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  avatar_url?: string;
  banner: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  badges: string[];
  website?: string;
  location?: string;
  role: UserRole;
  privacy: PrivacyStatus;
  tier: SubscriptionTier;
  credits: number;
}

export interface SkillNode {
  id: string;
  label: string;
  description: string;
  cost: number;
  status: 'LOCKED' | 'AVAILABLE' | 'MASTERED';
  x: number;
  y: number;
  dependencies: string[];
  icon: string;
}

export interface SupportTicket {
  name: string;
  email: string;
  subject: string;
  message: string;
  link?: string;
}

export enum Tab {
  COURSES = 'COURSES',
  COMMUNITY = 'COMMUNITY',
  PUBLISH = 'PUBLISH',
  LAB = 'LAB',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  ADMIN = 'ADMIN'
}

declare global {
  interface Window {
    katex: any;
  }
}
