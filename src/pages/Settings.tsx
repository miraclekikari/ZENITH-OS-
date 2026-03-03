import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Compass, ChevronRight, BookOpen, Rss, Users, MessageCircle, Palette, FlaskConical, HelpCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  // List of daily, safe-to-access pages
  const siteMap = [
    { name: 'Academy', path: '/', icon: BookOpen },
    { name: 'Feed', path: '/feed', icon: Rss },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Studio', path: '/studio', icon: Palette },
    { name: 'Outils', path: '/lab', icon: FlaskConical },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 text-white max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <SettingsIcon size={32} className="text-zenith-green" />
        <div>
          <h1 className="font-tech text-3xl md:text-4xl text-white tracking-widest">PARAMETRES</h1>
          <p className="text-zenith-dim text-sm">Manage your system preferences and navigation.</p>
        </div>
      </div>

      {/* Quick Navigation Section */}
      <div className="mb-12">
        <h2 className="font-tech text-xl mb-6 border-l-4 border-zenith-green pl-4 flex items-center gap-3">
          <Compass size={20} /> Navigation Rapide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {siteMap.map((page) => {
            const Icon = page.icon;
            return (
              <motion.button
                key={page.path}
                onClick={() => handleNavigate(page.path)}
                whileHover={{ scale: 1.05, backgroundColor: '#1a1a1a' }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between p-4 bg-zenith-surface border border-zenith-greenDim/50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Icon className="text-zenith-green" size={22} />
                  <span className="font-semibold text-lg text-white">{page.name}</span>
                </div>
                <ChevronRight className="text-zenith-dim" size={20} />
              </motion.button>
            );
          })}
        </div>
         <p className="text-xs text-zenith-dim mt-4 pl-1">Accès rapide aux sections principales de l'application. Les pages à risque comme le Profil et l'Admin sont exclues de cette liste.</p>
      </div>
      
      {/* Other settings sections can be added here */}
      <div className="w-full h-px bg-zenith-greenDim/30 my-10"></div>
      <p className="text-center text-zenith-dim text-sm">D'autres paramètres système seront bientôt disponibles ici.</p>

    </motion.div>
  );
};

export default Settings;
