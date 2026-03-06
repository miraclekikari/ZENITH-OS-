
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';
import { initUser } from '../services/storageService';

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
  const [loading, setLoading] = useState(true); // Start as true
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // onAuthStateChange is the single source of truth.
    // It fires once on load with the initial session, and then for every auth event.
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      let userProfile: UserProfile | null = null;
      if (currentUser) {
        try {
          // initUser will fetch an existing profile or create a new one.
          // This is the only place we should be fetching profile on auth change.
          userProfile = await initUser(currentUser);
        } catch (error) {
          console.error("UserProvider: Error initializing user profile on auth change:", error);
          // The profile will be null, which is the correct state on failure.
        }
      }
      
      setProfile(userProfile);
      setIsAdmin(userProfile?.role === 'ADMIN' || userProfile?.role === 'ROOT');
      setLoading(false); // All auth-related loading is finished.
    });

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Empty dependency array ensures this effect runs only once.

  const logout = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will handle clearing the state.
  };

  const value = {
    session,
    user,
    profile,
    loading,
    isAdmin,
    logout,
  };

  // Render children only when loading is false. This prevents rendering protected routes with a null user.
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
