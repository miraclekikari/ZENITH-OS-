import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ProfileSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      searchProfiles();
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const searchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, is_verified')
        .ilike('username', `%${query}%`)
        .limit(5);

      if (error) throw error;
      setResults(data || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Erreur recherche profils:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (username: string) => {
    navigate(`/profile/${username}`);
    setQuery('');
    setIsOpen(false);
  };

  const getDefaultAvatar = (username: string) => {
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="bg-zenith-surface px-4 py-2 rounded-full border border-zenith-greenDim items-center gap-2 focus-within:border-zenith-green transition-colors flex">
        <i className="fas fa-search text-zenith-dim text-sm"></i>
        <input
          type="text"
          placeholder="Rechercher un profil..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all text-white placeholder-zenith-dim"
        />
        {loading && (
          <i className="fas fa-spinner fa-spin text-zenith-dim text-sm"></i>
        )}
      </div>

      {/* Résultats de recherche */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-zinc-950 border border-zenith-greenDim rounded-lg shadow-[0_0_20px_rgba(0,255,136,0.3)] z-50">
          {results.map((profile) => (
            <div
              key={profile.username}
              onClick={() => handleProfileClick(profile.username)}
              className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
            >
              <img
                src={profile.avatar_url || getDefaultAvatar(profile.username)}
                alt={profile.username}
                className="w-10 h-10 rounded-full object-cover bg-zinc-800"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">@{profile.username}</span>
                  {profile.is_verified && (
                    <i className="fas fa-check text-cyan-400 text-xs"></i>
                  )}
                </div>
                <div className="text-zenith-dim text-xs">
                  {profile.full_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSearch;
