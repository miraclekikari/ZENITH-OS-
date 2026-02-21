import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFlask, faCog, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const TopNavBar: React.FC = () => {
  const navLinks = [
    { to: "/profile", icon: faUser, text: "Profile" },
    { to: "/lab", icon: faFlask, text: "Lab" },
    { to: "/settings", icon: faCog, text: "Settings" },
    { to: "/support", icon: faQuestionCircle, text: "Support" },
  ];

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-lg border-b border-white/10 z-50">
      <div className="flex justify-around items-center h-full px-4">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center justify-center w-full h-full ${isActive ? 'text-cyan-400' : 'text-white/70'}`
            }
          >
            <FontAwesomeIcon icon={link.icon} className="w-6 h-6" />
          </NavLink>
        ))}
      </div>
    </header>
  );
};

export default TopNavBar;
