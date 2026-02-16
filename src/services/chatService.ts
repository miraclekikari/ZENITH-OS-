import { Message, Channel, ChatUser, TypingIndicator, SearchResult } from '../types/chat';
import { DB } from './storageService';

class ChatService {
  private static instance: ChatService;
  private channels: Channel[] = [];
  private messages: Record<string, Message[]> = {};
  private typingUsers: Record<string, TypingIndicator[]> = {};
  private onlineUsers: Record<string, ChatUser> = {};

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // === CHANNEL MANAGEMENT ===
  
  async createChannel(data: Partial<Channel>): Promise<Channel> {
    const currentUser = DB.getUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const newChannel: Channel = {
      id: `channel_${Date.now()}`,
      name: data.name || 'New Channel',
      type: data.type || 'private',
      description: data.description || '',
      avatar: data.avatar || '',
      members: [currentUser.id],
      admins: [currentUser.id],
      unreadCount: 0,
      isMuted: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      ...data
    };
    
    this.channels.push(newChannel);
    this.saveChannels();
    return newChannel;
  }

  async joinChannel(channelId: string): Promise<void> {
    const currentUser = DB.getUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const channel = this.channels.find(c => c.id === channelId);
    if (!channel) throw new Error('Channel not found');
    
    if (!channel.members.includes(currentUser.id)) {
      channel.members.push(currentUser.id);
      this.saveChannels();
    }
  }

  async leaveChannel(channelId: string): Promise<void> {
    const currentUser = DB.getUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const channelIndex = this.channels.findIndex(c => c.id === channelId);
    if (channelIndex === -1) return;
    
    const channel = this.channels[channelIndex];
    channel.members = channel.members.filter(id => id !== currentUser.id);
    channel.admins = channel.admins.filter(id => id !== currentUser.id);
    
    if (channel.members.length === 0) {
      this.channels.splice(channelIndex, 1);
    }
    
    this.saveChannels();
  }

  getChannels(): Channel[] {
    return this.channels;
  }

  getChannel(channelId: string): Channel | undefined {
    return this.channels.find(c => c.id === channelId);
  }

  // === MESSAGE MANAGEMENT ===
  
  async sendMessage(channelId: string, text: string, replyTo?: string, attachments?: any[]): Promise<Message> {
    const currentUser = DB.getUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      text,
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderAvatar: currentUser.avatar,
      timestamp: new Date().toISOString(),
      isOwn: true,
      replyTo,
      reactions: [],
      attachments: attachments || []
    };
    
    if (!this.messages[channelId]) {
      this.messages[channelId] = [];
    }
    
    this.messages[channelId].push(message);
    
    // Update channel last message
    const channel = this.getChannel(channelId);
    if (channel) {
      channel.lastMessage = message;
    }
    
