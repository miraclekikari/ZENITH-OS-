import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useLocation, NavLink } from 'react-router-dom';

interface TopNavBarProps {
  onSearchClick: () => void;
  onNotificationsClick: () => void; // <-- NEW PROP
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onSearchClick, onNotificationsClick }) => {
  const location = useLocation();
  const getTitle = () => {
    const path = location.pathname.split('/')[1] || 'home';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] z-[90] flex items-center justify-between px-4">
      <NavLink to="/">
        <h1 className="font-tech text-lg font-bold tracking-widest text-white">ZENITH</h1>
      </NavLink>
      <div className="flex-1 flex justify-center">
        <p className="font-semibold text-white/80 capitalize">
          {getTitle()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onSearchClick} className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-colors">
          <Search size={18} />
        </button>
        <button onClick={onNotificationsClick} className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-colors"> {/* <-- ADD ONCLICK */}
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
};

export default TopNavBar;
