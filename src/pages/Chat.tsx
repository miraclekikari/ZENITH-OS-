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
    setDrawerOpen(false);
  };

  return (
    <div className="flex h-[100dvh] md:h-screen text-white bg-[#1e1f22] antialiased">
      {/* Drawer for Mobile */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <ServersBar />
        <ChannelsBar setActiveChannelId={handleChannelSelect} activeChannelId={activeChannelId} />
      </Drawer>

      {/* Col 1: Servers (hidden on mobile) */}
      <div className="hidden md:flex">
        <ServersBar />
      </div>

      {/* Col 2: Channels (hidden on mobile) */}
      <div className="hidden md:flex">
        <ChannelsBar setActiveChannelId={handleChannelSelect} activeChannelId={activeChannelId} />
      </div>

      {/* Col 3: Chat Area */}
      <ChatArea channelId={activeChannelId} onMenuClick={() => setDrawerOpen(true)} />

      {/* Col 4: Members (hidden on mobile & tablet) */}
      <div className="hidden lg:flex">
        <MembersList channelId={activeChannelId} />
      </div>
    </div>
  );
};

export default Chat;