    this.saveMessages();
    return message;
  }

  async editMessage(channelId: string, messageId: string, newText: string): Promise<void> {
    const channelMessages = this.messages[channelId];
    if (!channelMessages) return;
    
    const messageIndex = channelMessages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    const message = channelMessages[messageIndex];
    if (message.isOwn) {
      message.text = newText;
      message.isEdited = true;
      this.saveMessages();
    }
  }

  async deleteMessage(channelId: string, messageId: string): Promise<void> {
    const channelMessages = this.messages[channelId];
    if (!channelMessages) return;
    
    const messageIndex = channelMessages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    const message = channelMessages[messageIndex];
    if (message.isOwn) {
      channelMessages.splice(messageIndex, 1);
      this.saveMessages();
    }
  }

  getMessages(channelId: string, limit: number = 50): Message[] {
    const channelMessages = this.messages[channelId] || [];
    return channelMessages.slice(-limit);
  }

  // === REACTIONS ===
  
  async addReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
    const channelMessages = this.messages[channelId];
    if (!channelMessages) return;
    
    const message = channelMessages.find(m => m.id === messageId);
    if (!message) return;
    
    if (!message.reactions) {
      message.reactions = [];
    }
    
    const existingReaction = message.reactions.find(r => r.emoji === emoji);
    const currentUser = DB.getUser();
    
    if (existingReaction) {
      if (!existingReaction.users.includes(currentUser.id)) {
        existingReaction.count++;
        existingReaction.users.push(currentUser.id);
      }
    } else {
      message.reactions.push({
        emoji,
        count: 1,
        users: [currentUser.id]
      });
    }
    
    this.saveMessages();
  }

  // === TYPING INDICATORS ===
  
  setTyping(channelId: string, userId: string, username: string): void {
    if (!this.typingUsers[channelId]) {
      this.typingUsers[channelId] = [];
    }
    
    // Remove existing typing indicator for this user
    this.typingUsers[channelId] = this.typingUsers[channelId].filter(
      t => t.userId !== userId
    );
    
    // Add new typing indicator
    this.typingUsers[channelId].push({
      userId,
      username,
      channelId,
      timestamp: new Date().toISOString()
    });
    
    // Clear typing indicators after 3 seconds
    setTimeout(() => {
      this.clearTyping(channelId, userId);
    }, 3000);
  }

  clearTyping(channelId: string, userId: string): void {
    if (this.typingUsers[channelId]) {
      this.typingUsers[channelId] = this.typingUsers[channelId].filter(
        t => t.userId !== userId
      );
    }
  }

  getTypingUsers(channelId: string): TypingIndicator[] {
    return this.typingUsers[channelId] || [];
  }

  // === SEARCH ===
  
  search(query: string): SearchResult[] {
    const results: SearchResult[] = [];
    const currentUser = DB.getUser();
    
    // Search in channels
    this.channels.forEach(channel => {
      if (channel.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'channel',
          id: channel.id,
          title: channel.name,
          subtitle: `${channel.members.length} members`,
          avatar: channel.avatar
        });
      }
    });
    
    // Search in messages
    Object.values(this.messages).flat().forEach(message => {
      if (message.text.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'message',
          id: message.id,
          title: message.senderName,
          subtitle: message.text.substring(0, 100),
          avatar: message.senderAvatar,
          timestamp: message.timestamp,
          highlight: query
        });
      }
    });
    
    // Search in users (mock)
    if (this.onlineUsers) {
      Object.values(this.onlineUsers).forEach(user => {
        if (user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.fullName.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            type: 'user',
            id: user.id,
            title: user.fullName,
            subtitle: `@${user.username}`,
            avatar: user.avatar
          });
        }
      });
    }
    
    return results.slice(0, 20); // Limit results
  }

  // === PERSISTENCE ===
  
  private saveChannels(): void {
    DB.saveData('zenith_channels', this.channels);
  }

  private saveMessages(): void {
    DB.saveData('zenith_messages', this.messages);
  }

  private loadChannels(): void {
    const saved = DB.getData('zenith_channels');
    if (saved) {
      this.channels = saved;
    } else {
      // Create default channels
      this.createDefaultChannels();
    }
  }

  private loadMessages(): void {
    const saved = DB.getData('zenith_messages');
    if (saved) {
      this.messages = saved;
    }
  }

  private createDefaultChannels(): void {
    const defaultChannels: Channel[] = [
      {
        id: 'general',
        name: 'General',
        type: 'channel',
        description: 'General discussion channel',
        members: [],
        admins: [],
        unreadCount: 0,
        isMuted: false,
        isPinned: true,
        createdAt: new Date().toISOString(),
        createdBy: 'system'
      },
      {
        id: 'random',
        name: 'Random',
        type: 'channel',
        description: 'Random discussions and fun',
        members: [],
        admins: [],
        unreadCount: 0,
        isMuted: false,
        isPinned: false,
        createdAt: new Date().toISOString(),
        createdBy: 'system'
      },
      {
        id: 'tech',
        name: 'Tech Talk',
        type: 'channel',
        description: 'Technology discussions and support',
        members: [],
        admins: [],
        unreadCount: 0,
        isMuted: false,
        isPinned: false,
        createdAt: new Date().toISOString(),
        createdBy: 'system'
      }
    ];
    
    this.channels = defaultChannels;
    this.saveChannels();
  }

  // Initialize service
  init(): void {
    this.loadChannels();
    this.loadMessages();
  }
}

export default ChatService.getInstance();
