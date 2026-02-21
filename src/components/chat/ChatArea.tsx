import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Icon from '../Icon';

// Types aligned with Supabase tables
export type Profile = {
  id: string;
  username: string;
  avatar_url: string;
  status: 'online' | 'offline';
  role: string;
};

export type Message = {
  id: number;
  created_at: string;
  content: string;
  author_id: string;
  channel_id: number;
  profiles: Profile | null;
};

interface ChatAreaProps {
  channelId: number | null;
  onMenuClick: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ channelId, onMenuClick }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [channelName, setChannelName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!channelId) {
      setMessages([]);
      setChannelName('Select a channel');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: channelData, error: channelError } = await supabase.from('channels').select('name').eq('id', channelId).single();
        if (channelError) throw channelError;
        setChannelName(channelData.name);

        const { data: messagesData, error: messagesError } = await supabase.from('messages').select('*, profiles(*)').eq('channel_id', channelId).order('created_at', { ascending: true });
        if (messagesError) throw messagesError;
        setMessages(messagesData as Message[]);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(`Failed to load chat: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelId]);

  useEffect(() => {
    if (!channelId) return;

    const channelSubscription = supabase
      .channel(`room:${channelId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` },
        async (payload) => {
          const newMessagePayload = payload.new as Omit<Message, 'profiles'>;
          const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', newMessagePayload.author_id).single();

          if (profileError) {
            console.error('Error fetching profile for new message:', profileError);
            setMessages(currentMessages => [...currentMessages, { ...newMessagePayload, profiles: null }]);
          } else {
            const fullMessage: Message = { ...newMessagePayload, profiles: profileData as Profile };
            setMessages(currentMessages => [...currentMessages, fullMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelSubscription);
    };
  }, [channelId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !channelId) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in to send a message.");
      return;
    }

    const content = newMessage.trim();
    setNewMessage('');

    const { error: insertError } = await supabase.from('messages').insert({ content, author_id: user.id, channel_id: channelId });

    if (insertError) {
      console.error('Error sending message:', insertError);
      setError('Failed to send message.');
      setNewMessage(content);
    }
  };

  return (
    <div className="flex-1 bg-[#36393f] flex flex-col" aria-label="Chat area">
      <header className="h-[48px] px-4 font-bold text-lg flex items-center border-b-2 border-black/20 shadow-sm text-white flex-shrink-0">
        <button onClick={onMenuClick} className="md:hidden mr-2 text-gray-300 hover:text-white">
            <Icon icon="menu" className="w-6 h-6" />
        </button>
        <Icon icon="hashtag" className="w-6 h-6 mr-2 text-gray-400" />
        <span>{channelName}</span>
      </header>

      <main ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* ... Message rendering logic from previous steps ... */}
         {!loading && !error && messages.map((msg, index) => {
          const previousMessage = messages[index - 1];
          const isSameAuthor = previousMessage && previousMessage.author_id === msg.author_id;
          const isWithinTimeframe = previousMessage && (new Date(msg.created_at).getTime() - new Date(previousMessage.created_at).getTime()) < 5 * 60 * 1000;
          const showAuthor = !isSameAuthor || !isWithinTimeframe;

          return (
            <div key={msg.id} className={`flex items-start hover:bg-black/10 px-2 py-1 rounded ${showAuthor ? 'mt-3' : ''}`}>
                {showAuthor ? (
                    <img src={msg.profiles?.avatar_url || 'https://via.placeholder.com/40'} alt="avatar" className="w-10 h-10 rounded-full mr-4 mt-1" />
                ) : (
                    <div className="w-10 mr-4 text-xs text-transparent hover:text-gray-500 text-center leading-loose">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                )}
                <div className="flex flex-col">
                    {showAuthor && (
                        <div className="flex items-baseline space-x-2">
                            <p className="font-bold text-green-400">{msg.profiles?.username || 'Unknown User'}</p>
                            <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</span>
                        </div>
                    )}
                    <p className="text-gray-200">{msg.content}</p>
                </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 pt-0 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="bg-[#40444b] rounded-lg px-4 flex items-center">
           <button type="button" className="text-gray-300 hover:text-white"><Icon icon="plus-circle" className="w-6 h-6" /></button>
           <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={channelId ? `Message #${channelName}` : 'Select a channel to start typing'}
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none mx-4 py-3"
            disabled={!channelId || loading}
          />
           <div className="flex space-x-3">
             <button type="button" className="text-gray-300 hover:text-white"><Icon icon="gift" className="w-6 h-6" /></button>
             <button type="button" className="text-gray-300 hover:text-white"><Icon icon="gif" className="w-6 h-6" /></button>
             <button type="button" className="text-gray-300 hover:text-white"><Icon icon="smile" className="w-6 h-6" /></button>
           </div>
        </form>
      </footer>
    </div>
  );
};

export default ChatArea;
