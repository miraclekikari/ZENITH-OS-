import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { formatAvatar } from '../utils/avatar';
import { Settings, Shield, LogOut, X, Wifi, Cpu, ShieldCheck, Fingerprint, GitBranch } from 'lucide-react';

// --- FAKE DATA ---
const fakeLogs = [
  'KERNEL_INFO: System boot initiated...',
  'AUTH_SUCCESS: User root credentials verified.',
  'NETWORK_INFO: Uplink established with ZENITH orbital server.',
  'SECURITY_ALERT: Minor anomaly detected in sub-routine #4. Correcting...',
  'DATA_SYNC: Encrypted user data stream initialized.',
  'GPU_INFO: NVIDIA RTX 4090 drivers loaded.',
  'AI_CORE: Gemini Pro module online.',
  'SYS_WARN: High-entropy stream detected from unknown source.',
  'FIREWALL: Port 7777 opened for secure shell.',
  'KERNEL_PANIC: Just kidding.',
];

// --- SUB-COMPONENTS ---

// Sheet component for mobile menu
const SheetMenu = ({ isOpen, onClose }) => {
  const { logout } = useUser();

  const menuItems = [
    { icon: Settings, label: 'SYSTEM SETTINGS' },
    { icon: ShieldCheck, label: 'SECURITY PROTOCOLS' },
  ];

  const handleLogout = () => {
    // Show alert first, then log out
    alert('LOGGING OUT...');
    logout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-72 bg-[#0a0a0a] border-l border-white/10 z-50 p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-tech text-lg tracking-widest text-emerald-400">OPERATOR</h2>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => alert('ACCESS DENIED: ENCRYPTED SECTION')}
                  className="w-full flex items-center gap-4 p-3 rounded-lg text-left text-white/80 hover:bg-white/5 transition-colors"
                >
                  <item.icon size={18} />
                  <span className="font-sans">{item.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-3 rounded-lg text-left text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-sans">LOG OUT</span>
              </button>
            </div>
             {/* Laser scan effect */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-cyan-400/80"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: [0, 1, 0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                style={{ filter: 'blur(4px)'}}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


// Mobile Header Component
const MobileHeader = ({ onAvatarClick }) => {
  const { profile } = useUser();
  const avatarUrl = profile ? formatAvatar(profile.avatar_url, profile.username) : '';

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/50 backdrop-blur-md border-b border-white/10 z-40 px-4 flex items-center justify-between">
      <div className="font-tech text-xl text-white tracking-widest" style={{ filter: 'drop-shadow(0 0 5px rgba(0, 255, 135, 0.4))' }}>
        ZENITH
      </div>
      <button onClick={onAvatarClick}>
        <motion.div 
            className="w-10 h-10 rounded-full p-0.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundImage: 'linear-gradient(to right, #00f260, #0575e6)'}}
        >
          <img src={avatarUrl} alt="User Avatar" className="w-full h-full rounded-full object-cover border-2 border-[#0a0a0a]" />
        </motion.div>
      </button>
    </div>
  );
};

// --- MAIN PROFILE COMPONENT ---

const NewProfile: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile, loading } = useUser();

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center text-white/50 bg-[#0a0a0a]">LOADING OPERATOR DATA...</div>;
  }
  
  if (!profile) {
    return <div className="w-full h-screen flex items-center justify-center text-red-400 bg-[#0a0a0a]">ERROR: PROFILE NOT FOUND.</div>;
  }
  
  const avatarUrl = formatAvatar(profile.avatar_url, profile.username);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const FictionalModule = ({ icon, title, children, className = '' }) => (
    <motion.div
        variants={itemVariants}
        className={`bg-[#111]/60 border border-white/10 rounded-xl p-4 hover:bg-[#111]/90 hover:border-emerald-500/30 transition-colors duration-300 ${className}`}
    >
        <div className="flex items-center gap-2 mb-3 text-emerald-400/80">
            {icon}
            <h3 className="font-tech text-sm tracking-widest">{title}</h3>
        </div>
        {children}
    </motion.div>
  );

  return (
    <>
      <MobileHeader onAvatarClick={() => setIsMenuOpen(true)} />
      <SheetMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="min-h-screen w-full text-white p-4 md:p-8 bg-[#0a0a0a] pt-20 md:pt-8">
        {/* --- DESKTOP/MAIN PROFILE HEADER --- */}
        <header className="hidden md:block w-full max-w-5xl mx-auto mb-8">
             <div className="relative border border-white/10 rounded-2xl p-6 bg-grid-pattern">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-emerald-500 to-cyan-500 flex-shrink-0">
                        <img src={avatarUrl} alt={profile.username} className="w-full h-full rounded-full object-cover border-4 border-[#111]" />
                    </div>
                    <div className="text-center md:text-left z-10">
                        <h1 className="text-3xl font-bold">{profile.username}</h1>
                        <p className="text-cyan-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                          <span className="inline-block px-3 py-1 text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,255,135,0.4)]">
                            VERIFIED OPERATOR
                          </span>
                        </p>
                        <p className="text-white/50 text-sm mt-3 max-w-md">Cybernetically enhanced operative. Specialized in digital reconnaissance and tactical infiltration.</p>
                    </div>
                </div>
            </div>
        </header>

        {/* --- MOBILE PROFILE HEADER --- */}
        <header className="md:hidden w-full max-w-5xl mx-auto mb-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-br from-emerald-500 to-cyan-500">
                <img src={avatarUrl} alt={profile.username} className="w-full h-full rounded-full object-cover border-2 border-[#0a0a0a]" />
            </div>
            <h1 className="text-2xl font-bold mt-4">{profile.username}</h1>
            <p className="text-cyan-400 text-sm mt-1">@_user_handle_placeholder</p>
            <span className="mt-2 inline-block px-3 py-1 text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,255,135,0.4)]">
                VERIFIED OPERATOR
            </span>
        </header>

        {/* --- FICTIONAL MODULES --- */}
        <motion.main 
            className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <FictionalModule icon={<Wifi size={16}/>} title="SYNC STATUS">
                <p className="text-xs text-white/50 mb-1">DATA UPLINK: 85%</p>
                <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                        style={{ width: '85%' }}
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </div>
            </FictionalModule>

            <FictionalModule icon={<Shield size={16}/>} title="SECURITY LEVEL">
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-white">Alpha-7</p>
                    <Fingerprint size={36} className="text-cyan-400/50" />
                </div>
                 <p className="text-xs text-white/40 mt-1">All sub-systems nominal.</p>
            </FictionalModule>

            <FictionalModule icon={<Cpu size={16}/>} title="OPERATOR STATS">
                 <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="font-bold text-lg">1,204</p>
                        <p className="text-xs text-white/40">MISSIONS</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">98.7%</p>
                        <p className="text-xs text-white/40">SUCCESS</p>
                    </div>
                     <div>
                        <p className="font-bold text-lg">34</p>
                        <p className="text-xs text-white/40">AWARDS</p>
                    </div>
                </div>
            </FictionalModule>
            
            <FictionalModule icon={<GitBranch size={16}/>} title="SYSTEM LOGS" className="lg:col-span-3">
                <div className="h-40 bg-black/70 rounded-lg p-2 font-mono text-xs text-green-400/70 overflow-hidden relative">
                    <motion.div
                        animate={{ y: ['0%', '-50%'] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="whitespace-pre"
                    >
                      {fakeLogs.join('\n')}
                      {fakeLogs.join('\n')}
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none"></div>
                </div>
            </FictionalModule>

        </motion.main>
      </div>
      <style>{`.bg-grid-pattern { background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 2rem 2rem; }`}</style>
    </>
  );
};

export default NewProfile;
