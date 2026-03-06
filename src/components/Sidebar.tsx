import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,      // Academy
  MessageCircle, // Chat
  Rss,           // Feed
  Users,         // Community
  Palette,       // Studio
  FlaskConical,  // Lab
  Settings,
  HelpCircle,
  Shield,        // Admin
  Search,        // Search
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { formatAvatar } from '../utils/avatar';

const Sidebar: React.FC = () => {
  const { profile, isAdmin } = useUser();
  const location = useLocation();

  const mainLinks = [
    { to: '/', icon: BookOpen, label: 'Academy' },
    { to: '/feed', icon: Rss, label: 'Feed' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/community', icon: Users, label: 'Community' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/studio', icon: Palette, label: 'Studio' },
  ];

  const utilityLinks = [
    { to: '/lab', icon: FlaskConical, label: 'Outils' },
    { to: '/settings', icon: Settings, label: 'Paramètres' },
    { to: '/support', icon: HelpCircle, label: 'Support' },
    ...(isAdmin ? [{ to: '/admin', icon: Shield, label: 'Admin' }] : []),
  ];

  // Use profile from context, provide a fallback for username
  const avatarUrl = formatAvatar(profile?.avatar, profile?.username || 'guest');

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-screen w-[68px] flex-col items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/[0.06] z-[100] py-4">
      <div className="flex flex-col items-center gap-6">
        <NavLink to="/" className="relative flex items-center justify-center w-10 h-10 mb-2">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 opacity-20 blur-sm" />
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm tracking-wider font-tech">
            Z
          </div>
        </NavLink>
        <div className="w-8 h-px bg-white/10" />
        <nav className="flex flex-col items-center gap-1">
          {mainLinks.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} className="relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200">
                {isActive && <motion.div layoutId="sidebar-active" className="absolute left-[-14px] w-1 h-5 rounded-r-full bg-emerald-400" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-500/15 text-emerald-400' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.06]'}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">{link.label}</div>
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col items-center gap-1">
        <nav className="flex flex-col items-center gap-1">
          {utilityLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} className="relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200">
                 <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-500/15 text-emerald-400' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.06]'}`}>
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">{link.label}</div>
              </NavLink>
            );
          })}
        </nav>
        <div className="w-8 h-px bg-white/10 my-1" />
        {profile && (
          <NavLink to="/profile" className="relative group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                  <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a0a]" />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs font-medium text-white whitespace-rap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">Profil</div>
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
