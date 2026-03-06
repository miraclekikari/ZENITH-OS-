import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useLocation, NavLink } from 'react-router-dom';

const TopNavBar: React.FC = () => {
  const location = useLocation();
  const getTitle = () => {
    const path = location.pathname.split('/')[1] || 'home';
    if (path === 'feed') return 'FEED'; // Custom titles
    if (path === 'search') return 'NETWORK SCAN';
    if (path === 'notifications') return 'SYSTEM LOGS';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] z-[90] flex items-center justify-between px-4">
      <NavLink to="/">
        <h1 className="font-tech text-lg font-bold tracking-widest text-white">ZENITH</h1>
      </NavLink>
      <div className="flex-1 flex justify-center">
        <p className="font-semibold text-white/80 capitalize font-mono">
          {getTitle()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <NavLink to="/search" className={({ isActive }) =>
            `w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`
        }>
          <Search size={18} />
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) =>
            `w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`
        }>
          <Bell size={18} />
        </NavLink>
      </div>
    </header>
  );
};

export default TopNavBar;
