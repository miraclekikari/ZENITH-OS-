import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Menu } from 'lucide-react';

interface TopNavBarProps {
  onSearchClick: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onSearchClick }) => {
  return (
    <nav className="md:hidden fixed top-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06] z-50 h-14 flex items-center justify-between px-4 safe-area-top">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="font-bold text-lg text-white">ZENITH OS</span>
      </motion.div>

      <div className="flex items-center gap-4">
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-white/80 hover:text-white transition-colors"
          onClick={onSearchClick}
        >
          <Search size={22} />
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-white/80 hover:text-white transition-colors"
        >
          <Bell size={22} />
        </motion.button>
      </div>
    </nav>
  );
};

export default TopNavBar;
