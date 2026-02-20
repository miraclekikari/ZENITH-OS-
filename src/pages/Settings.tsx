import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, THEMES } from '../context/ThemeContext';
import { DB } from '../services/storageService';
import ThemeSwitcher from '../components/ThemeSwitcher';

interface NotificationSettings {
  privateChats: boolean;
  groups: boolean;
  channels: boolean;
  mentions: boolean;
  sounds: boolean;
  vibrations: boolean;
  desktop: boolean;
  email: boolean;
}

interface PrivacySettings {
  phoneNumber: 'everyone' | 'contacts' | 'nobody';
  lastSeen: 'everyone' | 'contacts' | 'nobody';
  profilePhoto: 'everyone' | 'contacts' | 'nobody';
  forwardedMessages: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
  typingIndicators: boolean;
}

const Settings: React.FC = () => {
  const { i18n } = useTranslation();
  const { 
    currentTheme, 
    changeTheme, 
    updateCustomColor,
    themeSettings,
    updateSettings,
    isTransitioning,
    randomTheme,
    availableThemes
  } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'general' | 'theme' | 'privacy' | 'storage' | 'clearance'>('general');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    privateChats: true,
    groups: true,
    channels: false,
    mentions: true,
    sounds: true,
    vibrations: true,
    desktop: false,
    email: false
  });
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    phoneNumber: 'contacts',
    lastSeen: 'contacts',
    profilePhoto: 'everyone',
    forwardedMessages: 'everyone',
    readReceipts: true,
    typingIndicators: true
  });
  
  const [storageUsage, setStorageUsage] = useState({
    cache: 1.2,
    media: 3.4,
    documents: 0.5,
    total: 5.1,
    max: 10
  });
  
  const [clearanceLevel, setClearanceLevel] = useState(1);
  const [credits, setCredits] = useState(50);
  const [isClearanceUpgrading, setIsClearanceUpgrading] = useState(false);

  useEffect(() => {
    const savedNotifications = DB.getNotificationSettings();
    if (savedNotifications) setNotificationSettings(savedNotifications);
    
    const savedPrivacy = DB.getPrivacySettings();
    if (savedPrivacy) setPrivacySettings(savedPrivacy);
    
    const savedClearance = DB.getClearanceLevel();
    if (savedClearance) {
      setClearanceLevel(savedClearance.level);
      setCredits(savedClearance.credits);
    }
  }, []);

  const handleLogout = () => {
    if(window.confirm("Terminate Session? All unsaved data will be lost.")) {
      DB.logout();
      window.location.reload();
    }
  };

  const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    DB.saveNotificationSettings(newSettings);
    
    showNotification(`${key.replace(/([A-Z])/g, ' $1').trim()} ${value ? 'enabled' : 'disabled'}`);
  };

  const updatePrivacySetting = (key: keyof PrivacySettings, value: any) => {
    const newSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newSettings);
    DB.savePrivacySettings(newSettings);
  };

  const clearCache = () => {
    setIsClearanceUpgrading(true);
    setTimeout(() => {
      setStorageUsage(prev => ({ ...prev, cache: 0, total: prev.media + prev.documents }));
      setIsClearanceUpgrading(false);
      showNotification('Cache cleared successfully');
    }, 2000);
  };

  const upgradeClearance = (level: number) => {
    setIsClearanceUpgrading(true);
    setTimeout(() => {
      const newLevel = Math.max(clearanceLevel, level);
      DB.saveClearanceLevel({ level: newLevel, credits: credits - (level === 5 ? 5 : 15) });
      setClearanceLevel(newLevel);
      setCredits(prev => prev - (level === 5 ? 5 : 15));
      setIsClearanceUpgrading(false);
      showNotification(`Upgraded to Level ${level} Clearance!`);
    }, 3000);
  };

  const showNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-zenith-green text-black px-6 py-3 rounded-lg font-bold z-50 animate-slide-in';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const getThemeIcon = (themeName: string) => {
    const icons: { [key: string]: string } = {
      ZENITH_DEFAULT: 'fa-microchip',
      CYBER_PUNK: 'fa-robot',
      ROYAL_BLUE: 'fa-crown',
      CRIMSON_OPS: 'fa-fire',
      NEON_PURPLE: 'fa-magic',
      MATRIX_GREEN: 'fa-code',
      SOLAR_FLARE: 'fa-sun',
      ARCTIC_FROST: 'fa-snowflake',
      LIGHT: 'fa-sun',
      DARK: 'fa-moon'
    };
    return icons[themeName] || 'fa-palette';
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-10">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-tech mb-2 text-transparent bg-clip-text" style={{ backgroundImage: currentTheme['--z-gradient'] }}>
          SYSTEM CONFIGURATION
        </h2>
        <p className="text-zenith-dim">Customize your Zenith experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'general', icon: 'fa-sliders-h', label: 'General', badge: null },
            { id: 'theme', icon: 'fa-palette', label: 'Appearance', badge: 'NEW' },
            { id: 'privacy', icon: 'fa-user-shield', label: 'Privacy', badge: null },
            { id: 'storage', icon: 'fa-database', label: 'Storage', badge: `${Math.round((storageUsage.total / storageUsage.max) * 100)}%` },
            { id: 'clearance', icon: 'fa-id-card', label: 'Clearance', badge: 'LVL ' + clearanceLevel, highlight: true }
          ].map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`w-full text-left px-4 py-3 rounded-xl border flex items-center gap-3 transition-all transform hover:scale-105 ${
                 activeTab === tab.id 
                   ? 'bg-gradient-to-r from-zenith-green/20 to-cyan-500/20 border-zenith-green text-white shadow-lg' 
                   : 'border-transparent text-zenith-dim hover:bg-zenith-surface/50'
               } ${tab.highlight ? 'text-yellow-400 hover:text-yellow-300' : ''}`}
             >
               <i className={`fas ${tab.icon} w-6 text-center ${activeTab === tab.id ? 'animate-pulse' : ''}`}></i>
               <span className="capitalize font-bold flex-1">{tab.label}</span>
               {tab.badge && (
                 <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                   tab.highlight ? 'bg-yellow-500/20 text-yellow-400' : 'bg-zenith-green/20 text-zenith-green'
                 }`}>
                   {tab.badge}
                 </span>
               )}
             </button>
          ))}
          
          <button 
            onClick={handleLogout} 
            className="w-full text-left px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 mt-8 flex items-center gap-3 transition-all transform hover:scale-105"
          >
             <i className="fas fa-power-off w-6 text-center"></i>
             <span className="font-bold">System Shutdown</span>
          </button>
        </div>

        <div className="lg:col-span-4">
          
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-tech text-2xl mb-6 text-white flex items-center gap-3">
                  <i className="fas fa-cog text-zenith-green animate-spin-slow"></i>
                  General Settings
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Language & Region</h4>
                    <div className="bg-black/30 p-4 rounded-xl border border-zenith-greenDim flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <i className="fas fa-globe text-zenith-green"></i>
                        <span>Select Language</span>
                      </div>
                      <select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        className="bg-black/50 border border-zenith-greenDim rounded-lg px-3 py-1 text-white focus:border-zenith-green focus:outline-none"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Notification Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-all group">
                          <span className="text-sm font-bold text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <button
                            onClick={() => updateNotificationSetting(key as keyof NotificationSettings, !value)}
                            className={`w-12 h-6 rounded-full transition-all ${value ? 'bg-zenith-green' : 'bg-gray-600'} relative`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-7' : 'left-1'}`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-tech text-2xl mb-6 text-white flex items-center gap-3">
                  <i className="fas fa-palette text-zenith-green animate-pulse"></i>
                  Theme Engine
                </h3>
                
                <ThemeSwitcher />

                <div className="mb-8">
                  <h4 className="text-lg font-bold text-white mb-4">Theme Presets</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(THEMES).map((themeKey) => {
                      const theme = (THEMES as any)[themeKey];
                      const isActive = currentTheme['--z-primary'] === theme['--z-primary'];
                      
                      return (
                        <button 
                          key={themeKey}
                          onClick={() => changeTheme(themeKey as any)}
                          className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 group ${
                            isActive 
                              ? 'border-zenith-green shadow-lg shadow-zenith-green/50' 
                              : 'border-zenith-greenDim hover:border-zenith-green'
                          } bg-black/40 flex flex-col items-center gap-3`}
                        >
                          <div className="relative">
                            <div 
                              className="w-16 h-16 rounded-full shadow-lg group-hover:scale-110 transition-transform animate-pulse-slow"
                              style={{ 
                                background: theme['--z-gradient'],
                                boxShadow: theme['--z-shadow']
                              }}
                            ></div>
                            {isActive && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-zenith-green rounded-full flex items-center justify-center text-black text-xs font-bold animate-bounce">
                                ✓
                              </div>
                            )}
                          </div>
                          <i className={`fas ${getThemeIcon(themeKey)} text-zenith-green group-hover:animate-spin`}></i>
                          <span className="text-xs font-bold text-zenith-dim">{themeKey.replace('_ ', ' ')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-4 rounded-xl">
                    <h4 className="text-white font-bold mb-4">Theme Settings</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Auto Switch</span>
                        <input
                          type="checkbox"
                          checked={themeSettings.autoSwitch}
                          onChange={(e) => updateSettings({ autoSwitch: e.target.checked })}
                          className="toggle-checkbox"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Time-based</span>
                        <input
                          type="checkbox"
                          checked={themeSettings.timeBased}
                          onChange={(e) => updateSettings({ timeBased: e.target.checked })}
                          className="toggle-checkbox"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Animations</span>
                        <input
                          type="checkbox"
                          checked={themeSettings.animations}
                          onChange={(e) => updateSettings({ animations: e.target.checked })}
                          className="toggle-checkbox"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 rounded-xl">
                    <h4 className="text-white font-bold mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button
                        onClick={randomTheme}
                        className="w-full py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-all transform hover:scale-105"
                      >
                        <i className="fas fa-random mr-2"></i>
                        Random Theme
                      </button>
                      <button
                        onClick={() => changeTheme('ZENITH_DEFAULT')}
                        className="w-full py-2 border border-zenith-green text-zenith-green rounded-lg font-bold hover:bg-zenith-green hover:text-black transition-all"
                      >
                        <i className="fas fa-undo mr-2"></i>
                        Reset to Default
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-white mb-4">Custom Color Engine</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: '--z-primary', label: 'Accent Color' },
                    { key: '--z-bg', label: 'Background' },
                    { key: '--z-surface', label: 'Surface' }
                  ].map(({ key, label }) => (
                    <div key={key} className="p-3 bg-black/30 rounded-lg flex items-center justify-between border border-zenith-greenDim hover:border-zenith-green transition-all group">
                      <span className="text-sm">{label}</span>
                      <input 
                        type="color" 
                        value={currentTheme[key] || '#00ff88'} 
                        onChange={(e) => updateCustomColor(key, e.target.value)}
                        className="bg-transparent w-10 h-10 cursor-pointer rounded-full overflow-hidden border-2 border-zenith-green hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-tech text-2xl mb-6 text-white flex items-center gap-3">
                  <i className="fas fa-shield-alt text-zenith-green animate-pulse"></i>
                  Privacy & Security
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-blue-500/30">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
                        <i className="fas fa-user-lock"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg">Two-Step Verification</h4>
                        <p className="text-xs text-zenith-dim">Add an extra layer of security</p>
                      </div>
                      <button 
                        onClick={() => showNotification('2FA setup initiated')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-400 transition-all transform hover:scale-105"
                      >
                        Enable
                      </button>
                    </div>
                    
                    <div className="h-px bg-blue-500/30 my-4"></div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-2xl">
                        <i className="fas fa-ban"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg">Blocked Users</h4>
                        <p className="text-xs text-zenith-dim">Manage your blacklist</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-400">3</div>
                        <button className="text-xs text-zenith-dim hover:text-white transition-colors">View List</button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-zenith-green text-sm font-bold uppercase tracking-wider mb-4">Privacy Controls</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'phoneNumber', label: 'Phone Number', icon: 'fa-phone' },
                        { key: 'lastSeen', label: 'Last Seen & Online', icon: 'fa-clock' },
                        { key: 'profilePhoto', label: 'Profile Photo', icon: 'fa-camera' },
                        { key: 'forwardedMessages', label: 'Forwarded Messages', icon: 'fa-share' },
                      ].map(setting => (
                        <div key={setting.key} className="flex justify-between items-center p-4 bg-black/20 rounded-xl hover:bg-black/30 cursor-pointer transition-all group">
                          <div className="flex items-center gap-3">
                            <i className={`fas ${setting.icon} text-zenith-green group-hover:animate-bounce`}></i>
                            <span className="text-sm text-white font-bold">{setting.label}</span>
                          </div>
                          <select
                            value={privacySettings[setting.key as keyof PrivacySettings] as any}
                            onChange={(e) => updatePrivacySetting(setting.key as keyof PrivacySettings, e.target.value as 'everyone' | 'contacts' | 'nobody')}
                            className="bg-black/50 border border-zenith-greenDim rounded-lg px-3 py-1 text-zenith-dim focus:border-zenith-green focus:outline-none"
                            style={{ color: 'white' }}
                          >
                            <option value="everyone">Everyone</option>
                            <option value="contacts">Contacts</option>
                            <option value="nobody">Nobody</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center justify-between p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-all">
                      <span className="text-sm text-white font-bold">Read Receipts</span>
                      <input
                        type="checkbox"
                        checked={privacySettings.readReceipts}
                        onChange={(e) => updatePrivacySetting('readReceipts', e.target.checked)}
                        className="toggle-checkbox"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-all">
                      <span className="text-sm text-white font-bold">Typing Indicators</span>
                      <input
                        type="checkbox"
                        checked={privacySettings.typingIndicators}
                        onChange={(e) => updatePrivacySetting('typingIndicators', e.target.checked)}
                        className="toggle-checkbox"
                      />
                    </label>
                  </div>
                  
                  <div className="p-4 bg-red-900/10 border border-red-500/30 rounded-xl flex items-center justify-between group hover:bg-red-900/20 transition-all">
                    <div className="flex items-center gap-3 text-red-400">
                      <i className="fas fa-clock group-hover:animate-spin"></i>
                      <span className="font-bold">Auto-Delete Account</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zenith-dim">If away for 6 months</div>
                      <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Configure</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-tech text-2xl mb-6 text-white flex items-center gap-3">
                  <i className="fas fa-database text-zenith-green animate-pulse"></i>
                  Storage Management
                </h3>
                
                <div className="flex items-center gap-8 mb-8">
                  <div className="w-40 h-40 relative">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="80" 
                        cy="80" 
                        r="70" 
                        stroke="rgba(255,255,255,0.1)" 
                        strokeWidth="12" 
                        fill="transparent"
                      ></circle>
                      <circle 
                        cx="80" 
                        cy="80" 
                        r="70" 
                        stroke="url(#storageGradient)" 
                        strokeWidth="12" 
                        fill="transparent" 
                        strokeDasharray={`${(storageUsage.total / storageUsage.max) * 440} 440`}
                        className="transition-all duration-1000"
                      ></circle>
                      <defs>
                        <linearGradient id="storageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00ff88" />
                          <stop offset="100%" stopColor="#00aaff" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{Math.round((storageUsage.total / storageUsage.max) * 100)}%</span>
                      <span className="text-xs text-zenith-dim uppercase tracking-wider">Used</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-zenith-green rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold">Cache</span>
                      </div>
                      <span className="text-sm text-zenith-dim">{storageUsage.cache.toFixed(1)} GB</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold">Media</span>
                      </div>
                      <span className="text-sm text-zenith-dim">{storageUsage.media.toFixed(1)} GB</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold">Documents</span>
                      </div>
                      <span className="text-sm text-zenith-dim">{storageUsage.documents.toFixed(1)} GB</span>
                    </div>
                    <div className="pt-3 border-t border-zenith-greenDim">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white">Total Storage</span>
                        <span className="text-sm text-zenith-dim">{storageUsage.total.toFixed(1)} / {storageUsage.max} GB</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={clearCache}
                    disabled={isClearanceUpgrading}
                    className="py-3 border border-zenith-green rounded-xl text-white hover:bg-zenith-green hover:text-black transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <i className={`fas fa-trash ${isClearanceUpgrading ? 'animate-spin' : ''}`}></i>
                    {isClearanceUpgrading ? 'Clearing...' : 'Clear Cache'}
                  </button>
                  <button className="py-3 border border-red-500 text-red-400 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                    <i className="fas fa-hdd"></i>
                    Manage Files
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clearance' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-8 rounded-2xl border border-yellow-500 flex items-center justify-between group hover:shadow-lg hover:shadow-yellow-500/20 transition-all">
                <div>
                  <h3 className="text-3xl font-tech text-white mb-2">CLEARANCE LEVEL {clearanceLevel}</h3>
                  <p className="text-yellow-200 text-sm mb-4">
                    {clearanceLevel === 1 ? 'Standard Access. Upgrade for full Zenith capabilities.' :
                     clearanceLevel >= 10 ? 'Elite Access. Full system control.' :
                     'Advanced Access. Premium features unlocked.'}
                  </p>
                  <div className="flex gap-2">
                    {[...Array(clearanceLevel)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold animate-pulse">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-tech text-white mb-2">{credits}</div>
                  <div className="text-sm text-yellow-200 uppercase tracking-wider">Credits Available</div>
                  <button 
                    onClick={() => showNotification('Credit store coming soon!')}
                    className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 text-sm"
                  >
                    Add Credits
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`glass-card p-6 rounded-2xl relative overflow-hidden group transition-all ${
                  clearanceLevel >= 5 ? 'border-zenith-green shadow-lg shadow-zenith-green/50' : 'border-zenith-greenDim hover:border-zenith-green'
                }`}>
                  {clearanceLevel < 5 && (
                    <div className="absolute top-0 right-0 bg-zenith-green text-black text-xs font-bold px-3 py-1 rounded-bl-xl animate-bounce">
                      POPULAR
                    </div>
                  )}
                  {clearanceLevel >= 5 && (
                    <div className="absolute top-0 right-0 bg-zenith-green text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
                      ACTIVE
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">Level 5 Clearance</h3>
                  <div className="text-3xl font-tech text-zenith-green mb-4">$5<span className="text-sm text-zenith-dim">/mo</span></div>
                  <ul className="space-y-3 mb-6 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <i className={`fas ${clearanceLevel >= 5 ? 'fa-check text-zenith-green' : 'fa-lock text-gray-500'}`}></i>
                      <span className={clearanceLevel >= 5 ? 'text-white' : ''}>Blue Verified Badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className={`fas ${clearanceLevel >= 5 ? 'fa-check text-zenith-green' : 'fa-lock text-gray-500'}`}></i>
                      <span className={clearanceLevel >= 5 ? 'text-white' : ''}>Create 10 Groups</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className={`fas ${clearanceLevel >= 5 ? 'fa-check text-zenith-green' : 'fa-lock text-gray-500'}`}></i>
                      <span className={clearanceLevel >= 5 ? 'text-white' : ''}>4K Image Uploads</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className={`fas ${clearanceLevel >= 5 ? 'fa-check text-zenith-green' : 'fa-lock text-gray-500'}`}></i>
                      <span className={clearanceLevel >= 5 ? 'text-white' : ''}>Priority AI Processing</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => clearanceLevel < 5 && upgradeClearance(5)}
                    disabled={clearanceLevel >= 5 || isClearanceUpgrading || credits < 5}
                    className={`w-full py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      clearanceLevel >= 5 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : credits >= 5 
                          ? 'bg-zenith-green text-black hover:shadow-[0_0_20px_var(--z-primary)]' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {clearanceLevel >= 5 ? 'Already Active' : 
                     isClearanceUpgrading ? 'Upgrading...' :
                     credits < 5 ? 'Insufficient Credits' :
                     'Upgrade Access'}
                  </button>
                </div>

                <div className={`glass-card p-6 rounded-2xl relative overflow-hidden group transition-all ${
                  clearanceLevel >= 10 ? 'border-purple-500 shadow-lg shadow-purple-500/50' : 'border-purple-500/30 hover:border-purple-500'
                }`}>
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl animate-pulse">
                    ELITE
                  </div>
                  {clearanceLevel >= 10 && (
                    <div className="absolute top-0 left-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-br-xl">
                      MAX
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">Level 10 Clearance</h3>
                  <div className="text-3xl font-tech text-purple-400 mb-4">$15<span className="text-sm text-zenith-dim">/mo</span></div>
                  <ul className="space-y-3 mb-6 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <i className={`fas ${clearanceLevel >= 10 ? 'fa-check text-purple-400' : 'fa-lock text-gray-500'}`}></i>
                      <span className={clearanceLevel >= 10 ? 'text-white' : ''}>Gold Verified Badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className={`fas ${clearanceLevel >= 10 ? 'fa-check text-purple-400' : 'fa-lock text-gray-500'}`}></i>
                      <span className={clearanceLevel >= 10 ? 'text-white' : ''}>Unlimited Encrypted Groups</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className={`fas ${clearanceLevel >= 10 ? 'fa-check text-purple-400' : 'fa-lock text-gray-500'}`}></i>
                      <span className={clearanceLevel >= 10 ? 'text-white' : ''}>Marketplace Seller Access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className={`fas ${clearanceLevel >= 10 ? 'fa-check text-purple-400' : 'fa-lock text-gray-500'}`}></i>
                      <span className={clearanceLevel >= 10 ? 'text-white' : ''}>Dev Tools & API Keys</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => clearanceLevel < 10 && upgradeClearance(10)}
                    disabled={clearanceLevel >= 10 || isClearanceUpgrading || credits < 15}
                    className={`w-full py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      clearanceLevel >= 10 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : credits >= 15 
                          ? 'bg-purple-600 text-white hover:shadow-[0_0_20px_purple]' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {clearanceLevel >= 10 ? 'Maximum Level' : 
                     isClearanceUpgrading ? 'Upgrading...' :
                     credits < 15 ? 'Insufficient Credits' :
                     'Request Clearance'}
                  </button>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 group hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-3xl group-hover:animate-spin">
                  <i className="fas fa-store"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Digital Asset Marketplace</h3>
                  <p className="text-zenith-dim text-sm">
                    Sell your code snippets, themes, and educational courses. Zenith takes a small commission to maintain the core servers.
                  </p>
                  <div className="mt-3 flex gap-4">
                    <div className="text-sm">
                      <span className="text-zenith-green font-bold">250+</span>
                      <span className="text-zenith-dim ml-1">Active Sellers</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-blue-400 font-bold">1.2K</span>
                      <span className="text-zenith-dim ml-1">Products Listed</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => showNotification('Marketplace requires Level 5 clearance')}
                  className="px-6 py-3 border border-blue-500 text-blue-400 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105"
                >
                  Open Market
                </button>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-white mb-4">Clearance Benefits Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { level: '1-2', name: 'Basic', features: ['Standard Access', 'Community Features'] },
                    { level: '3-5', name: 'Advanced', features: ['Premium Themes', 'Advanced Privacy'] },
                    { level: '6-10', name: 'Elite', features: ['API Access', 'Marketplace', 'Dev Tools'] }
                  ].map((tier) => (
                    <div key={tier.level} className="p-4 bg-black/20 rounded-lg border border-zenith-greenDim">
                      <div className="text-zenith-green font-bold mb-2">Level {tier.level}</div>
                      <div className="text-white font-bold mb-2">{tier.name}</div>
                      <ul className="text-xs text-zenith-dim space-y-1">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <i className="fas fa-chevron-right text-zenith-green text-xs"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
