import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Hash, Bell, Mail, User, Plus } from 'lucide-react';

const BottomNavBar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/feed', icon: Home, label: 'Accueil' },
    { to: '/search', icon: Hash, label: 'Explorer' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/chat', icon: Mail, label: 'Messages' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button className="md:hidden fixed right-4 bottom-20 w-14 h-14 rounded-full bg-[var(--gradient-primary)] shadow-[var(--shadow-glow)] flex items-center justify-center text-white animate-pulse-halo z-50">
        <Plus size={32} />
      </button>

      {/* Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNavBar;