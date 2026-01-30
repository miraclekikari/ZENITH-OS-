import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB } from '../services/storageService';

export const THEMES = {
  ZENITH_DEFAULT: {
    '--z-bg': '#05070a',
    '--z-surface': '#0a0e14',
    '--z-glass': 'rgba(13, 17, 23, 0.7)',
    '--z-primary': '#00ff88',
    '--z-primary-dim': 'rgba(0, 255, 136, 0.15)',
    '--z-text': '#e6edf3',
  },
  CYBER_PUNK: {
    '--z-bg': '#0b0014',
    '--z-surface': '#1a0024',
    '--z-glass': 'rgba(255, 0, 150, 0.1)',
    '--z-primary': '#ff0099',
    '--z-primary-dim': 'rgba(255, 0, 150, 0.2)',
    '--z-text': '#ffccf2',
  },
  ROYAL_BLUE: {
    '--z-bg': '#020b1c',
    '--z-surface': '#05142b',
    '--z-glass': 'rgba(0, 150, 255, 0.1)',
    '--z-primary': '#00aaff',
    '--z-primary-dim': 'rgba(0, 170, 255, 0.2)',
    '--z-text': '#e0f0ff',
  },
  CRIMSON_OPS: {
    '--z-bg': '#1a0505',
    '--z-surface': '#2b0a0a',
    '--z-glass': 'rgba(255, 50, 50, 0.1)',
    '--z-primary': '#ff3333',
    '--z-primary-dim': 'rgba(255, 50, 50, 0.2)',
    '--z-text': '#ffe0e0',
  }
};

const ThemeContext = createContext<any>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(THEMES.ZENITH_DEFAULT);

  useEffect(() => {
    const saved = DB.getTheme();
    if (saved) setCurrentTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
    DB.saveTheme(currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeName: keyof typeof THEMES) => {
    setCurrentTheme(THEMES[themeName]);
  };

  const updateCustomColor = (key: string, value: string) => {
    setCurrentTheme((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, updateCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);