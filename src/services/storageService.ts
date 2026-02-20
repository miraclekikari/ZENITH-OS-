// Zenith Infinite Database (Simulated via LocalStorage)
import { UserProfile } from '../types';
import { DEFAULT_USER_ID } from '../lib/constants';
import { User } from '@supabase/supabase-js';

const MOCK_USER: UserProfile = {
  id: DEFAULT_USER_ID,
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

export const DB = {
  // THEME
  saveTheme: (theme: any) => localStorage.setItem('zenith_theme', JSON.stringify(theme)),
  getTheme: () => {
    const t = localStorage.getItem('zenith_theme');
    return t ? JSON.parse(t) : null;
  },

  // GENERIC DATA
  saveData: (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data)),
  getData: (key: string) => {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : null;
  },
  removeData: (key: string) => localStorage.removeItem(key),

  // SETTINGS
  getThemeSettings: () => {
    const t = localStorage.getItem('zenith_theme_settings');
    return t ? JSON.parse(t) : null;
  },
  saveThemeSettings: (settings: any) => localStorage.setItem('zenith_theme_settings', JSON.stringify(settings)),
  saveNotificationSettings: (settings: any) => localStorage.setItem('zenith_notifications', JSON.stringify(settings)),
  getNotificationSettings: () => {
    const n = localStorage.getItem('zenith_notifications');
    return n ? JSON.parse(n) : null;
  },
  savePrivacySettings: (settings: any) => localStorage.setItem('zenith_privacy', JSON.stringify(settings)),
  getPrivacySettings: () => {
    const p = localStorage.getItem('zenith_privacy');
    return p ? JSON.parse(p) : null;
  },

  // CLEARANCE
  saveClearanceLevel: (data: any) => localStorage.setItem('zenith_clearance', JSON.stringify(data)),
  getClearanceLevel: () => {
    const c = localStorage.getItem('zenith_clearance');
    return c ? JSON.parse(c) : null;
  },

  // AUTH & USER
  async initUser(user: User): Promise<UserProfile> {
    let profile = this.getUser();
    if (profile) return profile;

    // This should call Supabase to get the full profile
    // For now, we'll create a mock one based on the auth user
    const newProfile: UserProfile = {
      id: user.id,
      username: user.email?.split('@')[0] || 'Zenith User',
      handle: `@${user.email?.split('@')[0].toLowerCase()}`,
      avatar: `https://picsum.photos/seed/${user.id}/200/200`,
      banner: 'https://picsum.photos/seed/banner/1200/400',
      bio: 'New pilot in the Zenith network.',
      followers: 0,
      following: 0,
      postsCount: 0,
      badges: ['Cadet'],
      role: user.email?.includes('admin') ? 'ADMIN' : 'USER', // Simple role check
      privacy: 'PUBLIC',
      tier: 'LEVEL_1',
      credits: 100
    };

    this.saveUser(newProfile);
    return newProfile;
  },

  saveUser: (user: UserProfile) => {
    localStorage.setItem('zenith_user', JSON.stringify(user));
  },

  getUser: (): UserProfile | null => {
    const u = localStorage.getItem('zenith_user');
    try {
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('zenith_user');
  },
  
  isAdmin: () => {
    const u = DB.getUser();
    return u && (u.role === 'ADMIN' || u.role === 'ROOT');
  }
};
