import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import BottomNavBar from './BottomNavBar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-zenith-bg font-sans text-white">
      {/* Mobile Navigation */}
      <TopNavBar />
      <BottomNavBar />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="w-full h-full pt-16 pb-16 md:pt-0 md:pb-0 md:pl-16 group-hover:md:pl-60 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
};

export default Layout;
