import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Menu, Search, PlusCircle, Gift, Smile, Pin, Users } from 'lucide-react';
import {
  Message,
  Profile,
  getMessages,
  getChannelDetails,
  sendMessage,
  uploadAttachment,
  subscribeToChannel,
} from '../../services/chatService';

interface ChatAreaProps {
  channelId: number | null;
  onMenuClick: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ channelId, onMenuClick }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [channelName, setChannelName] = useState<string>('select a channel');
  const [loading, setLoading] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!channelId) {
      setMessages([]);
      setChannelName('select a channel');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [channelData, messagesData] = await Promise.all([
          getChannelDetails(channelId),
          getMessages(channelId),
        ]);
        setChannelName(channelData?.name || 'general');
        setMessages(messagesData);
      } catch (error) {
        console.error("Failed to fetch channel data:", error);
        setMessages([]);
        setChannelName('Error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const unsubscribe = subscribeToChannel(channelId, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => unsubscribe();
  }, [channelId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !channelId) return;
    try {
      await sendMessage(channelId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error("Message send failed:", error);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !channelId) return;
    const file = e.target.files[0];
    try {
      await uploadAttachment(channelId, file);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const renderMessageContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const isImageUrl = (url: string) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url);

    return content.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        if (isImageUrl(part)) {
          return <img key={index} src={part} alt="Uploaded content" className="max-w-xs rounded-lg mt-2" crossOrigin="anonymous" />;
        }
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{part}</a>;
      }
      return part;
    });
  };

  const getRoleColor = (role?: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'text-emerald-400';
      case 'HELPER': return 'text-cyan-400';
      default: return 'text-white/90';
    }
  };

  return (
    <div className="flex-1 bg-[#1e1f22] flex flex-col min-w-0" aria-label="Chat area">
        <header className="h-[48px] px-4 flex items-center justify-between border-b border-white/[0.06] flex-shrink-0">
            <div className="flex items-center gap-2">
                <button onClick={onMenuClick} className="md:hidden text-white/50 hover:text-white mr-1"><Menu size={20} /></button>
                <Hash size={20} className="text-white/30" />
                <span className="font-bold text-white text-[15px]">{channelName}</span>
            </div>
            <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-md flex items-center justify-center text-white/40 hover:text-white/70"><Pin size={18} /></button>
                <button className="w-8 h-8 rounded-md flex items-center justify-center text-white/40 hover:text-white/70"><Users size={18} /></button>
                <button onClick={() => setShowSearch(!showSearch)} className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${showSearch ? 'text-white bg-white/10' : 'text-white/40 hover:text-white/70'}`}><Search size={18} /></button>
            </div>
        </header>

        <AnimatePresence>
            {showSearch && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-b border-white/[0.06] overflow-hidden">
                    <div className="px-4 py-2">
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search messages..." className="w-full bg-[#111] rounded-md px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" autoFocus />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto px-4 py-2">
            {loading ? (
                <div className="flex items-center justify-center h-full"><div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>
            ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-white/30">
                    <div>
                        <Hash size={40} className="mx-auto mb-2"/>
                        <h3 className="font-bold text-lg text-white/80">Welcome to #{channelName}!</h3>
                        <p className="text-sm">This is the start of the channel. No messages yet.</p>
                    </div>
                </div>
            ) : (
                messages.map((msg, index) => {
                    const prevMsg = messages[index - 1];
                    const isSameAuthor = prevMsg && prevMsg.author_id === msg.author_id;
                    const isWithinTime = prevMsg && new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() < 5 * 60 * 1000;
                    const showAuthor = !isSameAuthor || !isWithinTime;

                    return (
                        <div key={msg.id} className={`flex items-start hover:bg-white/[0.02] px-2 py-0.5 rounded-md group ${showAuthor ? 'mt-4' : ''}`}>
                            {showAuthor ? (
                                <img src={msg.profiles?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=default'} alt="avatar" className="w-10 h-10 rounded-full mr-3 mt-0.5 flex-shrink-0" crossOrigin="anonymous" />
                            ) : (
                                <div className="w-10 mr-3 flex items-center justify-center"><span className="text-[10px] text-transparent group-hover:text-white/20 leading-none">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                            )}
                            <div className="min-w-0 flex-1">
                                {showAuthor && (
                                    <div className="flex items-baseline gap-2 mb-0.5">
                                        <span className={`font-semibold text-sm ${getRoleColor(msg.profiles?.role)}`}>{msg.profiles?.username || 'Unknown'}</span>
                                        <span className="text-[11px] text-white/20">{new Date(msg.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                )}
                                <div className="text-sm text-white/80 break-words leading-relaxed">{renderMessageContent(msg.content)}</div>
                            </div>
                        </div>
                    );
                }))}
            <div ref={messagesEndRef} />
        </main>

        <footer className="px-4 pb-4 pt-1 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="bg-[#2b2d31] rounded-lg flex items-center px-4">
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"><PlusCircle size={22} /></button>
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={`Message #${channelName}`} className="flex-1 bg-transparent text-white text-sm placeholder-white/20 focus:outline-none mx-3 py-3" />
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button type="button" className="text-white/30 hover:text-white/60 transition-colors"><Gift size={20} /></button>
                    <button type="button" className="text-white/30 hover:text-white/60 transition-colors"><Smile size={20} /></button>
                </div>
            </form>
        </footer>
    </div>
  );
};

export default ChatArea;
