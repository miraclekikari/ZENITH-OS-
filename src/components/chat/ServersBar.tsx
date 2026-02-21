import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Gamepad2, Music, Code, Flame, Plus } from 'lucide-react';

interface Server {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  notifications?: number;
}

const mockServers: Server[] = [
  { id: 'home', name: 'Zenith HQ', icon: <Zap size={20} />, color: 'from-emerald-500 to-cyan-500', notifications: 3 },
  { id: 'gaming', name: 'Gaming Hub', icon: <Gamepad2 size={20} />, color: 'from-indigo-500 to-purple-500', notifications: 12 },
  { id: 'music', name: 'Music Lounge', icon: <Music size={20} />, color: 'from-pink-500 to-rose-500' },
  { id: 'dev', name: 'Dev Lab', icon: <Code size={20} />, color: 'from-amber-500 to-orange-500', notifications: 1 },
  { id: 'trending', name: 'Trending', icon: <Flame size={20} />, color: 'from-red-500 to-rose-600' },
];

const ServersBar: React.FC = () => {
  const [activeServer, setActiveServer] = useState('home');

  return (
    <div className="w-[72px] bg-[#0e0e0e] flex-shrink-0 flex flex-col items-center py-3 gap-2 overflow-y-auto scrollbar-hide" aria-label="Servers bar">
      {mockServers.map((server) => {
        const isActive = activeServer === server.id;
        return (
          <button
            key={server.id}
            onClick={() => setActiveServer(server.id)}
            className="relative group flex items-center justify-center"
          >
            {/* Active pill indicator */}
            <motion.div
              className="absolute -left-1 w-1 rounded-r-full bg-white"
              animate={{
                height: isActive ? 36 : 0,
                opacity: isActive ? 1 : 0,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />

            {/* Server icon */}
            <motion.div
              className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? `rounded-2xl bg-gradient-to-br ${server.color} text-white`
                  : 'rounded-[24px] bg-[#1a1a1a] text-white/50 hover:rounded-2xl hover:bg-[#252525] hover:text-white/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {server.icon}
            </motion.div>

            {/* Notification badge */}
            {server.notifications && server.notifications > 0 && (
              <div className="absolute -bottom-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 border-2 border-[#0e0e0e]">
                {server.notifications > 9 ? '9+' : server.notifications}
              </div>
            )}

            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
              {server.name}
            </div>
          </button>
        );
      })}

      {/* Divider */}
      <div className="w-8 h-px bg-white/10 my-1" />

      {/* Add Server */}
      <button className="group w-12 h-12 rounded-[24px] bg-[#1a1a1a] text-emerald-500/60 hover:rounded-2xl hover:bg-emerald-500/15 hover:text-emerald-400 flex items-center justify-center transition-all duration-200">
        <Plus size={20} />
      </button>
    </div>
  );
};

export default ServersBar;
