import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';
import { initUser } from '../services/storageService';

// 1. Defines the shape of the user context data.
interface UserContextType {
  session: Session | null; // The raw Supabase session.
  user: User | null; // The raw Supabase user.
  profile: UserProfile | null; // The custom user profile from our database.
  loading: boolean; // True while the session is being verified and profile fetched.
  isAdmin: boolean; // True if the user has ADMIN or ROOT role.
  logout: () => Promise<void>; // Function to sign out.
}

// 2. Creates the context with an initial undefined value.
const UserContext = createContext<UserContextType | undefined>(undefined);

// 3. Creates the Provider component to wrap the application.
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // App is loading until the first auth check completes.
  const [isAdmin, setIsAdmin] = useState(false);

  // Effect 1: Listens for authentication state changes.
  // This is the primary listener for session changes (login, logout).
  // It runs only once on component mount.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // If no session is found, we can stop loading.
      // If a session exists, the profile fetcher effect will handle the loading state.
      if (!session) {
        setLoading(false);
      }
    });

    // Cleanup subscription on component unmount.
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Effect 2: Fetches the user profile when the user object changes.
  // This separation from the auth listener prevents race conditions (`Lock broken`).
  useEffect(() => {
    // If a user exists, fetch their profile.
    if (user) {
      setLoading(true);
      initUser(user)
        .then((userProfile) => {
          setProfile(userProfile);
          setIsAdmin(userProfile?.role === 'ADMIN' || userProfile?.role === 'ROOT');
        })
        .catch((error) => {
          // This error is critical for debugging profile initialization issues.
          // console.error("UserProvider: Failed to initialize user profile:", error);
          setProfile(null);
          setIsAdmin(false);
        })
        .finally(() => {
          setLoading(false); // Finished loading, regardless of success or failure.
        });
    } else {
      // If the user is null, reset the profile and admin status.
      setProfile(null);
      setIsAdmin(false);
    }
  }, [user]); // This effect depends solely on the user object.

  // Logout function.
  const logout = async () => {
    await supabase.auth.signOut();
    // The auth listener (Effect 1) will handle the state reset automatically.
  };

  const value = { session, user, profile, loading, isAdmin, logout };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// 4. Custom hook for easy access to the context data.
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
