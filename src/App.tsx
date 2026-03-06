import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import VerificationBanner from './components/VerificationBanner';

// --- Lazy Loading Pages ---
const Login = React.lazy(() => import('./pages/Login'));
const Academy = React.lazy(() => import('./pages/Academy'));
const Chat = React.lazy(() => import('./pages/Chat'));
const Feed = React.lazy(() => import('./pages/Feed'));
const CommunityPage = React.lazy(() => import('./pages/Community'));
const Studio = React.lazy(() => import('./pages/Studio'));
const Publish = React.lazy(() => import('./pages/Publish'));
const Lab = React.lazy(() => import('./pages/Lab'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Admin = React.lazy(() => import('./pages/Admin'));
const NewProfile = React.lazy(() => import('./pages/NewProfile'));
const Support = React.lazy(() => import('./pages/Support'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Diagnostic = React.lazy(() => import('./pages/Diagnostic'));
const Search = React.lazy(() => import('./pages/Search'));

const LoadingFallback: React.FC = () => (
  <div className="w-full h-screen flex items-center justify-center bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zenith-primary"></div>
  </div>
);

// This component defines the core routing and layout logic.
const AppContent: React.FC = () => {
  const { session, profile, loading, isAdmin } = useUser();
  const location = useLocation();

  // Display a loading indicator while session is being verified.
  if (loading) {
    return <LoadingFallback />;
  }

  // Redirect logged-in users away from the login page.
  if (session && location.pathname === '/login') {
    return <Navigate to="/feed" replace />;
  }
  
  // Force new users to complete their profile.
  if (session && !profile && location.pathname !== '/profile' && location.pathname !== '/settings') {
      return <Navigate to="/profile" replace />;
  }

  const isEmailConfirmed = !!session?.user?.email_confirmed_at;

  // A wrapper to protect routes that require authentication.
  const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
      return session ? children : <Navigate to="/login" replace />;
  };

  return (
    <>
      {session && !isEmailConfirmed && <VerificationBanner isConfirmed={isEmailConfirmed} />}
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Diagnostic page - available only in development mode for security. */}
            {import.meta.env.DEV && <Route path="/diagnostic" element={<Diagnostic />} />}

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
            <Route path="/live/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            {isAdmin && <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />}
            
            {/* Catch-all for undefined routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}

const App: React.FC = () => (
  <Router>
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  </Router>
)

export default App;
