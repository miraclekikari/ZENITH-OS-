export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  image: string;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  isVerified: boolean;
  timestamp: string;
}

export interface Short {
  id: string;
  title: string;
  image: string;
  views: string;
}

export enum Tab {
  COURSES = 'COURSES',
  COMMUNITY = 'COMMUNITY',
  LAB = 'LAB',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS'
}

// Global definition for KaTeX
declare global {
  interface Window {
    katex: any;
  }
}