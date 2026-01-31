// Zenith Infinite Database (Simulated via LocalStorage)
import { UserProfile } from '../types';

const MOCK_USER: UserProfile = {
  id: 'u1',
  username: 'Commander',
  handle: '@zenith_pilot',
  avatar: 'https://picsum.photos/seed/avatar/200/200',
  banner: 'https://picsum.photos/seed/banner/1200/400',
  bio: 'Exploring the digital frontier.',
  followers: 128,
  following: 45,
  postsCount: 12,
  badges: ['Pilot'],
  role: 'USER',
  privacy: 'PUBLIC',
  tier: 'LEVEL_1', // Free Tier
  credits: 50
};

const ROOT_ADMINS = ['root', 'sentinel'];

export const DB = {
  // Theme Persistence
  saveTheme: (theme: any) => {
    localStorage.setItem('zenith_theme', JSON.stringify(theme));
  },
  getTheme: () => {
    const t = localStorage.getItem('zenith_theme');
    return t ? JSON.parse(t) : null;
  },

  // Auth Persistence
  saveUser: (user: Partial<UserProfile>) => {
    const currentUser = DB.getUser() || MOCK_USER;
    const updated = { ...currentUser, ...user };
    localStorage.setItem('zenith_user', JSON.stringify(updated));
  },
  getUser: (): UserProfile | null => {
    const u = localStorage.getItem('zenith_user');
    return u ? JSON.parse(u) : null;
  },
  login: (username: string, role: 'USER' | 'ADMIN' | 'ROOT' = 'USER') => {
    const user: UserProfile = {
      ...MOCK_USER,
      username: username,
      handle: `@${username.toLowerCase()}`,
      role: role,
      badges: role === 'ROOT' || role === 'ADMIN' ? ['Administrator', 'System Core'] : ['Cadet'],
      tier: role === 'ROOT' ? 'LEVEL_10' : 'LEVEL_1'
    };
    localStorage.setItem('zenith_user', JSON.stringify(user));
    return user;
  },
  logout: () => {
    localStorage.removeItem('zenith_user');
  },
  
  // Simulated Content Store
  getPosts: () => {
    const p = localStorage.getItem('zenith_posts');
    return p ? JSON.parse(p) : [];
  },
  addPost: (post: any) => {
    const posts = DB.getPosts();
    localStorage.setItem('zenith_posts', JSON.stringify([post, ...posts]));
  },

  // Admin Check
  isAdmin: () => {
    const u = DB.getUser();
    return u && (u.role === 'ADMIN' || u.role === 'ROOT');
  }
};
