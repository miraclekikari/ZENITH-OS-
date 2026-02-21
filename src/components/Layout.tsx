import React from 'react';
import { useLocation } from 'react-router-dom';
// ... other imports

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated = false }) => {
  const location = useLocation();
  const isLive = location.pathname.startsWith('/live/');

  // If it's a live stream, render children without the layout
  if (isLive) {
    return <>{children}</>;
  }

  // ... Render standard layout
  return (
    <div className="flex h-screen bg-zenith-bg text-zenith-text font-mono overflow-hidden">
      {/* ... your existing aside and header ... */}
      <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_center,_#0a0e14_0%,_#05070a_100%)]">
           {children}
      </main>
      {/* ... your existing nav ... */}
    </div>
  );
};

export default Layout;
