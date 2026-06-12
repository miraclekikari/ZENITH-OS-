import React from 'react';
import Sidebar from './Sidebar';
import BottomNavBar from './BottomNavBar';
import RightRail from './RightRail';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center">
      {/* Sidebar - Left */}
      <div className="hidden md:flex flex-col sticky top-0 h-screen w-[68px] lg:w-[240px] border-r border-border">
        <Sidebar />
      </div>

      {/* Main Content - Center */}
      <main className="flex-1 max-w-[640px] w-full border-r border-border min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      {/* Right Rail - Desktop only */}
      <div className="hidden lg:block w-[350px] sticky top-0 h-screen p-4">
        <RightRail />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <BottomNavBar />
      </div>
    </div>
  );
};

export default Layout;