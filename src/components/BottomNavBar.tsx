import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Image as ImageIcon, Play, User } from 'lucide-react';

const BottomNavBar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/feed', icon: ImageIcon, label: 'Feed' },
    { to: '/community', icon: Play, label: 'Community' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/[0.06] z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to ||
            (link.to !== '/' && location.pathname.startsWith(link.to));
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className="flex flex-col items-center justify-center w-full h-full gap-1"
            >
              <div className={`relative flex items-center justify-center transition-colors duration-200 ${isActive ? 'text-emerald-400' : 'text-white/40'}`}>
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} />
                {isActive && (
                  <div className="absolute -top-2 w-1 h-1 rounded-full bg-emerald-400" />
                )}
              </div>
              <span className={`text-[10px] transition-colors duration-200 ${isActive ? 'text-emerald-400 font-medium' : 'text-white/30'}`}>
                {link.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
