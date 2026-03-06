import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';
import { initUser } from '../services/storageService';

// 1. DEFINING THE CONTEXT SHAPE
interface UserContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

// 2. CREATING THE CONTEXT
const UserContext = createContext<UserContextType | undefined>(undefined);

// 3. CREATING THE PROVIDER COMPONENT
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Start true: app is loading until first auth check is done
  const [isAdmin, setIsAdmin] = useState(false);

  // EFFECT 1: AUTH LISTENER
  // This effect's only job is to listen for auth changes from Supabase.
  // It's simple and runs only once.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // If there's no user, we can stop loading immediately.
      // If there is a user, the next effect will handle the loading state.
      if (!session) {
        setLoading(false);
      }
    });

    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // EFFECT 2: PROFILE FETCHER
  // This effect REACTS to changes in the `user` object.
  // This separation prevents race conditions.
  useEffect(() => {
    // If we have a user, fetch their profile.
    if (user) {
      setLoading(true); // Set loading to true while we fetch the profile
      initUser(user)
        .then((userProfile) => {
          setProfile(userProfile);
          setIsAdmin(userProfile?.role === 'ADMIN' || userProfile?.role === 'ROOT');
        })
        .catch((error) => {
          console.error("UserProvider: Failed to initialize user profile:", error);
          setProfile(null);
          setIsAdmin(false);
        })
        .finally(() => {
          setLoading(false); // We are done loading, whether it succeeded or failed
        });
    } else {
      // If user is null, there is no profile to fetch.
      setProfile(null);
      setIsAdmin(false);
    }
  }, [user]); // The key: this effect runs ONLY when the user object changes.

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    // The auth listener will automatically handle the state changes.
  };

  const value = { session, user, profile, loading, isAdmin, logout };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// 4. CUSTOM HOOK FOR EASY ACCESS
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
