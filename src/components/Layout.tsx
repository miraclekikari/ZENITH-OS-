import React from 'react';
import Sidebar from './Sidebar'; // Import the new Sidebar

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated = false }) => {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Always render the Sidebar */}
      {isAuthenticated && <Sidebar />}

      {/* Header with glassmorphism */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/10 backdrop-blur-md z-[50] pl-20 pr-6 flex items-center justify-between">
        <div>
            {/* Optional: Add header content, e.g., Search Bar */}
        </div>
        <div>
            {/* Optional: User Profile icon, notifications */}
        </div>
      </header>

      {/* Main content with padding to offset the sidebar */}
      <main className="pl-16 pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
