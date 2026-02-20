import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { initUser, logout, isAdmin, getUser } from './services/storageService';
import { UserProfile } from './types';

import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Academy from './pages/Academy';
import Chat from './pages/Chat';
import Feed from './pages/Feed';
import Studio from './pages/Studio';
import Lab from './pages/Lab';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        const profile = await initUser(session.user);
        setUser(profile);
      } else {
        setUser(getUser());
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        initUser(session.user).then(setUser);
      } else {
        setUser(null);
        logout();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center bg-black"></div>;
  }

  return (
    <Router>
      <ThemeProvider>
        <Layout isAuthenticated={!!session} >
          <Routes>
            {session ? (
              <>
                <Route path="/" element={<Academy />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:id" element={<Chat />} />
                <Route path="/community" element={<Feed />} />
                <Route path="/studio" element={<Studio />} />
                <Route path="/lab" element={<Lab />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/support" element={<Support />} />
                {isAdmin() && <Route path="/admin" element={<Admin />} />}
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="*" element={<NotFound />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
