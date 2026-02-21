import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, faComments, faUsers, faPaintBrush, faFlask, 
  faCog, faUser, faQuestionCircle, faUserShield,
  faPlay, faPause, faForward, faBackward
} from '@fortawesome/free-solid-svg-icons';
import { isAdmin } from '../services/storageService';

const Sidebar: React.FC = () => {
  const admin = isAdmin();

  const navLinks = [
    { to: "/", icon: faBookOpen, text: "Academy" },
    { to: "/chat", icon: faComments, text: "Chat" },
    { to: "/community", icon: faUsers, text: "Community" },
    { to: "/studio", icon: faPaintBrush, text: "Studio" },
    { to: "/lab", icon: faFlask, text: "Lab" },
    { to: "/profile", icon: faUser, text: "Profile" },
    { to: "/settings", icon: faCog, text: "Settings" },
    { to: "/support", icon: faQuestionCircle, text: "Support" },
    ...(admin ? [{ to: "/admin", icon: faUserShield, text: "Admin" }] : []),
  ];

  return (
    <aside className="group fixed top-0 left-0 h-screen flex flex-col justify-between bg-black/10 backdrop-blur-md text-white w-16 hover:w-60 transition-all duration-300 ease-in-out z-[100]">
      <div>
        <div className="flex items-center justify-center mt-6 mb-8">
          {/* Logo Placeholder */}
          <div className="w-10 h-10 bg-cyan-500 rounded-full border-2 border-cyan-300"></div>
        </div>

        <nav className="flex flex-col space-y-2 px-2">
          {navLinks.map((link) => (
            <NavLink 
              key={link.to}
              to={link.to} 
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg hover:bg-white/10 ${isActive ? 'bg-cyan-500/20' : ''}`
              }
            >
              <FontAwesomeIcon icon={link.icon} className="w-6 h-6 text-white/80 shrink-0" />
              <span className="ml-4 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap">{link.text}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Music Player Section */}
      <div className="px-2 pb-4">
          <div className="w-full p-3 bg-white/5 rounded-lg">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-zinc-700 rounded shrink-0"></div>
                <div className="ml-2 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                    <p className="text-sm font-bold truncate whitespace-nowrap">Starlight Echoes</p>
                    <p className="text-xs text-white/60 truncate whitespace-nowrap">Nova Beat</p>
                </div>
            </div>
            <div className="flex justify-around items-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                <FontAwesomeIcon icon={faBackward} className="w-4 h-4 text-white/70 hover:text-white" />
                <FontAwesomeIcon icon={faPlay} className="w-5 h-5 text-white" />
                <FontAwesomeIcon icon={faForward} className="w-4 h-4 text-white/70 hover:text-white" />
            </div>
          </div>
      </div>
    </aside>
  );
};

export default Sidebar;
