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
  
  // Generic Data Persistence
  saveData: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  getData: (key: string) => {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : null;
  },
  removeData: (key: string) => {
    localStorage.removeItem(key);
  },
  
  getThemeSettings: () => {
    const t = localStorage.getItem('zenith_theme_settings');
    return t ? JSON.parse(t) : null;
  },
  saveThemeSettings: (settings: any) => {
    localStorage.setItem('zenith_theme_settings', JSON.stringify(settings));
  },

  // Notification Settings
  saveNotificationSettings: (settings: any) => {
    localStorage.setItem('zenith_notifications', JSON.stringify(settings));
  },
  getNotificationSettings: () => {
    const n = localStorage.getItem('zenith_notifications');
    return n ? JSON.parse(n) : null;
  },

  // Privacy Settings
  savePrivacySettings: (settings: any) => {
    localStorage.setItem('zenith_privacy', JSON.stringify(settings));
  },
  getPrivacySettings: () => {
    const p = localStorage.getItem('zenith_privacy');
    return p ? JSON.parse(p) : null;
  },

  // Clearance Level
  saveClearanceLevel: (data: any) => {
    localStorage.setItem('zenith_clearance', JSON.stringify(data));
  },
  getClearanceLevel: () => {
    const c = localStorage.getItem('zenith_clearance');
    return c ? JSON.parse(c) : null;
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
