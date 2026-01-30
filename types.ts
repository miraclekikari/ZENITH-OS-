export type UserRole = 'USER' | 'ADMIN' | 'ROOT';
export type PrivacyStatus = 'PUBLIC' | 'PRIVATE' | 'ENCRYPTED';
export type SubscriptionTier = 'LEVEL_1' | 'LEVEL_5' | 'LEVEL_10';

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  image: string;
  price?: number; // For marketplace
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
  id: string;
  author: string;
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
  isLiked?: boolean; // Local state
}

export interface Story {
  id: string;
  user: string;
  avatar: string;
  image: string;
  isSeen: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  handle: string;
  avatar: string;
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
  credits: number; // Virtual currency
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

// Global definition for KaTeX
declare global {
  interface Window {
    katex: any;
  }
}