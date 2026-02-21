import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faUsers, faPaintBrush, faComments, faUser } from '@fortawesome/free-solid-svg-icons';

const BottomNavBar: React.FC = () => {
  const navLinks = [
    { to: "/", icon: faBookOpen, text: "Academy" },
    { to: "/community", icon: faUsers, text: "Community" },
    { to: "/studio", icon: faPaintBrush, text: "Studio" },
    { to: "/chat", icon: faComments, text: "Chat" },
    { to: "/profile", icon: faUser, text: "Profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs w-full h-full ${isActive ? 'text-cyan-400' : 'text-white/70'}`
            }
          >
            <FontAwesomeIcon icon={link.icon} className="w-6 h-6 mb-1" />
            <span>{link.text}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
