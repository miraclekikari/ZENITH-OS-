import React, { useState } from 'react';
import ServersBar from '../components/chat/ServersBar';
import ChannelsBar from '../components/chat/ChannelsBar';
import ChatArea from '../components/chat/ChatArea';
import MembersList from '../components/chat/MembersList';
import Drawer from '../components/chat/Drawer';

const Chat: React.FC = () => {
  const [activeChannelId, setActiveChannelId] = useState<number | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleChannelSelect = (id: number) => {
    setActiveChannelId(id);
    setDrawerOpen(false); // Close drawer on channel selection
  }

  return (
    <div className="flex h-screen text-white bg-gray-800 antialiased">
      {/* Drawer for Mobile, containing both sidebars */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
          <ServersBar />
          <ChannelsBar 
              setActiveChannelId={handleChannelSelect} 
              activeChannelId={activeChannelId} 
          />
      </Drawer>

      {/* Column 1: Servers Bar (hidden on mobile) */}
      <div className="hidden md:flex">
        <ServersBar />
      </div>

      {/* Column 2: Channels Bar (hidden on mobile) */}
      <div className="hidden md:flex">
        <ChannelsBar 
            setActiveChannelId={handleChannelSelect} 
            activeChannelId={activeChannelId} 
        />
      </div>

      {/* Column 3: Chat Area (takes full width on mobile) */}
      <ChatArea 
        channelId={activeChannelId}
        onMenuClick={() => setDrawerOpen(true)}
      />

      {/* Column 4: Members List (hidden on mobile) */}
      <div className="hidden md:flex">
        <MembersList channelId={activeChannelId} />
      </div>
    </div>
  );
};

export default Chat;
