
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';
import { getProfile, initUser } from '../services/storageService';

interface UserContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(currentSession);
        const currentUser = currentSession?.user;
        setUser(currentUser ?? null);

        if (currentUser) {
          // Attempt to fetch profile, if null, it might be a new user
          let userProfile = await getProfile(currentUser.id);
          if (!userProfile) {
            // This will create the profile if it doesn't exist
            userProfile = await initUser(currentUser);
          }
          setProfile(userProfile);
          setIsAdmin(userProfile?.role === 'ADMIN' || userProfile?.role === 'ROOT');
        }
      } catch (e) {
        console.error("UserProvider: Error during initial session/profile fetch", e);
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setLoading(true);
      const newUser = newSession?.user;
      setSession(newSession);
      setUser(newUser ?? null);

      if (newUser) {
        // On auth change (login), fetch or create user profile
        try {
          const userProfile = await initUser(newUser); // Use initUser to handle both new and existing users
          setProfile(userProfile);
          setIsAdmin(userProfile?.role === 'ADMIN' || userProfile?.role === 'ROOT');
        } catch (profileError) {
          console.error("UserProvider: Error initializing user on auth change", profileError);
          setProfile(null);
          setIsAdmin(false);
        }
      } else {
        // User logged out
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    // State will be cleared by onAuthStateChange listener
  };

  const value = {
    session,
    user,
    profile,
    loading,
    isAdmin,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
