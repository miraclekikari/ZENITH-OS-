import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        setUser(getUser()); // Guest user for public routes
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
  
  const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
      return session ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <ThemeProvider>
        <Layout isAuthenticated={!!session} >
          <Routes>
            {/* Public routes */}
            <Route path="/live/:id" element={<Chat />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Academy /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/studio" element={<ProtectedRoute><Studio /></ProtectedRoute>} />
            <Route path="/lab" element={<ProtectedRoute><Lab /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            {isAdmin() && <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />}
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
