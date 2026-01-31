import React, { useState } from 'react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { DB } from '../services/storageService';

const Settings: React.FC = () => {
  const { currentTheme, changeTheme, updateCustomColor } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'theme' | 'privacy' | 'storage' | 'clearance'>('general');

  const handleLogout = () => {
    if(window.confirm("Terminate Session?")) {
      DB.logout();
      window.location.reload();
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-10">
      <h2 className="text-3xl font-tech mb-6 text-zenith-green border-b border-zenith-greenDim pb-2">SYSTEM CONFIGURATION</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Settings Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'general', icon: 'fa-sliders-h', label: 'General' },
            { id: 'theme', icon: 'fa-palette', label: 'Appearance' },
            { id: 'privacy', icon: 'fa-user-shield', label: 'Privacy & Security' },
            { id: 'storage', icon: 'fa-database', label: 'Data & Storage' },
            { id: 'clearance', icon: 'fa-id-card', label: 'Clearance & Store', highlight: true }
          ].map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`w-full text-left px-4 py-3 rounded-lg border flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-zenith-greenDim border-zenith-green text-white' : 'border-transparent text-zenith-dim hover:bg-zenith-surface'} ${tab.highlight ? 'text-yellow-400 hover:text-yellow-300' : ''}`}
             >
               <i className={`fas ${tab.icon} w-6 text-center`}></i>
               <span className="capitalize font-bold">{tab.label}</span>
             </button>
          ))}
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 mt-8 flex items-center gap-3 transition-all">
             <i className="fas fa-power-off w-6 text-center"></i>
             <span className="font-bold">System Shutdown</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          
          {activeTab === 'general' && (
            <div className="glass-card p-6 rounded-2xl animate-fade-in space-y-6">
               <div>
                  <h3 className="font-tech text-xl mb-4 text-white">Language</h3>
                  <div className="bg-black/30 p-4 rounded-xl border border-zenith-greenDim flex items-center justify-between cursor-pointer hover:border-zenith-green transition-colors">
                     <span>English (System Default)</span>
                     <i className="fas fa-chevron-down text-zenith-dim"></i>
                  </div>
               </div>
               
               <div>
                  <h3 className="font-tech text-xl mb-4 text-white">Notifications</h3>
                  <div className="space-y-2">
                     {['Private Chats', 'Groups', 'Channels', 'Mentions'].map(item => (
                        <div key={item} className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30">
                           <span className="text-sm font-bold text-gray-300">{item}</span>
                           <input type="checkbox" defaultChecked className="toggle-checkbox accent-zenith-green w-5 h-5"/>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-tech text-xl mb-4 text-white">Theme Presets</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(THEMES).map((themeKey) => (
                    <button 
                      key={themeKey}
                      onClick={() => changeTheme(themeKey as any)}
                      className="p-4 rounded-xl border border-zenith-greenDim hover:border-zenith-green transition-all bg-black/40 flex flex-col items-center gap-2 group"
                    >
                      <div className="w-12 h-12 rounded-full shadow-lg group-hover:scale-110 transition-transform" style={{ background: (THEMES as any)[themeKey]['--z-primary'] }}></div>
                      <span className="text-xs font-bold text-zenith-dim">{themeKey.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-tech text-xl mb-4 text-white">Customizer Engine</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-black/30 rounded-lg flex items-center justify-between border border-zenith-greenDim">
                    <span className="text-sm">Accent Color</span>
                    <input 
                      type="color" 
                      value={currentTheme['--z-primary']} 
                      onChange={(e) => updateCustomColor('--z-primary', e.target.value)}
                      className="bg-transparent w-8 h-8 cursor-pointer rounded-full overflow-hidden"
                    />
                  </div>
                  <div className="p-3 bg-black/30 rounded-lg flex items-center justify-between border border-zenith-greenDim">
                    <span className="text-sm">Background Base</span>
                    <input 
                      type="color" 
                      value={currentTheme['--z-bg']} 
                      onChange={(e) => updateCustomColor('--z-bg', e.target.value)}
                      className="bg-transparent w-8 h-8 cursor-pointer rounded-full overflow-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="glass-card p-6 rounded-2xl animate-fade-in space-y-6">
               <div className="bg-zenith-surface p-4 rounded-xl border border-zenith-greenDim/50">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-xl">
                        <i className="fas fa-user-lock"></i>
                     </div>
                     <div>
                        <h4 className="font-bold text-white">Two-Step Verification</h4>
                        <p className="text-xs text-zenith-dim">Add an extra layer of security</p>
                     </div>
                     <button className="ml-auto text-blue-400 font-bold hover:underline">Enable</button>
                  </div>
                  <div className="h-px bg-zenith-greenDim my-2"></div>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-xl">
                        <i className="fas fa-ban"></i>
                     </div>
                     <div>
                        <h4 className="font-bold text-white">Blocked Users</h4>
                        <p className="text-xs text-zenith-dim">Manage your blacklist</p>
                     </div>
                     <span className="ml-auto text-zenith-dim">3 users</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-zenith-green text-sm font-bold uppercase tracking-wider">Privacy Settings</h4>
                  {[
                     { label: 'Phone Number', val: 'Nobody' },
                     { label: 'Last Seen & Online', val: 'Contacts' },
                     { label: 'Profile Photo', val: 'Everybody' },
                     { label: 'Forwarded Messages', val: 'Everybody' },
                  ].map(setting => (
                     <div key={setting.label} className="flex justify-between items-center p-3 hover:bg-white/5 rounded cursor-pointer transition-colors">
                        <span className="text-sm text-white">{setting.label}</span>
                        <span className="text-sm text-zenith-dim">{setting.val}</span>
                     </div>
                  ))}
               </div>
               
               <div className="p-4 bg-red-900/10 border border-red-500/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3 text-red-400">
                     <i className="fas fa-clock"></i>
                     <span className="font-bold">Auto-Delete Account</span>
                  </div>
                  <span className="text-sm text-zenith-dim">If away for 6 months</span>
               </div>
            </div>
          )}

          {activeTab === 'storage' && (
             <div className="glass-card p-6 rounded-2xl animate-fade-in">
                <div className="flex items-center gap-6 mb-8">
                   <div className="w-32 h-32 relative">
                      <svg className="w-full h-full transform -rotate-90">
                         <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="transparent"></circle>
                         <circle cx="64" cy="64" r="56" stroke="#00ff88" strokeWidth="12" fill="transparent" strokeDasharray="351" strokeDashoffset="100"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-2xl font-bold text-white">72%</span>
                         <span className="text-[10px] text-zenith-dim">USED</span>
                      </div>
                   </div>
                   <div className="flex-1 space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-zenith-green">● Cache</span> <span>1.2 GB</span></div>
                      <div className="flex justify-between text-sm"><span className="text-blue-500">● Media</span> <span>3.4 GB</span></div>
                      <div className="flex justify-between text-sm"><span className="text-yellow-500">● Documents</span> <span>500 MB</span></div>
                   </div>
                </div>
                <button className="w-full py-3 border border-zenith-greenDim rounded-xl text-white hover:bg-zenith-surface transition-colors">
                   Clear Cache
                </button>
             </div>
          )}

          {activeTab === 'clearance' && (
            <div className="animate-fade-in space-y-6">
               {/* Current Status */}
               <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-2xl border border-yellow-500 flex items-center justify-between">
                  <div>
                     <h3 className="text-2xl font-tech text-white">CLEARANCE LEVEL 1</h3>
                     <p className="text-yellow-200 text-sm">Standard Access. Upgrade for full Zenith capabilities.</p>
                  </div>
                  <div className="text-right">
                     <div className="text-3xl font-bold text-white">50</div>
                     <div className="text-[10px] text-yellow-200 uppercase tracking-wider">Credits Available</div>
                  </div>
               </div>

               {/* Pricing Tiers */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Level 5 */}
                  <div className="glass-card p-6 rounded-2xl border-zenith-greenDim relative overflow-hidden group hover:border-zenith-green transition-all">
                     <div className="absolute top-0 right-0 bg-zenith-green text-black text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                     <h3 className="text-xl font-bold text-white mb-2">Level 5 Clearance</h3>
                     <div className="text-3xl font-tech text-zenith-green mb-4">$5<span className="text-sm text-zenith-dim">/mo</span></div>
                     <ul className="space-y-3 mb-6 text-sm text-gray-300">
                        <li className="flex items-center gap-2"><i className="fas fa-check text-zenith-green"></i> <span>Blue Verified Badge</span></li>
                        <li className="flex items-center gap-2"><i className="fas fa-check text-zenith-green"></i> <span>Create 10 Groups</span></li>
                        <li className="flex items-center gap-2"><i className="fas fa-check text-zenith-green"></i> <span>4K Image Uploads</span></li>
                        <li className="flex items-center gap-2"><i className="fas fa-check text-zenith-green"></i> <span>Priority AI Processing</span></li>
                     </ul>
                     <button className="w-full bg-zenith-green text-black font-bold py-3 rounded-xl hover:shadow-[0_0_20px_var(--z-primary)] transition-all">
                        Upgrade Access
                     </button>
                  </div>

                  {/* Level 10 */}
                  <div className="glass-card p-6 rounded-2xl border-purple-500/30 relative overflow-hidden group hover:border-purple-500 transition-all">
                     <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">ELITE</div>
                     <h3 className="text-xl font-bold text-white mb-2">Level 10 Clearance</h3>
                     <div className="text-3xl font-tech text-purple-400 mb-4">$15<span className="text-sm text-zenith-dim">/mo</span></div>
                     <ul className="space-y-3 mb-6 text-sm text-gray-300">
                        <li className="flex items-center gap-2"><i className="fas fa-check text-purple-400"></i> <span>Gold Verified Badge</span></li>
                        <li className="flex items-center gap-2"><i className="fas fa-check text-purple-400"></i> <span>Unlimited Encrypted Groups</span></li>
                        <li className="flex items-center gap-2"><i className="fas fa-check text-purple-400"></i> <span>Marketplace Seller Access</span></li>
                        <li className="flex items-center gap-2"><i className="fas fa-check text-purple-400"></i> <span>Dev Tools & API Keys</span></li>
                     </ul>
                     <button className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_purple] transition-all">
                        Request Clearance
                     </button>
                  </div>
               </div>

               {/* Marketplace Teaser */}
               <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-3xl">
                     <i className="fas fa-store"></i>
                  </div>
                  <div className="flex-1">
                     <h3 className="text-xl font-bold text-white">Digital Asset Marketplace</h3>
                     <p className="text-zenith-dim text-sm mt-1">
                        Sell your code snippets, themes, and educational courses. Zenith takes a small commission to maintain the core servers.
                     </p>
                  </div>
                  <button className="px-6 py-3 border border-blue-500 text-blue-400 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition-all">
                     Open Market
                  </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
