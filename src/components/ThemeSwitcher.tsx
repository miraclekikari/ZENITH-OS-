import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { changeTheme, availableThemes } = useTheme();

  return (
    <div className="p-4 bg-zenith-surface rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-zenith-text">Select Theme</h3>
      <select 
        onChange={(e) => changeTheme(e.target.value as any)}
        className="w-full p-2 rounded bg-zenith-bg text-zenith-text border border-zenith-primary-dim"
      >
        {availableThemes.map((theme: string) => (
          <option key={theme} value={theme}>{theme}</option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSwitcher;
