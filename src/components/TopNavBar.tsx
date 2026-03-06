import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusSquare, Bell, MessageCircle } from 'lucide-react';

const TopNavBar: React.FC = () => {
  return (
    <nav className="md:hidden fixed top-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06] z-50 h-14 flex items-center justify-between px-4 safe-area-top">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="font-bold text-lg text-white">ZENITH OS</span>
      </motion.div>

      <div className="flex items-center gap-3">
        <NavLink to="/studio" className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
            <PlusSquare size={22} />
        </NavLink>
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
            <Bell size={22} />
        </button>
        <NavLink to="/chat" className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all relative">
            <MessageCircle size={22} />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </NavLink>
      </div>
    </nav>
  );
};

export default TopNavBar;
