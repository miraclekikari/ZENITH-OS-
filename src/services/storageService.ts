import { UserProfile } from '../types';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

// --- Profile Management ---

/**
 * Fetches a user profile from the database based on their ID.
 * @param userId The ID of the user to fetch.
 * @returns The user profile if found, otherwise null.
 */
export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // 'PGRST116' is the code for 'row not found'. In this case, it's not a throw-worthy error.
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as UserProfile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null; // Return null to indicate failure or not found
  }
};

/**
 * Initializes a user. Checks if a profile exists, and if not, creates one.
 * This should be called when a new user signs up or logs in for the first time.
 * @param user The Supabase user object.
 * @returns The user's profile.
 */
export const initUser = async (user: User): Promise<UserProfile> => {
  const existingProfile = await getProfile(user.id);

  if (existingProfile) {
    saveUser(existingProfile); // Cache the profile
    return existingProfile;
  }

  // If no profile, create one
  const newProfileData = {
    id: user.id,
    username: user.email?.split('@')[0] || 'Zenith Pilot',
    handle: `@${user.email?.split('@')[0].toLowerCase()}`,
    email: user.email,
    avatar_url: `https://api.dicebear.com/6.x/bottts/svg?seed=${user.id}`,
    banner_url: 'https://source.unsplash.com/random/1200x400?space,stars',
    bio: 'New pilot in the Zenith network.',
    // Assign role based on email, with a fallback to USER
    role: user.email?.includes('admin') ? 'ADMIN' : 'USER',
  };

  const { error: insertError } = await supabase.from('profiles').insert(newProfileData);

  if (insertError) {
    console.error('Error creating profile:', insertError);
    throw insertError;
  }
  
  // Fetch the newly created profile to ensure consistency
  const createdProfile = await getProfile(user.id);
  if(!createdProfile) {
      throw new Error("Failed to retrieve profile after creation.");
  }

  saveUser(createdProfile); // Cache the new profile
  return createdProfile;
};

// --- Local Storage Cache ---

export const saveData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
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

// --- User Session Helpers ---

export const saveUser = (data: Partial<UserProfile>) => {
  const user = getUser() || {};
  const updatedUser = { ...user, ...data };
  saveData('zenith_user', updatedUser);
};

export const getUser = (): UserProfile | null => {
  return getData('zenith_user');
};

export const logout = () => {
  removeData('zenith_user');
  // Potentially clear other session-related data here too
};

export const isAdmin = () => {
  const u = getUser();
  return u && (u.role === 'ADMIN' || u.role === 'ROOT');
};


// --- App Settings ---

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

export const saveNotificationSettings = (settings: any) => saveData('zenith_notifications', settings);
export const getNotificationSettings = () => getData('zenith_notifications');

export const savePrivacySettings = (settings: any) => saveData('zenith_privacy', settings);
export const getPrivacySettings = () => getData('zenith_privacy');

export const saveClearanceLevel = (data: any) => saveData('zenith_clearance', data);
export const getClearanceLevel = () => getData('zenith_clearance');
