import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DB } from '../services/storageService';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(DB.getUser());
  }, [location.pathname]); // Refresh user on nav change

  const navItems = [
    { path: '/', icon: 'fa-graduation-cap', label: 'Academy' },
    { path: '/community', icon: 'fa-globe-americas', label: 'Network' },
    { path: '/publish', icon: 'fa-plus-square', label: 'Publish' },
    { path: '/lab', icon: 'fa-flask', label: 'Labo' },
    { path: '/settings', icon: 'fa-sliders-h', label: 'System' },
  ];

  if (user && (user.role === 'ADMIN' || user.role === 'ROOT')) {
    navItems.push({ path: '/admin', icon: 'fa-shield-alt', label: 'Command' });
  }

  // Simulated Music Player Logic
  useEffect(() => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      audio.volume = volume;
      if (isPlaying) audio.play().catch(e => console.log("Interaction required"));
      else audio.pause();
    }
  }, [isPlaying, volume]);

  return (
    <div className="flex h-screen bg-zenith-bg text-zenith-text font-mono overflow-hidden">
      
      {/* Sidebar (Desktop) - Enhanced Dynamic Width */}
      <aside className="hidden md:flex flex-col w-16 hover:w-64 transition-all duration-400 cubic-bezier(0.4, 0, 0.2, 1) bg-zenith-surface border-r border-zenith-greenDim z-50 group shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-5 flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <i className="fas fa-microchip text-2xl text-zenith-green"></i>
          <span className="text-xl font-tech font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            ZENITH
          </span>
        </div>
        
        <div className="px-5 py-2 text-xs font-bold text-zenith-green tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          MODULES
        </div>

        <nav className="flex-1 flex flex-col gap-1 mt-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`relative flex items-center gap-4 px-5 py-3 hover:bg-zenith-greenDim/20 hover:text-zenith-text transition-all ${location.pathname === item.path ? 'text-zenith-green bg-zenith-greenDim/10' : 'text-zenith-dim'}`}
            >
              {location.pathname === item.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-zenith-green shadow-[0_0_10px_#00ff88]"></div>
              )}
              <i className={`fas ${item.icon} text-lg w-6 text-center`}></i>
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zenith-greenDim text-xs text-center text-zenith-dim whitespace-nowrap overflow-hidden">
          <span className="group-hover:inline hidden">
            {user?.role === 'ROOT' ? 'ROOT ACCESS GRANTED' : 'v7.0 TITAN • ONLINE'}
          </span>
          <span className="group-hover:hidden">v7.0</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_center,_#0a0e14_0%,_#05070a_100%)]">
        {/* Header */}
        <header className="h-20 border-b border-zenith-greenDim flex items-center justify-between px-6 md:px-8 bg-zenith-bg/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
             <i className={`fas ${navItems.find(n => n.path === location.pathname)?.icon || 'fa-satellite'} text-2xl text-zenith-green`}></i>
             <div>
               <div className="font-tech text-xl text-white tracking-wider">
                 {navItems.find(n => n.path === location.pathname)?.label.toUpperCase() || 'SYSTEM'}
               </div>
               <div className="text-xs text-zenith-dim hidden md:block">Zenith Core OS / {location.pathname === '/' ? 'Home' : location.pathname.substring(1)}</div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-zenith-surface px-4 py-2 rounded-full border border-zenith-greenDim items-center gap-2 focus-within:border-zenith-green transition-colors">
              <i className="fas fa-search text-zenith-dim text-sm"></i>
              <input type="text" placeholder="Search modules..." className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all text-white placeholder-zenith-dim" />
            </div>
            
            {/* Global Profile Link */}
            <div 
              onClick={() => navigate('/profile')}
              className="group flex items-center gap-3 cursor-pointer p-1 rounded-full pr-4 hover:bg-white/5 transition-all border border-transparent hover:border-zenith-greenDim"
            >
               <div className="w-10 h-10 rounded-full border border-zenith-greenDim p-0.5 group-hover:border-zenith-green transition-colors relative">
                  <img src={user?.avatar || "https://picsum.photos/seed/avatar/200/200"} className="w-full h-full rounded-full object-cover" alt="User" />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zenith-surface ${user?.privacy === 'ENCRYPTED' ? 'bg-red-500' : 'bg-green-500'}`}></div>
               </div>
               <div className="hidden md:block text-right">
                 <div className="text-xs font-bold text-white">{user?.username}</div>
                 <div className="text-[10px] text-zenith-dim uppercase">{user?.role}</div>
               </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 scroll-smooth">
           {children}
        </div>

        {/* Persistent Music Player */}
        <div className="absolute bottom-20 md:bottom-8 right-4 md:right-8 glass-card p-3 rounded-xl z-50 flex items-center gap-4 w-64 backdrop-blur-md hover:scale-105 transition-transform">
          <div className="w-10 h-10 bg-zenith-green rounded flex items-center justify-center text-black animate-pulse-fast shadow-[0_0_15px_rgba(0,255,136,0.5)]">
            <i className="fas fa-music"></i>
          </div>
          <div className="flex-1 overflow-hidden">
             <div className="text-xs text-zenith-green font-bold whitespace-nowrap">Lofi Coding Radio</div>
             <div className="text-[10px] text-zenith-dim">Zenith Core FM 99.9</div>
          </div>
          <button onClick={() => setIsPlaying(!isPlaying)} className="text-zenith-text hover:text-zenith-green text-xl w-8">
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <audio id="bg-music" src="https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Sentinel.mp3" loop></audio>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden h-20 bg-zenith-surface border-t border-zenith-greenDim fixed bottom-0 w-full flex justify-around items-center z-50 pb-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-all ${location.pathname === item.path ? 'text-zenith-green' : 'text-zenith-dim'}`}
          >
            <i className={`fas ${item.icon} text-xl transition-transform ${location.pathname === item.path ? '-translate-y-1 drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]' : ''}`}></i>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
};

export default Layout;