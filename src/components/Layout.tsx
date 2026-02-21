import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser, getPrivacySettings, getClearanceLevel } from '../services/storageService';
import { UserProfile, PrivacySettings } from '../types';
import ProfileSearch from './ProfileSearch';
import Icon from './Icon';
import NotificationDropdown from './NotificationDropdown';

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  onLogin?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated = false, onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [clearanceLevel, setClearanceLevel] = useState(1);

  useEffect(() => {
    setUser(getUser());
    setPrivacySettings(getPrivacySettings());
    const clearance = getClearanceLevel();
    if (clearance) {
        setClearanceLevel(clearance.level);
    }
  }, [location.pathname]);

  const navItems = [
    { path: '/', icon: 'fa-graduation-cap', label: 'Academy' },
    { path: '/chat', icon: 'fa-comment', label: 'Chat' },
    { path: '/community', icon: 'fa-globe-americas', label: 'Network' },
    { path: '/studio', icon: 'fa-plus-square', label: 'Studio' },
    { path: '/lab', icon: 'fa-flask', label: 'Labo' },
    { path: '/settings', icon: 'fa-sliders-h', label: 'System' },
  ];

  if (user && (user.role === 'ADMIN' || user.role === 'ROOT')) {
    navItems.push({ path: '/admin', icon: 'fa-shield-alt', label: 'Command' });
  }

  useEffect(() => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      audio.volume = volume;
      if (isPlaying) audio.play().catch(e => console.log("Interaction required"));
      else audio.pause();
    }
  }, [isPlaying, volume]);

  const showStatus = () => {
    if (!privacySettings || !user) return true;
    if (privacySettings.lastSeen === 'nobody') return false;
    if (privacySettings.lastSeen === 'contacts') return true;
    if (privacySettings.lastSeen === 'everyone') return true;
    return false;
  }

  const getVerificationBadge = () => {
      if (clearanceLevel >= 10) return <i className="fas fa-check-circle text-yellow-400 ml-2"></i>;
      if (clearanceLevel >= 5) return <i className="fas fa-check-circle text-blue-400 ml-2"></i>;
      return null;
  }

  return (
    <div className="flex h-screen bg-zenith-bg text-zenith-text font-mono overflow-hidden">
      
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
              className={`relative flex items-center gap-4 px-5 py-3 hover:bg-zenith-greenDim/20 hover:text-zenith-text transition-all ${location.pathname === item.path ? 'text-zenith-green bg-zenith-greenDim/10' : 'text-zenith-dim'}`}>
              {location.pathname === item.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-zenith-green shadow-[0_0_10px_#00ff88]"></div>
              )}
              <Icon icon={item.icon} className={`fas ${item.icon} text-lg w-6 text-center`} />
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zenith-greenDim text-xs text-center text-zenith-dim whitespace-nowrap overflow-hidden">
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="w-full text-left p-2 rounded-md hover:bg-zenith-greenDim/20 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Icon icon={isPlaying ? 'fa-pause-circle' : 'fa-play-circle'} className={`fas ${isPlaying ? 'fa-pause-circle text-zenith-green' : 'fa-play-circle'} text-lg w-6 text-center`} />
            <span className="text-sm font-semibold">{isPlaying ? 'Pause Radio' : 'Play Radio'}</span>
          </button>
          <div className='mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
             {user?.role === 'ROOT' ? 'ROOT ACCESS' : 'v7.0 TITAN'}
          </div>
           <div className='mt-2 opacity-100 group-hover:opacity-0 transition-opacity duration-300'>v7.0</div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_center,_#0a0e14_0%,_#05070a_100%)]">
        <header className="h-20 border-b border-zenith-greenDim flex items-center justify-between px-6 md:px-8 bg-zenith-bg/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
             <Icon icon={navItems.find(n => n.path === location.pathname)?.icon || 'fa-satellite'} className={`fas ${navItems.find(n => n.path === location.pathname)?.icon || 'fa-satellite'} text-2xl text-zenith-green`} />
             <div>
               <div className="font-tech text-xl text-white tracking-wider">
                 {navItems.find(n => n.path === location.pathname)?.label.toUpperCase() || 'SYSTEM'}
               </div>
               <div className="text-xs text-zenith-dim hidden md:block">Zenith Core OS / {location.pathname === '/' ? 'Home' : location.pathname.substring(1)}</div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <ProfileSearch />
            {isAuthenticated && <NotificationDropdown />}
            <button
              onClick={() => navigate('/support')}
              className="px-3 py-2 bg-purple-600 text-white font-bold rounded-full text-sm hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.8)] transition-all flex items-center gap-2 border border-purple-400">
              <i className="fas fa-headset"></i>
              <span className="hidden md:inline">SUPPORT</span>
            </button>
            {!isAuthenticated ? (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-cyan-500 text-black font-bold rounded-full text-sm hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] transition-all flex items-center gap-2 border-2 border-cyan-400">
                <i className="fas fa-sign-in-alt"></i>
                SE CONNECTER
              </button>
            ) : (
              <div 
                onClick={() => navigate('/profile')}
                className="group flex items-center gap-3 cursor-pointer p-1 rounded-full pr-4 hover:bg-white/5 transition-all border border-transparent hover:border-zenith-greenDim">
                 <div className="w-10 h-10 rounded-full border border-zenith-greenDim p-0.5 group-hover:border-zenith-green transition-colors relative">
                    <img src={user?.avatar || "https://picsum.photos/seed/avatar/200/200"} className="w-full h-full rounded-full object-cover" alt="User" />
                    {showStatus() && <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zenith-surface ${user?.privacy === 'ENCRYPTED' ? 'bg-red-500' : 'bg-green-500'}`}></div>}
                 </div>
                 <div className="hidden md:block text-right">
                    <div className="text-xs font-bold text-white flex items-center">
                        {user?.username}
                        {getVerificationBadge()}
                    </div>
                   <div className="text-[10px] text-zenith-dim uppercase">{user?.role}</div>
                 </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 snap-y snap-mandatory overflow-y-auto scroll-smooth h-full">
           {children}
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-6 md:hidden text-white text-center">
            <button className="flex flex-col items-center gap-1">
                <i className="fas fa-heart text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"></i>
                <span className="text-xs font-bold">1.2M</span>
            </button>
            <button className="flex flex-col items-center gap-1">
                <i className="fas fa-comment-dots text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"></i>
                <span className="text-xs font-bold">84K</span>
            </button>
            <button className="flex flex-col items-center gap-1">
                <i className="fas fa-share text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"></i>
                <span className="text-xs font-bold">22K</span>
            </button>
             <button className="flex flex-col items-center gap-1">
                <i className="fas fa-bookmark text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"></i>
            </button>
        </div>

        <audio id="bg-music" src="https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Sentinel.mp3" loop></audio>
      </main>

      <nav className="md:hidden h-20 bg-zenith-surface border-t border-zenith-greenDim fixed bottom-0 w-full flex justify-around items-center z-50 pb-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-all ${location.pathname === item.path ? 'text-zenith-green' : 'text-zenith-dim'}`}>
            <i className={`fas ${item.icon} text-xl transition-transform ${location.pathname === item.path ? '-translate-y-1 drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]' : ''}`}></i>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
};

export default Layout;
