import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DB } from '../services/storageService';

// Thèmes avancés avec gradients et animations
export const THEMES = {
  LIGHT: {
    '--z-bg': '#ffffff',
    '--z-surface': '#f0f2f5',
    '--z-glass': 'rgba(255, 255, 255, 0.7)',
    '--z-primary': '#007bff',
    '--z-primary-dim': 'rgba(0, 123, 255, 0.1)',
    '--z-text': '#000000',
    '--z-gradient': 'linear-gradient(135deg, #007bff, #0056b3)',
    '--z-shadow': '0 0 20px rgba(0, 123, 255, 0.3)',
    '--animation-speed': '0.3s'
  },
  DARK: {
    '--z-bg': '#121212',
    '--z-surface': '#1e1e1e',
    '--z-glass': 'rgba(30, 30, 30, 0.7)',
    '--z-primary': '#bb86fc',
    '--z-primary-dim': 'rgba(187, 134, 252, 0.1)',
    '--z-text': '#ffffff',
    '--z-gradient': 'linear-gradient(135deg, #bb86fc, #3700b3)',
    '--z-shadow': '0 0 20px rgba(187, 134, 252, 0.3)',
    '--animation-speed': '0.3s'
  },
  ZENITH_DEFAULT: {
    '--z-bg': '#05070a',
    '--z-surface': '#0a0e14',
    '--z-glass': 'rgba(13, 17, 23, 0.7)',
    '--z-primary': '#00ff88',
    '--z-primary-dim': 'rgba(0, 255, 136, 0.15)',
    '--z-text': '#e6edf3',
    '--z-gradient': 'linear-gradient(135deg, #00ff88, #00ccff)',
    '--z-shadow': '0 0 20px rgba(0, 255, 136, 0.5)',
    '--animation-speed': '0.3s'
  },
  CYBER_PUNK: {
    '--z-bg': '#0b0014',
    '--z-surface': '#1a0024',
    '--z-glass': 'rgba(255, 0, 150, 0.1)',
    '--z-primary': '#ff0099',
    '--z-primary-dim': 'rgba(255, 0, 150, 0.2)',
    '--z-text': '#ffccf2',
    '--z-gradient': 'linear-gradient(135deg, #ff0099, #ffcc00)',
    '--z-shadow': '0 0 30px rgba(255, 0, 150, 0.7)',
    '--animation-speed': '0.2s'
  },
  ROYAL_BLUE: {
    '--z-bg': '#020b1c',
    '--z-surface': '#05142b',
    '--z-glass': 'rgba(0, 150, 255, 0.1)',
    '--z-primary': '#00aaff',
    '--z-primary-dim': 'rgba(0, 170, 255, 0.2)',
    '--z-text': '#e0f0ff',
    '--z-gradient': 'linear-gradient(135deg, #00aaff, #0066ff)',
    '--z-shadow': '0 0 25px rgba(0, 170, 255, 0.6)',
    '--animation-speed': '0.4s'
  },
  CRIMSON_OPS: {
    '--z-bg': '#1a0505',
    '--z-surface': '#2b0a0a',
    '--z-glass': 'rgba(255, 50, 50, 0.1)',
    '--z-primary': '#ff3333',
    '--z-primary-dim': 'rgba(255, 50, 50, 0.2)',
    '--z-text': '#ffe0e0',
    '--z-gradient': 'linear-gradient(135deg, #ff3333, #ff6633)',
    '--z-shadow': '0 0 35px rgba(255, 51, 51, 0.8)',
    '--animation-speed': '0.25s'
  },
  NEON_PURPLE: {
    '--z-bg': '#0d0015',
    '--z-surface': '#1a0029',
    '--z-glass': 'rgba(150, 0, 255, 0.1)',
    '--z-primary': '#9600ff',
    '--z-primary-dim': 'rgba(150, 0, 255, 0.2)',
    '--z-text': '#f0e0ff',
    '--z-gradient': 'linear-gradient(135deg, #9600ff, #ff00ff)',
    '--z-shadow': '0 0 40px rgba(150, 0, 255, 0.9)',
    '--animation-speed': '0.35s'
  },
  MATRIX_GREEN: {
    '--z-bg': '#000500',
    '--z-surface': '#001000',
    '--z-glass': 'rgba(0, 255, 0, 0.05)',
    '--z-primary': '#00ff00',
    '--z-primary-dim': 'rgba(0, 255, 0, 0.1)',
    '--z-text': '#00ff00',
    '--z-gradient': 'linear-gradient(135deg, #00ff00, #00aa00)',
    '--z-shadow': '0 0 30px rgba(0, 255, 0, 0.7)',
    '--animation-speed': '0.15s'
  },
  SOLAR_FLARE: {
    '--z-bg': '#1a0800',
    '--z-surface': '#2d1500',
    '--z-glass': 'rgba(255, 150, 0, 0.1)',
    '--z-primary': '#ff9600',
    '--z-primary-dim': 'rgba(255, 150, 0, 0.2)',
    '--z-text': '#ffe0cc',
    '--z-gradient': 'linear-gradient(135deg, #ff9600, #ffcc00)',
    '--z-shadow': '0 0 45px rgba(255, 150, 0, 0.8)',
    '--animation-speed': '0.3s'
  },
  ARCTIC_FROST: {
    '--z-bg': '#001522',
    '--z-surface': '#002233',
    '--z-glass': 'rgba(0, 200, 255, 0.08)',
    '--z-primary': '#00c8ff',
    '--z-primary-dim': 'rgba(0, 200, 255, 0.15)',
    '--z-text': '#e0f7ff',
    '--z-gradient': 'linear-gradient(135deg, #00c8ff, #0088ff)',
    '--z-shadow': '0 0 35px rgba(0, 200, 255, 0.7)',
    '--animation-speed': '0.45s'
  }
};

