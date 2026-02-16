import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Intro from './components/Intro';
import { ThemeProvider } from './context/ThemeContext';
import { DB } from './services/storageService';

// Lazy loading des composants lourds
const Chat = lazy(() => import('./pages/Chat'));
const Community = lazy(() => import('./pages/Community'));
const Lab = lazy(() => import('./pages/Lab'));
const Profile = lazy(() => import('./pages/Profile'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Publish = lazy(() => import('./pages/Publish'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Support = lazy(() => import('./pages/Support'));
const SchemaDiagnostic = lazy(() => import('./components/SchemaDiagnostic'));

// Composant de chargement
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-zenith-bg">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zenith-green"></div>
  </div>
);

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in via our simulated DB
    const user = DB.getUser();
    if(user) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <ThemeProvider>
      {showIntro ? (
        <Intro onComplete={() => setShowIntro(false)} />
      ) : (
        <Router>
          <Layout isAuthenticated={isAuthenticated} onLogin={handleLogin}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Community />} />
                <Route path="/community" element={<Community />} />
                <Route path="/publish" element={<Publish />} />
                <Route path="/lab" element={<Lab />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:username" element={<UserProfile />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/academy" element={<Navigate to="/chat" replace />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/support" element={<Support />} />
                <Route path="/diagnostic" element={<SchemaDiagnostic />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      )}
    </ThemeProvider>
  );
};

export default App;
