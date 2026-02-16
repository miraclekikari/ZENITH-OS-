import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPlus, 
  faEllipsisH, 
  faPaperPlane, 
  faSmile, 
  faPaperclip,
  faPhone,
  faVideo,
  faUserPlus,
  faBell,
  faBellSlash,
  faThumbTack,
  faTrash,
  faEdit,
  faReply,
  faForward,
  faCheck,
  faCheckDouble,
  faClock,
  faBroadcastTower,
  faCog,
  faTimes,
  faVolumeUp,
  faVolumeMute
} from '@fortawesome/free-solid-svg-icons';
import { Message, Channel, ChatUser, TypingIndicator, SearchResult } from '../types/chat';
import SupabaseChatService from '../services/supabaseChatService';
import { DB } from '../services/storageService';
import EmojiPicker from '../components/EmojiPicker';
import CallControls from '../components/CallControls';
import GroupSettings from '../components/GroupSettings';
import ContactsModal from '../components/ContactsModal';
import { useNotificationSound } from '../hooks/useNotificationSound';
import { supabase } from '../lib/supabaseClient';

// Mock users for demonstration
const MOCK_USERS: ChatUser[] = [
  { id: 'u1', username: 'Commander', fullName: 'Commander Zenith', avatar: 'https://picsum.photos/seed/u1/200/200', status: 'online', bio: 'Admin', isVerified: true },
  { id: 'u2', username: 'CyberPilot', fullName: 'Cyber Pilot', avatar: 'https://picsum.photos/seed/u2/200/200', status: 'away', bio: 'Tech enthusiast', isVerified: false },
  { id: 'u3', username: 'NeuralLink', fullName: 'Neural Link', avatar: 'https://picsum.photos/seed/u3/200/200', status: 'offline', bio: 'AI researcher', isVerified: true },
  { id: 'u4', username: 'Quantum', fullName: 'Quantum User', avatar: 'https://picsum.photos/seed/u4/200/200', status: 'online', bio: 'Developer', isVerified: false },
];

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const chatService = SupabaseChatService;
  const currentUser = DB.getUser();
  
  // State
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showChannelMenu, setShowChannelMenu] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'private' | 'group' | 'channel'>('private');
  const [showCallControls, setShowCallControls] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState<Message[]>([]);
  const [isGlobalSearching, setIsGlobalSearching] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Notification sound hook
  const { playSound } = useNotificationSound({ enabled: soundEnabled, volume: 0.3 });

  // Initialize
  useEffect(() => {
    if (!currentUser) return;
    
    const initializeChat = async () => {
      try {
        // Create default channels if they don't exist
        await chatService.createDefaultChannels();
        
        // Load user's channels
        const userChannels = await chatService.getChannels(currentUser.id);
        setChannels(userChannels);
        
        // Select first channel if none selected
        if (userChannels.length > 0 && !activeChannel) {
          handleChannelSelect(userChannels[0]);
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };
    
    initializeChat();
    
    // Cleanup on unmount
    return () => {
      chatService.cleanup();
    };
  }, [currentUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Realtime subscription for active channel
  useEffect(() => {
    if (!activeChannel) return;
    
    chatService.subscribeToChannel(activeChannel.id, {
      onNewMessage: (message) => {
        setMessages(prev => [...prev, message]);
        // Play notification sound if message is not from current user
        if (message.senderId !== currentUser?.id) {
          playSound();
        }
      },
      onMessageUpdated: (message) => {
        setMessages(prev => prev.map(m => m.id === message.id ? message : m));
      },
      onMessageDeleted: (messageId) => {
        setMessages(prev => prev.filter(m => m.id !== messageId));
      },
      onUserJoined: (userId) => {
        console.log(`User ${userId} joined the channel`);
      },
      onUserLeft: (userId) => {
        console.log(`User ${userId} left the channel`);
      },
    });
    
    return () => {
      chatService.unsubscribeFromChannel(activeChannel.id);
    };
  }, [activeChannel?.id, currentUser?.id, playSound]);

  // Send message
  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChannel) return;
    
    try {
      await chatService.sendMessage(
        activeChannel.id,
        inputText.trim(),
        replyingTo?.id
      );
      
      setInputText('');
      setReplyingTo(null);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Channel selection
  const handleChannelSelect = useCallback(async (channel: Channel) => {
    setActiveChannel(channel);
    
    try {
      const channelMessages = await chatService.getMessages(channel.id, 100);
      setMessages(channelMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  }, []);

  // Create new channel
  const handleCreateChannel = async () => {
    if (!newChannelName.trim() || !currentUser) return;
    
    try {
      const newChannel = await chatService.createChannel({
        name: newChannelName.trim(),
        type: newChannelType,
        description: `${newChannelType} channel created by ${currentUser.username}`,
      });
      
      setChannels(prev => [newChannel, ...prev]);
      setNewChannelName('');
      setShowCreateChannel(false);
      handleChannelSelect(newChannel);
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Message actions
  const handleReply = (message: Message) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await chatService.deleteMessage(messageId);
      setSelectedMessage(null);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    // TODO: Implement reaction functionality
    console.log(`Add reaction ${emoji} to message ${messageId}`);
  };

  // Emoji and sticker handlers
  const handleEmojiSelect = (emoji: string) => {
    setInputText(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const handleStickerSelect = async (stickerUrl: string) => {
    if (!activeChannel) return;
    
    try {
      await chatService.sendMessage(activeChannel.id, `[STICKER]${stickerUrl}[/STICKER]`);
    } catch (error) {
      console.error('Failed to send sticker:', error);
    }
  };

  // Global search function
  const handleGlobalSearch = useCallback(async (query: string) => {
    setGlobalSearchQuery(query);
    
    if (query.length < 2) {
      setGlobalSearchResults([]);
      setIsGlobalSearching(false);
      return;
    }
    
    setIsGlobalSearching(true);
    try {
      // Search messages across all channels
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .ilike('text', `%${query}%`)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        const formattedResults = data.map(msg => ({
          id: msg.id,
          channelId: msg.channel_id,
          senderId: msg.sender_id,
          senderName: 'Unknown User',
          senderAvatar: 'https://picsum.photos/seed/unknown/100/100',
          text: msg.text,
          timestamp: msg.created_at,
          isEdited: msg.is_edited,
          isDeleted: msg.is_deleted,
          replyTo: msg.reply_to,
          isOwn: msg.sender_id === currentUser?.id,
          reactions: [],
          attachments: [],
        }));
        setGlobalSearchResults(formattedResults);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsGlobalSearching(false);
    }
  }, [currentUser?.id]);

  // Channel update handler
  const handleContactSelect = (contact: any) => {
    // Create or navigate to private channel with this contact
    const privateChannel: Channel = {
      id: `private_${contact.id}`,
      name: contact.full_name,
      type: 'private',
      description: contact.bio,
      avatar: contact.avatar_url,
      members: [contact.id],
      admins: [contact.id],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      createdAt: new Date().toISOString(),
      createdBy: contact.id
    };
    
    setChannels(prev => [privateChannel, ...prev]);
    handleChannelSelect(privateChannel);
  };

  const handleChannelUpdate = (updates: Partial<Channel>) => {
    if (!activeChannel) return;
    
    setChannels(prev => prev.map(ch => 
      ch.id === activeChannel.id ? { ...ch, ...updates } : ch
    ));
    
    setActiveChannel(prev => prev ? { ...prev, ...updates } : null);
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Render
  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--z-bg)', color: 'var(--z-text)' }}>
      {/* Left Sidebar - Channel List */}
      <div className="w-80 border-r flex flex-col" style={{ 
        borderColor: 'var(--z-primary-dim)', 
        backgroundColor: 'var(--z-surface)' 
      }}>
        {/* Search Header */}
        <div className="p-4 border-b border-zenith-greenDim/30">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-zenith-dim" />
              <input
                type="text"
                placeholder="Search channels, messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-zenith-greenDim rounded-lg focus:border-zenith-primary focus:outline-none text-sm text-black placeholder-gray-500"
              />
            </div>
            <button
              onClick={() => setShowContacts(true)}
              className="p-2 bg-white border border-zenith-greenDim rounded-lg hover:bg-zenith-greenDim/10 transition-colors"
              title="Contacts"
            >
              <FontAwesomeIcon icon={faUserPlus} className="text-zenith-dim" />
            </button>
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto">
          {channels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => handleChannelSelect(channel)}
              className={`flex items-center gap-3 p-4 hover:bg-zenith-greenDim/10 cursor-pointer border-b border-zenith-greenDim/20 ${
                activeChannel?.id === channel.id ? 'bg-zenith-greenDim/20' : ''
              }`}
            >
              <div className="relative">
                {channel.type === 'private' ? (
                  <img
                    src={channel.avatar || `https://picsum.photos/seed/${channel.id}/50/50`}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zenith-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-zenith-primary">
                      {channel.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {channel.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate text-black">{channel.name}</span>
                  {channel.isPinned && (
                    <FontAwesomeIcon icon={faThumbTack} className="text-zenith-primary text-xs" />
                  )}
                  {channel.isMuted && (
                    <FontAwesomeIcon icon={faBellSlash} className="text-zenith-dim text-xs" />
                  )}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {channel.description || 'No messages yet'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Create Channel Button */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={() => setShowCreateChannel(true)}
            className="w-14 h-14 bg-zenith-primary text-black rounded-full hover:bg-zenith-primary/80 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            title="Create Channel"
          >
            <FontAwesomeIcon icon={faPlus} className="text-lg" />
          </button>
        </div>
      </div>

      {/* Center - Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChannel ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-zenith-greenDim/30" style={{ backgroundColor: 'var(--z-surface)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {activeChannel.type === 'private' ? (
                      <img
                        src={activeChannel.avatar || `https://picsum.photos/seed/${activeChannel.id}/50/50`}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zenith-primary/20 flex items-center justify-center">
                        <span className="font-bold text-zenith-primary">
                          {activeChannel.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {activeChannel.isLive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-zenith-surface" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">{activeChannel.name}</h3>
                    <p className="text-xs text-zenith-dim">
                      {activeChannel.members?.length || 0} members • Online
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Search Button */}
                  <button
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                    className="p-2 hover:bg-zenith-greenDim/20 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faSearch} className="text-zenith-dim" />
                  </button>
                  
                  {/* Call Controls */}
                  <button
                    onClick={() => setShowCallControls(true)}
                    className="p-2 hover:bg-zenith-greenDim/20 rounded-lg transition-colors"
                    title="Start Voice Call"
                  >
                    <FontAwesomeIcon icon={faPhone} className="text-zenith-dim" />
                  </button>
                  <button
                    onClick={() => setShowCallControls(true)}
                    className="p-2 hover:bg-zenith-greenDim/20 rounded-lg transition-colors"
                    title="Start Video Call"
                  >
                    <FontAwesomeIcon icon={faVideo} className="text-zenith-dim" />
                  </button>
                  
                  {/* Settings */}
                  <button
                    onClick={() => setShowGroupSettings(true)}
                    className="p-2 hover:bg-zenith-greenDim/20 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faCog} className="text-zenith-dim" />
                  </button>
                  
                  {/* Sound Toggle */}
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 hover:bg-zenith-greenDim/20 rounded-lg transition-colors"
                    title={soundEnabled ? 'Mute notifications' : 'Enable notifications'}
                  >
                    <FontAwesomeIcon 
                      icon={soundEnabled ? faVolumeUp : faVolumeMute} 
                      className={soundEnabled ? 'text-zenith-primary' : 'text-zenith-dim'} 
                    />
                  </button>
                </div>
              </div>
              
              {/* Search Bar */}
              {isSearchVisible && (
                <div className="mt-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={globalSearchQuery}
                      onChange={(e) => handleGlobalSearch(e.target.value)}
                      placeholder="Search messages in all channels..."
                      className="w-full px-4 py-2 pl-10 bg-white border border-zenith-greenDim rounded-lg text-black focus:border-zenith-primary focus:outline-none placeholder-gray-500"
                    />
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="absolute left-3 top-3 text-zenith-dim"
                    />
                    {isGlobalSearching && (
                      <div className="absolute right-3 top-3">
                        <div className="w-4 h-4 border-2 border-zenith-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  {/* Search Results */}
                  {globalSearchResults.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto bg-zenith-surface border border-zenith-greenDim rounded-lg">
                      {globalSearchResults.map(result => (
                        <div
                          key={result.id}
                          className="p-3 hover:bg-zenith-greenDim/10 cursor-pointer border-b border-zenith-greenDim/20 last:border-b-0"
                          onClick={() => {
                            const channel = channels.find(ch => ch.id === result.channelId);
                            if (channel) {
                              handleChannelSelect(channel);
                              setIsSearchVisible(false);
                              setGlobalSearchQuery('');
                              setGlobalSearchResults([]);
                            }
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <img
                              src={result.senderAvatar}
                              alt=""
                              className="w-6 h-6 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-zenith-primary">
                                  {result.senderName}
                                </span>
                                <span className="text-xs text-zenith-dim">
                                  {formatTime(result.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-zenith-primary truncate">
                                {result.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isFirstInGroup = index === 0 || messages[index - 1].senderId !== message.senderId;
                const isLastInGroup = index === messages.length - 1 || messages[index + 1].senderId !== message.senderId;
                
                return (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className={`flex gap-3 max-w-3xl ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                      {isFirstInGroup && !message.isOwn && (
                        <img
                          src={message.senderAvatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      {!isFirstInGroup && !message.isOwn && <div className="w-10" />}
                      
                      <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'}`}>
                        {isFirstInGroup && (
                          <span className="text-xs text-zenith-dim mb-1">{message.senderName}</span>
                        )}
                        
                        {message.replyTo && (
                          <div className="bg-zenith-greenDim/20 px-3 py-1 rounded-lg mb-1 text-xs text-zenith-dim">
                            Replying to: {messages.find(m => m.id === message.replyTo)?.text.substring(0, 30)}...
                          </div>
                        )}
                        
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            message.isOwn
                              ? 'bg-zenith-primary text-black rounded-br-sm'
                              : 'bg-zenith-greenDim/20 rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-zenith-dim">{formatTime(message.timestamp)}</span>
                          {message.isOwn && (
                            <FontAwesomeIcon 
                              icon={message.isEdited ? faCheckDouble : faCheck} 
                              className="text-xs text-zenith-primary"
                            />
                          )}
                          {message.isEdited && <span className="text-xs text-zenith-dim">edited</span>}
                        </div>
                        
                        {/* Message Actions */}
                        {selectedMessage === message.id && (
                          <div className={`flex gap-1 mt-2 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                            <button
                              onClick={() => handleReply(message)}
                              className="p-1.5 bg-zenith-greenDim/20 rounded-lg hover:bg-zenith-greenDim/40 text-xs"
                            >
                              <FontAwesomeIcon icon={faReply} />
                            </button>
                            <button
                              onClick={() => handleReaction(message.id, '👍')}
                              className="p-1.5 bg-zenith-greenDim/20 rounded-lg hover:bg-zenith-greenDim/40 text-xs"
                            >
                              👍
                            </button>
                            <button
                              onClick={() => handleReaction(message.id, '❤️')}
                              className="p-1.5 bg-zenith-greenDim/20 rounded-lg hover:bg-zenith-greenDim/40 text-xs"
                            >
                              ❤️
                            </button>
                            {message.isOwn && (
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className="p-1.5 bg-red-500/20 rounded-lg hover:bg-red-500/40 text-red-400 text-xs"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-zenith-greenDim/30" style={{ backgroundColor: 'var(--z-surface)' }}>
              {replyingTo && (
                <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-t-lg mb-2">
                  <span className="text-sm text-gray-700">
                    Replying to {replyingTo.senderName}
                  </span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="flex items-end gap-3">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-zenith-greenDim/20 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faSmile} className="text-zenith-dim" />
                </button>
                <button className="p-2 hover:bg-zenith-greenDim/20 rounded-lg transition-colors">
                  <FontAwesomeIcon icon={faPaperclip} className="text-zenith-dim" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-2 bg-white border border-zenith-greenDim rounded-lg focus:border-zenith-primary focus:outline-none resize-none max-h-32 text-black placeholder-gray-500"
                    style={{ minHeight: '40px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className={`p-3 rounded-lg transition-colors ${
                    inputText.trim()
                      ? 'bg-zenith-primary text-black hover:bg-zenith-primary/80'
                      : 'bg-zenith-greenDim/20 text-zenith-dim cursor-not-allowed'
                  }`}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-zenith-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faPaperPlane} className="text-3xl text-zenith-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Select a channel</h3>
              <p className="text-zenith-dim">Choose a channel to start messaging</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          onStickerSelect={handleStickerSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}
      
      {/* Call Controls */}
      {showCallControls && activeChannel && (
        <CallControls
          channelId={activeChannel.id}
          channelName={activeChannel.name}
          onClose={() => setShowCallControls(false)}
        />
      )}
      
      {/* Group Settings */}
      {showGroupSettings && activeChannel && (
        <GroupSettings
          channel={activeChannel}
          onClose={() => setShowGroupSettings(false)}
          onUpdate={handleChannelUpdate}
        />
      )}
      
      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-black">Create New Channel</h3>
            <input
              type="text"
              placeholder="Channel name"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-zenith-primary focus:outline-none mb-4 text-black placeholder-gray-500"
            />
            <div className="flex gap-2 mb-4">
              {(['private', 'group', 'channel'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setNewChannelType(type)}
                  className={`flex-1 py-2 rounded-lg text-sm capitalize ${
                    newChannelType === type
                      ? 'bg-zenith-primary text-black'
                      : 'bg-gray-100 text-black border border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateChannel(false)}
                className="flex-1 py-2 bg-gray-100 text-black border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChannel}
                className="flex-1 py-2 bg-zenith-primary text-black rounded-lg hover:bg-zenith-primary/80"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Contacts Modal */}
      {showContacts && (
        <ContactsModal
          isOpen={showContacts}
          onClose={() => setShowContacts(false)}
          onSelectContact={handleContactSelect}
        />
      )}
    </div>
  );
};

export default Chat;
