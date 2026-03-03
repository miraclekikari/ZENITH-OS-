import { UserProfile } from '../types';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient'; // Import supabase client

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
  // 1. Check for profile in the database first
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = row not found
    console.error('Error fetching profile:', error);
    throw error;
  }

  // 2. If profile exists, cache it and return
  if (profile) {
    saveUser(profile);
    return profile as UserProfile;
  }

  // 3. If no profile, it's a new user. Create the profile in the DB.
  const newProfileData = {
    id: user.id,
    username: user.email?.split('@')[0] || 'Zenith User',
    handle: `@${user.email?.split('@')[0].toLowerCase()}`,
    email: user.email, // Make sure to store the email
    avatar_url: `https://api.dicebear.com/6.x/bottts/svg?seed=${user.id}`,
    banner_url: 'https://source.unsplash.com/random/1200x400?space',
    bio: 'New pilot in the Zenith network.',
    role: user.email?.includes('admin') ? 'ADMIN' : 'USER',
  };

  const { error: insertError } = await supabase.from('profiles').insert(newProfileData);

  if (insertError) {
    console.error('Error creating profile:', insertError);
    throw insertError;
  }

  // Convert to UserProfile format for local use
  const newProfile: UserProfile = {
    id: newProfileData.id,
    username: newProfileData.username,
    handle: newProfileData.handle,
    avatar: newProfileData.avatar_url,
    banner: newProfileData.banner_url,
    bio: newProfileData.bio,
    role: newProfileData.role as 'USER' | 'ADMIN' | 'ROOT',
    followers: 0, 
    following: 0,
    postsCount: 0,
    badges: ['Cadet'],
    privacy: 'PUBLIC',
    tier: 'LEVEL_1',
    credits: 100
  };

  // 4. Cache the newly created profile and return
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
export const getTheme = () => {
  const theme = getData('zenith_theme');
  if (theme === null || theme === 'ZENITH_DEFAULT') {
    saveTheme('dark');
    return 'dark';
  }
  return theme;
};
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
