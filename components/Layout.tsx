import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const navItems = [
    { path: '/', icon: 'fa-graduation-cap', label: 'Academy' },
    { path: '/community', icon: 'fa-globe', label: 'Network' },
    { path: '/lab', icon: 'fa-flask', label: 'Labo' },
    { path: '/profile', icon: 'fa-user-astronaut', label: 'Profile' },
  ];

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
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-20 hover:w-64 transition-all duration-300 bg-zenith-surface border-r border-zenith-greenDim z-50 group">
        <div className="p-6 text-center text-2xl font-tech text-zenith-green font-bold truncate">
          Z<span className="group-hover:inline hidden">ENITH</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 mt-4">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-zenith-greenDim hover:text-zenith-green transition-colors ${location.pathname === item.path ? 'text-zenith-green border-r-2 border-zenith-green' : 'text-zenith-dim'}`}
            >
              <i className={`fas ${item.icon} text-xl w-6 text-center`}></i>
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zenith-greenDim text-xs text-center text-zenith-dim">
          <span className="group-hover:inline hidden">v5.0 TITAN</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zenith-greenDim flex items-center justify-between px-6 bg-zenith-bg/90 backdrop-blur-md z-40">
          <div className="font-tech text-xl text-zenith-green tracking-wider">
            {location.pathname === '/' ? 'ACADEMY' : location.pathname.substring(1).toUpperCase()}
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-zenith-surface px-4 py-2 rounded-full border border-zenith-greenDim flex items-center gap-2">
              <i className="fas fa-search text-zenith-dim text-sm"></i>
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-24 focus:w-40 transition-all" />
            </div>
            <div className="w-8 h-8 rounded-full bg-zenith-green text-black flex items-center justify-center font-bold">
              Z
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
           {children}
        </div>

        {/* Persistent Music Player */}
        <div className="absolute bottom-20 md:bottom-8 right-4 md:right-8 bg-zenith-surface border border-zenith-greenDim p-3 rounded-xl shadow-lg shadow-black/50 z-50 flex items-center gap-4 w-64 backdrop-blur-md">
          <div className="w-10 h-10 bg-zenith-green rounded flex items-center justify-center text-black animate-pulse-fast">
            <i className="fas fa-music"></i>
          </div>
          <div className="flex-1 overflow-hidden">
             <div className="text-xs text-zenith-green font-bold whitespace-nowrap">Lofi Coding Radio</div>
             <div className="text-[10px] text-zenith-dim">Zenith Core FM</div>
          </div>
          <button onClick={() => setIsPlaying(!isPlaying)} className="text-zenith-text hover:text-zenith-green">
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <audio id="bg-music" src="https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Sentinel.mp3" loop></audio>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden h-16 bg-zenith-surface border-t border-zenith-greenDim fixed bottom-0 w-full flex justify-around items-center z-50">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center gap-1 ${location.pathname === item.path ? 'text-zenith-green' : 'text-zenith-dim'}`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
};

export default Layout;