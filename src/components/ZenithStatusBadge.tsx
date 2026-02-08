import React, { useState, useEffect } from 'react';
import { UserStatus, UserStatusData, getUserStatus, startStatusSync } from '../lib/zenithService';
import { DEFAULT_USER_ID } from '../lib/constants';

interface ZenithStatusBadgeProps {
  userId?: string;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ZenithStatusBadge: React.FC<ZenithStatusBadgeProps> = ({
  userId = DEFAULT_USER_ID,
  showLabel = true,
  size = 'medium'
}) => {
  const [statusData, setStatusData] = useState<UserStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  const sizeClasses = {
    small: 'w-2 h-2 text-xs',
    medium: 'w-3 h-3 text-sm',
    large: 'w-4 h-4 text-base'
  };

  const statusConfig = {
    online: {
      color: 'bg-green-500',
      label: 'Online',
      icon: '🟢',
      description: 'Actif maintenant'
    },
    away: {
      color: 'bg-yellow-500',
      label: 'Away',
      icon: '🟡',
      description: 'Absent temporairement'
    },
    deep_sleep: {
      color: 'bg-purple-500',
      label: 'Deep Sleep',
      icon: '🔮',
      description: 'Mode veille profond'
    },
    offline: {
      color: 'bg-gray-500',
      label: 'Offline',
      icon: '⚫',
      description: 'Hors ligne'
    }
  };

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const { data } = await getUserStatus(userId as any);
        setStatusData(data);
      } catch (error) {
        console.error('Erreur chargement statut:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStatus();

    // Démarrer la synchronisation automatique
    const interval = startStatusSync(userId as any);
    
    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className={`${sizeClasses[size]} bg-gray-400 rounded-full animate-pulse`}></div>
        {showLabel && <span className="text-xs text-gray-500">Chargement...</span>}
      </div>
    );
  }

  const currentStatus = statusData?.status || 'offline';
  const config = statusConfig[currentStatus as keyof typeof statusConfig];

  return (
    <div className="flex items-center gap-2 group relative">
      <div className="relative">
        <div className={`${sizeClasses[size]} ${config.color} rounded-full animate-pulse`}></div>
        {currentStatus === 'online' && (
          <div className={`absolute inset-0 ${config.color} rounded-full animate-ping opacity-75`}></div>
        )}
      </div>
      
      {showLabel && (
        <span className="text-xs font-mono text-zenith-dim group-hover:text-white transition-colors">
          {config.label}
        </span>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-black/90 border border-zenith-green rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        <div className="flex items-center gap-1">
          <span>{config.icon}</span>
          <span>{config.description}</span>
        </div>
        {statusData && (
          <div className="text-[10px] text-zenith-dim mt-1">
            Dernière activité: {new Date(statusData.last_seen).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ZenithStatusBadge;
