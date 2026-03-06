import React from 'react';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import BottomNavBar from './BottomNavBar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] font-terminal text-white">
      {/* Mobile Navigation */}
      <TopNavBar />
      <BottomNavBar />

      {/* Desktop Sidebar (OS Launcher) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="w-full h-full pt-14 pb-16 md:pt-0 md:pb-0 md:pl-[68px] transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
};

export default Layout;
