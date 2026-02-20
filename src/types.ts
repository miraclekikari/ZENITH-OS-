export type UserRole = 'USER' | 'ADMIN' | 'ROOT';
export type PrivacyStatus = 'PUBLIC' | 'PRIVATE' | 'ENCRYPTED';
export type SubscriptionTier = 'LEVEL_1' | 'LEVEL_5' | 'LEVEL_10';

// Type explicite pour user_id (string simple, pas UUID)
export type UserId = string;

// Interface pour les profiles utilisateurs
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  is_verified?: boolean;
  privacy: PrivacyStatus; // Utiliser le type PrivacyStatus au lieu de chaîne littérale
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

// Interfaces pour les tables Supabase avec author_id explicite en string
export interface SupabasePost {
  id: string;
  content: string | null;
  image_url: string | null;
  author_id: UserId; // Utiliser author_id pour cohérence
  created_at: string;
  profiles?: Profile; // Jointure avec profiles
}

export interface SupabaseComment {
  id: string;
  post_id: string;
  author_id: UserId; // Utiliser author_id au lieu de user_id
  content: string;
  created_at: string;
  profiles?: Profile; // Jointure avec profiles
}

export interface SupabasePostLike {
  post_id: string;
  author_id: UserId; // Utiliser author_id pour cohérence
  created_at: string;
}

export interface SupabaseStory {
  id: string;
  author_id: UserId; // Utiliser author_id pour cohérence
  image_url: string;
  created_at: string;
}

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
  username: string; // Ajout pour la navigation vers les profils
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
  isReposted?: boolean; // Local state
}

export interface Story {
  id: string;
  user: string;
  username: string; // Ajout pour la cohérence
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

export interface SkillNode {
  id: string;
  label: string;
  description: string;
  cost: number;
  status: 'LOCKED' | 'AVAILABLE' | 'MASTERED';
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  dependencies: string[]; // IDs of prerequisite skills
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

// Global definition for KaTeX
declare global {
  interface Window {
    katex: any;
  }
}