const ThemeContext = createContext<any>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeSettings {
  autoSwitch: boolean;
  timeBased: boolean;
  customColors: boolean;
  animations: boolean;
  particles: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(THEMES.ZENITH_DEFAULT);
  const [currentThemeName, setCurrentThemeName] = useState<keyof typeof THEMES>('ZENITH_DEFAULT');
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    autoSwitch: false,
    timeBased: false,
    customColors: true,
    animations: true,
    particles: true
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [customTheme, setCustomTheme] = useState({});

  // Charger les préférences sauvegardées
  useEffect(() => {
    const saved = DB.getTheme();
    if (saved) {
      setCurrentTheme(saved);
    }
    const savedSettings = DB.getThemeSettings();
    if (savedSettings) {
      setThemeSettings(savedSettings);
    }
  }, []);

  // Appliquer le thème avec animation fluide
  useEffect(() => {
    if (!themeSettings.animations) {
      applyTheme(currentTheme);
      return;
    }

    setIsTransitioning(true);
    const timer = setTimeout(() => {
      applyTheme(currentTheme);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [currentTheme, themeSettings.animations]);

  // Auto-switch time-based
  useEffect(() => {
    if (!themeSettings.timeBased) return;

    const checkTimeBasedTheme = () => {
      const hour = new Date().getHours();
      let targetTheme;
      
      if (hour >= 6 && hour < 12) {
        targetTheme = THEMES.SOLAR_FLARE;
      } else if (hour >= 12 && hour < 18) {
        targetTheme = THEMES.ZENITH_DEFAULT;
      } else if (hour >= 18 && hour < 22) {
        targetTheme = THEMES.ROYAL_BLUE;
      } else {
        targetTheme = THEMES.MATRIX_GREEN;
      }
      
      setCurrentTheme(targetTheme);
    };
    
    // Vérifier immédiatement, puis chaque minute
    checkTimeBasedTheme();
    const interval = setInterval(checkTimeBasedTheme, 60000); // Chaque minute
    
    return () => {
      clearInterval(interval);
    };
  }, [themeSettings.timeBased]);

  const applyTheme = useCallback((theme: any) => {
    const root = document.documentElement;
    const finalTheme = { ...theme, ...customTheme };
    
    // Appliquer toutes les variables CSS au niveau racine
    Object.entries(finalTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
    
    // Appliquer le thème au body pour une couverture complète
    root.className = `theme-${currentThemeName}`;
    document.body.className = `theme-${currentThemeName} ${themeSettings.animations ? 'animations-enabled' : ''}`;
    
    // Animation de transition
    if (themeSettings.animations) {
      root.style.setProperty('--theme-transition', 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)');
    }
    
    // Sauvegarder
    DB.saveTheme(theme);
    DB.saveThemeSettings(themeSettings);
  }, [customTheme, themeSettings.animations, currentThemeName]);

  const changeTheme = useCallback((themeName: keyof typeof THEMES) => {
    setCurrentTheme(THEMES[themeName]);
    setCurrentThemeName(themeName);
    
    if (themeSettings.animations) {
      const audio = new Audio();
      audio.volume = 0.1;
    }
  }, [themeSettings.animations]);

  const updateCustomColor = useCallback((key: string, value: string) => {
    setCustomTheme(prev => ({ ...prev, [key]: value }));
    setCurrentTheme(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ThemeSettings>) => {
    setThemeSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const randomTheme = useCallback(() => {
    const themes = Object.keys(THEMES) as (keyof typeof THEMES)[];
    const randomIndex = Math.floor(Math.random() * themes.length);
    changeTheme(themes[randomIndex]);
  }, [changeTheme]);

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      changeTheme, 
      updateCustomColor,
      themeSettings,
      updateSettings,
      isTransitioning,
      randomTheme,
      availableThemes: Object.keys(THEMES)
    }}>
      <div className={`theme-transition-wrapper ${isTransitioning ? 'theme-transitioning' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
