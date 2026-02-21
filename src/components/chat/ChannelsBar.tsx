import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Volume2, ChevronDown, Plus, Settings } from 'lucide-react';

export type Channel = {
  id: number;
  name: string;
  category: string;
};

interface ChannelsBarProps {
  activeChannelId: number | null;
  setActiveChannelId: (id: number) => void;
}

// Mock channels as fallback
const mockChannels: Channel[] = [
  { id: 1, name: 'general', category: 'CORE' },
  { id: 2, name: 'announcements', category: 'CORE' },
  { id: 3, name: 'rules', category: 'CORE' },
  { id: 4, name: 'lounge', category: 'CHILL' },
  { id: 5, name: 'memes', category: 'CHILL' },
  { id: 6, name: 'music-share', category: 'MEDIA' },
  { id: 7, name: 'art-gallery', category: 'MEDIA' },
  { id: 8, name: 'screenshots', category: 'MEDIA' },
  { id: 9, name: 'voice-lobby', category: 'VOICE' },
];

const ChannelsBar: React.FC<ChannelsBarProps> = ({ activeChannelId, setActiveChannelId }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchChannels = async () => {
      const { data, error } = await supabase.from('channels').select('id, name, category');
      if (error || !data || data.length === 0) {
        setChannels(mockChannels);
        if (!activeChannelId) setActiveChannelId(mockChannels[0].id);
      } else {
        setChannels(data as Channel[]);
        if (!activeChannelId && data.length > 0) {
          setActiveChannelId(data[0].id);
        }
      }
    };
    fetchChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActiveChannelId]);

  const groupedChannels = channels.reduce((acc, channel) => {
    const category = channel.category || 'UNCATEGORIZED';
    if (!acc[category]) acc[category] = [];
    acc[category].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const isVoiceChannel = (name: string) => name.includes('voice') || name.includes('music');

  return (
    <div className="w-[240px] bg-[#111111] flex-shrink-0 flex flex-col border-r border-white/[0.04]" aria-label="Channels bar">
      {/* Server Header */}
      <header className="h-[48px] px-4 flex items-center justify-between border-b border-white/[0.06] flex-shrink-0 cursor-pointer hover:bg-white/[0.03] transition-colors">
        <h2 className="font-bold text-[15px] text-white tracking-wide truncate">Zenith HQ</h2>
        <ChevronDown size={16} className="text-white/40" />
      </header>

      {/* Channels List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-hide">
        {Object.entries(groupedChannels).map(([category, channelsInCategory]) => {
          const isCollapsed = collapsedCategories.has(category);
          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="flex items-center gap-1 w-full text-[11px] font-bold text-white/40 uppercase tracking-wider px-1 mb-1 hover:text-white/60 transition-colors"
              >
                <ChevronDown size={10} className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                {category}
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden space-y-[2px]"
                  >
                    {channelsInCategory.map(channel => {
                      const isActive = activeChannelId === channel.id;
                      const isVoice = isVoiceChannel(channel.name);
                      return (
                        <button
                          key={channel.id}
                          onClick={() => setActiveChannelId(channel.id)}
                          className={`w-full text-left py-1.5 px-2 rounded-md flex items-center gap-1.5 text-sm transition-all duration-150 group ${
                            isActive
                              ? 'bg-white/[0.08] text-white'
                              : 'text-white/30 hover:bg-white/[0.04] hover:text-white/60'
                          }`}
                        >
                          {isVoice ? (
                            <Volume2 size={16} className={`flex-shrink-0 ${isActive ? 'text-white/70' : 'text-white/20'}`} />
                          ) : (
                            <Hash size={16} className={`flex-shrink-0 ${isActive ? 'text-white/70' : 'text-white/20'}`} />
                          )}
                          <span className="truncate font-medium">{channel.name}</span>
                          {/* Add user button on hover */}
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus size={14} className="text-white/30 hover:text-white/60" />
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* User Panel at Bottom */}
      <div className="h-[52px] bg-[#0c0c0c] border-t border-white/[0.06] flex items-center justify-between px-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-600" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0c0c0c]" />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-bold text-white">Zenith User</p>
            <p className="text-[10px] text-emerald-400">Online</p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-md flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChannelsBar;
