import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import BottomNavBar from './BottomNavBar';
import SearchOverlay from './SearchOverlay';
import NotificationsPanel from './NotificationsPanel'; // <-- IMPORT

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // <-- NEW STATE

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openNotifications = () => setIsNotificationsOpen(true); // <-- NEW HANDLER
  const closeNotifications = () => setIsNotificationsOpen(false); // <-- NEW HANDLER

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] font-terminal text-white">
      {/* Overlays */}
      <SearchOverlay isOpen={isSearchOpen} onClose={closeSearch} />
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={closeNotifications} /> {/* <-- ADD PANEL */}

      {/* Mobile Navigation */}
      <TopNavBar onSearchClick={openSearch} onNotificationsClick={openNotifications} /> {/* <-- PASS HANDLER */}
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
