import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Hash,
  Bell,
  Mail,
  User,
  Settings,
  PlusCircle,
  Shield,
  Zap
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Sidebar: React.FC = () => {
  const { profile, isAdmin } = useUser();
  const location = useLocation();

  const navLinks = [
    { to: '/feed', icon: Home, label: 'Accueil' },
    { to: '/search', icon: Hash, label: 'Explorer' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/chat', icon: Mail, label: 'Messages' },
    { to: '/profile', icon: User, label: 'Profil' },
    { to: '/settings', icon: Settings, label: 'Paramètres' },
    ...(isAdmin ? [{ to: '/admin', icon: Shield, label: 'Admin' }] : []),
  ];

  return (
    <div className="flex flex-col h-full py-4 px-2 lg:px-4">
      {/* Logo */}
      <div className="mb-8 px-2">
        <div className="w-10 h-10 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)]">
          <Zap className="text-white fill-white w-6 h-6" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-4 p-3 rounded-full transition-all group ${
                isActive 
                  ? 'text-primary bg-primary/10 font-semibold' 
                  : 'text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="hidden lg:block font-display text-lg">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Compose Button */}
      <div className="mt-4 px-1">
        <button className="w-full h-12 lg:h-14 rounded-full bg-[var(--gradient-primary)] shadow-[var(--shadow-glow)] flex items-center justify-center gap-2 hover:opacity-90 transition-all group">
          <PlusCircle className="text-white w-6 h-6" />
          <span className="hidden lg:block font-display font-bold text-white text-lg">Publier</span>
        </button>
      </div>

      {/* User Mini Profile */}
      {profile && (
        <div className="mt-auto pt-4 px-1">
          <div className="flex items-center gap-3 p-2 rounded-full hover:bg-muted/50 cursor-pointer transition-colors">
            <img 
              src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
              className="w-10 h-10 rounded-full border border-border" 
              alt="Avatar" 
            />
            <div className="hidden lg:flex flex-col overflow-hidden">
              <span className="font-display font-semibold truncate text-sm">{profile.username}</span>
              <span className="text-xs text-muted-foreground truncate">@{profile.username}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;