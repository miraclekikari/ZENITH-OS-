import { UserProfile } from '../types';
import { User } from '@supabase/supabase-js';

// GENERIC DATA
export const saveData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getData = (key: string) => {
  const d = localStorage.getItem(key);
  if (!d) return null;
  try {
    return JSON.parse(d);
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error);
    return null;
  }
};

export const removeData = (key: string) => {
  localStorage.removeItem(key);
};


// USER DATA
export const saveUser = (data: Partial<UserProfile>) => {
  const user = getUser() || {};
  const updatedUser = { ...user, ...data };
  saveData('zenith_user', updatedUser);
};

export const getUser = (): UserProfile | null => {
  return getData('zenith_user');
};

export const initUser = async (user: User): Promise<UserProfile> => {
  let profile = getUser();
  if (profile) return profile;

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
      role: user.email?.includes('admin') ? 'ADMIN' : 'USER',
      privacy: 'PUBLIC',
      tier: 'LEVEL_1',
      credits: 100
  };

  saveUser(newProfile);
  return newProfile;
};

export const logout = () => {
  removeData('zenith_user');
};

export const isAdmin = () => {
  const u = getUser();
  return u && (u.role === 'ADMIN' || u.role === 'ROOT');
};


// THEME
export const saveTheme = (theme: any) => saveData('zenith_theme', theme);
export const getTheme = () => getData('zenith_theme');
export const getThemeSettings = () => getData('zenith_theme_settings');
export const saveThemeSettings = (settings: any) => saveData('zenith_theme_settings', settings);


// NOTIFICATIONS
export const saveNotificationSettings = (settings: any) => saveData('zenith_notifications', settings);
export const getNotificationSettings = () => getData('zenith_notifications');


// PRIVACY
export const savePrivacySettings = (settings: any) => saveData('zenith_privacy', settings);
export const getPrivacySettings = () => getData('zenith_privacy');


// CLEARANCE
export const saveClearanceLevel = (data: any) => saveData('zenith_clearance', data);
export const getClearanceLevel = () => getData('zenith_clearance');
