import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

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

      <div className="flex items-center gap-4">
        <NavLink to="/search" className="text-white/80 hover:text-white transition-colors">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Search size={22} />
          </motion.div>
        </NavLink>
      </div>
    </nav>
  );
};

export default TopNavBar;
