import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import CommunityPage from './pages/Community';
import Studio from './pages/Studio';
import Publish from './pages/Publish';
import Lab from './pages/Lab';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import NewProfile from './pages/NewProfile';
import Support from './pages/Support';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';
import VerificationBanner from './components/VerificationBanner';

const AppContent: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        if (currentSession) {
          const profile = await initUser(currentSession.user);
          setUser(profile);
        } else {
          setUser(getUser()); // Guest user for public routes
        }
      } catch (e) {
        console.error("Error getting session:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        try {
            const profile = await initUser(session.user);
            setUser(profile);
        } catch(e) {
            console.error("Error initializing user on auth change:", e);
            setUser(null)
        }
      } else {
        setUser(null);
        logout();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center bg-black"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zenith-primary"></div></div>;
  }

  // Redirect logged-in users away from the login page
  if (session && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }
  
  const isEmailConfirmed = !!session?.user?.email_confirmed_at;

  const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
      return session ? children : <Navigate to="/login" replace />;
  };

  return (
    <>
      {session && <VerificationBanner isConfirmed={isEmailConfirmed} />}
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/live/:id" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Academy /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          <Route path="/studio" element={<ProtectedRoute><Studio /></ProtectedRoute>} />
          <Route path="/publish" element={<ProtectedRoute><Publish /></ProtectedRoute>} />
          <Route path="/lab" element={<ProtectedRoute><Lab /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><NewProfile /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
          {isAdmin() && <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />}
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}

const App: React.FC = () => (
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </Router>
)

export default App;
