import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faPaintBrush, faCog } from '@fortawesome/free-solid-svg-icons';

const Sidebar: React.FC = () => {
  return (
    <aside className="group fixed top-0 left-0 h-screen bg-black/10 backdrop-blur-md text-white w-16 hover:w-56 transition-all duration-300 ease-in-out z-[100]">
      <div className="flex flex-col items-center mt-8">
        {/* Logo Placeholder */}
        <div className="w-10 h-10 bg-cyan-500 rounded-full mb-12 border-2 border-cyan-300"></div>

        <nav className="flex flex-col space-y-6">
          <NavLink to="/" className="flex items-center p-3 rounded-lg hover:bg-white/10">
            <FontAwesomeIcon icon={faBook} className="w-6 h-6 mx-auto group-hover:mx-0 transition-all" />
            <span className="ml-4 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">Academy</span>
          </NavLink>
          <NavLink to="/studio" className="flex items-center p-3 rounded-lg hover:bg-white/10">
            <FontAwesomeIcon icon={faPaintBrush} className="w-6 h-6 mx-auto group-hover:mx-0 transition-all" />
            <span className="ml-4 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">Studio</span>
          </NavLink>
          <NavLink to="/settings" className="flex items-center p-3 rounded-lg hover:bg-white/10">
            <FontAwesomeIcon icon={faCog} className="w-6 h-6 mx-auto group-hover:mx-0 transition-all" />
            <span className="ml-4 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">Settings</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
