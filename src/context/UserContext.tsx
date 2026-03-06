
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';
import { getProfile } from '../services/storageService';

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
    const fetchSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          try {
            const userProfile = await getProfile(currentSession.user.id);
            setProfile(userProfile);
            setIsAdmin(userProfile?.role === 'admin');
          } catch (profileError) {
            console.error("UserProvider: Error fetching profile on initial load", profileError);
            setProfile(null); // Ensure profile is cleared on error
          }
        }
      } catch (e) {
        console.error("UserProvider: Error fetching session", e);
        // Clear all session-related state on error
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setLoading(true);
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        try {
          // Await the profile fetch to prevent race conditions
          const userProfile = await getProfile(newSession.user.id);
          setProfile(userProfile);
          setIsAdmin(userProfile?.role === 'admin');
        } catch (profileError) {
          console.error("UserProvider: Error fetching profile on auth change", profileError);
          setProfile(null);
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
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
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
