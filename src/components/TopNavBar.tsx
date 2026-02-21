import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const TopNavBar: React.FC = () => {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06] z-50 flex items-center justify-between px-4">
      <h1 className="font-tech text-base font-bold tracking-[0.2em] text-white">ZENITH</h1>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors">
          <Search size={18} />
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors relative">
          <Bell size={18} />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      </div>
    </header>
  );
};

export default TopNavBar;
