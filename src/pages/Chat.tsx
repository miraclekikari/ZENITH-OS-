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
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { Message, Channel, ChatUser, TypingIndicator, SearchResult } from '../types/chat';
import ChatService from '../services/chatService';
import { DB } from '../services/storageService';

// Mock users for demonstration
const MOCK_USERS: ChatUser[] = [
  { id: 'u1', username: 'Commander', fullName: 'Commander Zenith', avatar: 'https://picsum.photos/seed/u1/200/200', status: 'online', bio: 'Admin', isVerified: true },
  { id: 'u2', username: 'CyberPilot', fullName: 'Cyber Pilot', avatar: 'https://picsum.photos/seed/u2/200/200', status: 'away', bio: 'Tech enthusiast', isVerified: false },
  { id: 'u3', username: 'NeuralLink', fullName: 'Neural Link', avatar: 'https://picsum.photos/seed/u3/200/200', status: 'offline', bio: 'AI researcher', isVerified: true },
  { id: 'u4', username: 'Quantum', fullName: 'Quantum User', avatar: 'https://picsum.photos/seed/u4/200/200', status: 'online', bio: 'Developer', isVerified: false },
];

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const chatService = ChatService;
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
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'private' | 'group' | 'channel'>('private');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    chatService.init();
    setChannels(chatService.getChannels());
    
    // Select first channel if none selected
    const allChannels = chatService.getChannels();
    if (allChannels.length > 0 && !activeChannel) {
      handleChannelSelect(allChannels[0]);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Typing indicator simulation
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    if (activeChannel && e.target.value.length > 0) {
      chatService.setTyping(activeChannel.id, currentUser?.id || 'u1', currentUser?.username || 'User');
      
      // Clear typing after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        if (activeChannel) {
          chatService.clearTyping(activeChannel.id, currentUser?.id || 'u1');
        }
      }, 3000);
    }
  };

  // Channel selection
  const handleChannelSelect = useCallback((channel: Channel) => {
    setActiveChannel(channel);
    const channelMessages = chatService.getMessages(channel.id, 100);
    setMessages(channelMessages);
    
    // Reset unread count
    if (channel.unreadCount > 0) {
      channel.unreadCount = 0;
      setChannels([...channels]);
    }
  }, [channels]);

  // Send message
  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChannel) return;
    
    try {
      const newMessage = await chatService.sendMessage(
        activeChannel.id,
        inputText.trim(),
        replyingTo?.id
      );
      
      setMessages([...messages, newMessage]);
      setInputText('');
      setReplyingTo(null);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.length >= 2) {
      const results = chatService.search(query);
      setSearchResults(results);
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, []);

  // Create new channel
  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return;
    
    try {
      const newChannel = await chatService.createChannel({
        name: newChannelName.trim(),
        type: newChannelType,
      });
      
      setChannels([...channels, newChannel]);
      setNewChannelName('');
      setShowCreateChannel(false);
      handleChannelSelect(newChannel);
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  };

  // Message actions
  const handleReply = (message: Message) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!activeChannel) return;
    
    try {
      await chatService.deleteMessage(activeChannel.id, messageId);
      setMessages(messages.filter(m => m.id !== messageId));
      setSelectedMessage(null);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!activeChannel) return;
    
    try {
      await chatService.addReaction(activeChannel.id, messageId, emoji);
      // Refresh messages to show new reaction
      const updatedMessages = chatService.getMessages(activeChannel.id, 100);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
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
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-zenith-dim" />
            <input
              type="text"
              placeholder="Search channels, messages..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zenith-bg border border-zenith-greenDim rounded-lg focus:border-zenith-primary focus:outline-none text-sm"
            />
            {isSearching && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-zenith-surface border border-zenith-greenDim rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => {
                      if (result.type === 'channel') {
                        const channel = channels.find(c => c.id === result.id);
                        if (channel) handleChannelSelect(channel);
                      }
                      setSearchQuery('');
                      setIsSearching(false);
                    }}
                    className="p-3 hover:bg-zenith-greenDim/20 cursor-pointer border-b border-zenith-greenDim/20 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {result.avatar && (
                        <img src={result.avatar} alt="" className="w-8 h-8 rounded-full" />
                      )}
                      <div>
                        <div className="font-medium text-sm">{result.title}</div>
                        {result.subtitle && (
                          <div className="text-xs text-zenith-dim truncate max-w-48">
                            {result.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-xs font-bold text-zenith-dim uppercase tracking-wider">Channels</span>
              <button
                onClick={() => setShowCreateChannel(true)}
                className="p-1.5 hover:bg-zenith-greenDim/20 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="text-zenith-primary text-sm" />
              </button>
            </div>
            
            {channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleChannelSelect(channel)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  activeChannel?.id === channel.id 
                    ? 'bg-zenith-primary/20 border-l-2 border-zenith-primary' 
                    : 'hover:bg-zenith-greenDim/10'
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
                    <span className="font-medium text-sm truncate">{channel.name}</span>
                    {channel.isPinned && (
                      <FontAwesomeIcon icon={faThumbTack} className="text-zenith-primary text-xs" />
                    )}
                    {channel.isMuted && (
                      <FontAwesomeIcon icon={faBellSlash} className="text-zenith-dim text-xs" />
                    )}
                  </div>
                  <div className="text-xs text-zenith-dim truncate">
                    {channel.lastMessage 
                      ? `${channel.lastMessage.senderName}: ${channel.lastMessage.text.substring(0, 30)}`
                      : channel.description || 'No messages yet'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Channel Modal */}
        {showCreateChannel && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zenith-surface border border-zenith-greenDim rounded-xl p-6 w-80">
              <h3 className="text-lg font-bold mb-4">New Channel</h3>
              <input
                type="text"
                placeholder="Channel name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="w-full px-4 py-2 bg-zenith-bg border border-zenith-greenDim rounded-lg focus:border-zenith-primary focus:outline-none mb-4"
              />
              <div className="flex gap-2 mb-4">
                {(['private', 'group', 'channel'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewChannelType(type)}
                    className={`flex-1 py-2 rounded-lg text-sm capitalize ${
                      newChannelType === type
                        ? 'bg-zenith-primary text-black'
                        : 'bg-zenith-bg border border-zenith-greenDim'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateChannel(false)}
                  className="flex-1 py-2 bg-zenith-bg border border-zenith-greenDim rounded-lg hover:bg-zenith-greenDim/20"
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
      </div>

      {/* Center - Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChannel ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zenith-greenDim/30 bg-zenith-surface">
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
                </div>
                <div>
                  <h3 className="font-bold">{activeChannel.name}</h3>
                  <p className="text-xs text-zenith-dim">
                    {activeChannel.members.length} members • {typingUsers.length > 0 
                      ? `${typingUsers.map(u => u.username).join(', ')} typing...`
                      : 'Online'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-zenith-greenDim/20 rounded-lg transition-colors">
                  <FontAwesomeIcon icon={faSearch} className="text-zenith-dim" />
                </button>
                <button className="p-2 hover:bg-zenith-greenDim/20 rounded-lg transition-colors">
                  <FontAwesomeIcon icon={faPhone} className="text-zenith-dim" />
                </button>
                <button className="p-2 hover:bg-zenith-greenDim/20 rounded-lg transition-colors">
                  <FontAwesomeIcon icon={faVideo} className="text-zenith-dim" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowChannelMenu(!showChannelMenu)}
                    className="p-2 hover:bg-zenith-greenDim/20 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faEllipsisH} className="text-zenith-dim" />
                  </button>
                  {showChannelMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-zenith-surface border border-zenith-greenDim rounded-lg shadow-lg z-50 w-48">
                      <button
                        onClick={() => {
                          activeChannel.isMuted = !activeChannel.isMuted;
                          setShowChannelMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-zenith-greenDim/20 flex items-center gap-3"
                      >
                        <FontAwesomeIcon icon={activeChannel.isMuted ? faBell : faBellSlash} />
                        {activeChannel.isMuted ? 'Unmute' : 'Mute'}
                      </button>
                      <button
                        onClick={() => {
                          activeChannel.isPinned = !activeChannel.isPinned;
                          setShowChannelMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-zenith-greenDim/20 flex items-center gap-3"
                      >
                        <FontAwesomeIcon icon={faThumbTack} />
                        {activeChannel.isPinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button
                        onClick={() => {
                          chatService.leaveChannel(activeChannel.id);
                          setShowChannelMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-red-500/20 text-red-400 flex items-center gap-3"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Leave Channel
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
                        
                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {message.reactions.map((reaction) => (
                              <button
                                key={reaction.emoji}
                                onClick={() => handleReaction(message.id, reaction.emoji)}
                                className={`px-2 py-0.5 rounded-full text-xs ${
                                  reaction.users.includes(currentUser?.id || 'u1')
                                    ? 'bg-zenith-primary/30 border border-zenith-primary'
                                    : 'bg-zenith-greenDim/20'
                                }`}
                              >
                                {reaction.emoji} {reaction.count}
                              </button>
                            ))}
                          </div>
                        )}
                        
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
            <div className="p-4 border-t border-zenith-greenDim/30 bg-zenith-surface">
              {replyingTo && (
                <div className="flex items-center justify-between bg-zenith-greenDim/20 px-4 py-2 rounded-t-lg mb-2">
                  <span className="text-sm text-zenith-dim">
                    Replying to {replyingTo.senderName}
                  </span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-zenith-dim hover:text-white"
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-2 bg-zenith-bg border border-zenith-greenDim rounded-lg focus:border-zenith-primary focus:outline-none resize-none max-h-32"
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
    </div>
  );
};

export default Chat;
