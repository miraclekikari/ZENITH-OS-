import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Icon from '../Icon';

// Type definition aligned with the 'channels' table
export type Channel = {
  id: number;
  name: string;
  category: string;
};

interface ChannelsBarProps {
  activeChannelId: number | null;
  setActiveChannelId: (id: number) => void;
}

const ChannelsBar: React.FC<ChannelsBarProps> = ({ activeChannelId, setActiveChannelId }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      const { data, error } = await supabase.from('channels').select('id, name, category');
      if (error) {
        console.error('Error fetching channels:', error);
        setError('Could not fetch channels.');
      } else if (data) {
        setChannels(data as Channel[]);
        // Set the first channel as active by default if none is selected
        if (!activeChannelId && data.length > 0) {
          setActiveChannelId(data[0].id);
        }
      }
    };
    fetchChannels();
  // We only want to run this on initial load and when the user changes server, 
  // but since we don't have servers yet, we'll leave the dependency array empty.
  // Adding activeChannelId here would cause a re-fetch loop if the first channel is set.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActiveChannelId]);

  const groupedChannels = channels.reduce((acc, channel) => {
    const category = channel.category || 'UNCATEGORIZED';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);

  return (
    <div className="w-[240px] bg-[#2f3136] flex-shrink-0 flex flex-col" aria-label="Channels bar">
       <header className="h-[48px] px-4 font-bold text-lg flex items-center border-b-2 border-black/20 shadow-sm">
         ZENITH OS
       </header>
       <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {error && <div className="text-red-500 p-2">{error}</div>}
        {Object.entries(groupedChannels).map(([category, channelsInCategory]) => (
          <div key={category}>
            <h2 className="text-xs font-bold text-gray-400 uppercase p-1 mb-1">{category}</h2>
            <div className="space-y-1">
              {channelsInCategory.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`w-full text-left py-1 px-2 rounded flex items-center transition-colors duration-150 ${activeChannelId === channel.id ? 'bg-gray-500/50 text-white' : 'text-gray-400 hover:bg-gray-500/20 hover:text-gray-300'}`}
                >
                  <Icon icon="hashtag" className="w-5 h-5 mr-1.5 text-gray-500" />
                  <span className="font-medium">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
       </nav>
    </div>
  );
};

export default ChannelsBar;
