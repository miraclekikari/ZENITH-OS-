import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faSmile, 
  faHeart, 
  faGift, 
  faShare, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { Message } from '../types/chat';
import SupabaseChatService from '../services/supabaseChatService';
import { getUser } from '../services/storageService';

interface ChatProps {
  isLive?: boolean;
}

const Chat: React.FC<ChatProps> = ({ isLive = false }) => {
  const { id: liveId } = useParams<{ id: string }>();
  const chatService = SupabaseChatService;
  const currentUser = getUser() || { id: 'guest', username: 'Guest' }; // Guest user

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!liveId) return;

    const fetchMessages = async () => {
      try {
        const initialMessages = await chatService.getMessages(liveId, 100);
        setMessages(initialMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    fetchMessages();

    const subscription = chatService.subscribeToChannel(liveId, {
      onNewMessage: (message) => {
        setMessages(prev => [...prev, message]);
      },
      onMessageUpdated: () => {},
      onMessageDeleted: () => {},
      onUserJoined: () => {},
      onUserLeft: () => {},
    });

    return () => {
      if (subscription) {
        chatService.unsubscribeFromChannel(liveId);
      }
    };
  }, [liveId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !liveId) return;

    try {
      await chatService.sendMessage(liveId, inputText.trim());
      setInputText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLive) {
    return (
      <div className="fixed inset-0 bg-black text-white flex flex-col">
        <div className="absolute inset-0 z-0">
          <video 
            className="w-full h-full object-cover" 
            src={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`} 
            autoPlay 
            loop 
            muted 
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="https://picsum.photos/seed/live/100/100" alt="Streamer" className="w-10 h-10 rounded-full border-2 border-red-500" />
            <div>
              <h3 className="font-bold">Live Streamer</h3>
              <span className="text-sm text-gray-300">1.2M viewers</span>
            </div>
          </div>
          <button onClick={() => window.history.back()} className="p-2 bg-white/20 rounded-full">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="absolute bottom-20 left-4 right-4 z-10 max-h-60 overflow-y-auto space-y-2 no-scrollbar">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-2 text-shadow-md">
              <img src={message.senderAvatar} alt={message.senderName} className="w-8 h-8 rounded-full" />
              <div>
                <span className="font-bold text-sm mr-2">{message.senderName}</span>
                <span className="text-sm">{message.text}</span>
              </div>
            </div>
          ))}
           <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Send a message..."
              className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-full focus:outline-none placeholder-white/70"
            />
            <FontAwesomeIcon icon={faSmile} className="absolute left-3 top-2.5 text-white/70" />
          </div>
          <button 
            onClick={handleSendMessage} 
            className="p-3 bg-cyan-500 rounded-full text-black disabled:bg-gray-500"
            disabled={!inputText.trim()}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-6">
            <button className="flex flex-col items-center gap-1 text-white">
                <FontAwesomeIcon icon={faHeart} className="text-4xl drop-shadow-lg"/>
                <span className="text-xs font-bold">1.2M</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-white">
                <FontAwesomeIcon icon={faGift} className="text-4xl drop-shadow-lg"/>
                 <span className="text-xs font-bold">84K</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-white">
                <FontAwesomeIcon icon={faShare} className="text-4xl drop-shadow-lg"/>
                <span className="text-xs font-bold">22K</span>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zenith-bg text-zenith-text">
        <div className="flex-1 flex items-center justify-center">
            <h1 className="text-2xl">Select a channel to get started.</h1>
        </div>
    </div>
  );
};

export default Chat;
