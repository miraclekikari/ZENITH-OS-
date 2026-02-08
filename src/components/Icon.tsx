import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { iconMap } from '../lib/iconMap';

interface IconProps {
  className?: string;
  icon: string;
  spin?: boolean;
}

const Icon: React.FC<IconProps> = ({ className = '', icon, spin = false }) => {
  const iconData = iconMap[icon as keyof typeof iconMap];
  
  if (!iconData) {
    console.warn(`Icon "${icon}" not found in iconMap`);
    return <i className={`fas ${icon} ${className}`}></i>;
  }

  return (
    <FontAwesomeIcon 
      icon={iconData} 
      className={className}
      spin={spin}
    />
  );
};

export default Icon;
