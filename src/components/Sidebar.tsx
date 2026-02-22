import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  MessageCircle,
  Image as ImageIcon,
  Play,
  Palette,
  User,
  Settings,
  HelpCircle,
  Shield,
} from 'lucide-react';
import { isAdmin } from '../services/storageService';
import { supabase } from '../lib/supabaseClient';
import { Profile } from '../types/profile';

const Sidebar: React.FC = () => {
  const admin = isAdmin();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*') // Select all columns to match the Profile type
            .eq('id', user.id)
            .single();
          if (error) throw error;
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching sidebar profile:", error);
      }
    };
    fetchProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile();
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const mainLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/feed', icon: ImageIcon, label: 'Feed' },
    { to: '/community', icon: Play, label: 'Community' },
    { to: '/studio', icon: Palette, label: 'Studio' },
  ];

  const bottomLinks = [
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/support', icon: HelpCircle, label: 'Support' },
    ...(admin ? [{ to: '/admin', icon: Shield, label: 'Admin' }] : []),
  ];

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
        {bottomLinks.map((link) => {
          const isActive = location.pathname === link.to;
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
        <div className="w-8 h-px bg-white/10 my-1" />
        <NavLink to="/profile" className="relative group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
              ) : profile?.username ? (
                <span className="font-bold text-sm text-white/80">{(profile.username.charAt(0) || '').toUpperCase()}</span>
              ) : (
                <User size={16} className="text-white/60" />
              )}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a0a]" />
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">Profile</div>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
