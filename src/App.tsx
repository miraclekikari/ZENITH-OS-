import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Intro from './components/Intro';
import Academy from './pages/Academy';
import Community from './pages/Community';
import Lab from './pages/Lab';
import Profile from './pages/Profile';
import Publish from './pages/Publish';
import Settings from './pages/Settings';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel'; // New
import { ThemeProvider } from './context/ThemeContext';
import { DB } from './services/storageService';

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
        !isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Academy />} />
                <Route path="/community" element={<Community />} />
                <Route path="/publish" element={<Publish />} />
                <Route path="/lab" element={<Lab />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        )
      )}
    </ThemeProvider>
  );
};

export default App;
