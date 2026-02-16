import { supabase } from '../lib/supabaseClient';
import { Message, Channel, ChatUser, TypingIndicator } from '../types/chat';
import { DB } from './storageService';

export interface SupabaseChannel {
  id: string;
  name: string;
  description?: string;
  type: 'private' | 'group' | 'channel';
  avatar?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_muted: boolean;
  member_count: number;
}

export interface SupabaseMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  updated_at?: string;
  is_edited: boolean;
  is_deleted: boolean;
  reply_to?: string;
  forwarded_from?: string;
  forwarded_channel_id?: string;
}

export interface SupabaseChannelMember {
  id: string;
  channel_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  last_read_at?: string;
  is_muted: boolean;
  notifications_enabled: boolean;
}

class SupabaseChatService {
  private static instance: SupabaseChatService;
  private subscriptions: Map<string, any> = new Map();

  static getInstance(): SupabaseChatService {
    if (!SupabaseChatService.instance) {
      SupabaseChatService.instance = new SupabaseChatService();
    }
    return SupabaseChatService.instance;
  }

  // === CHANNEL MANAGEMENT ===
  
  async createChannel(data: Partial<Channel>): Promise<Channel> {
    const currentUser = DB.getUser();
    if (!currentUser) throw new Error('User not authenticated');

    const { data: channel, error } = await supabase
      .from('channels')
      .insert({
        name: data.name || 'New Channel',
        description: data.description || '',
        type: data.type || 'private',
        avatar: data.avatar || '',
        created_by: currentUser.id,
        is_pinned: false,
        is_muted: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Add creator as admin member
    await this.addMember(channel.id, currentUser.id, 'admin');

    return this.mapSupabaseChannelToChannel(channel);
  }

  async getChannels(userId: string): Promise<Channel[]> {
    const { data: memberships, error: memberError } = await supabase
      .from('channel_members')
      .select('channel_id, role, is_muted, last_read_at')
      .eq('user_id', userId);

    if (memberError) throw memberError;

    const channelIds = memberships?.map(m => m.channel_id) || [];
    
    if (channelIds.length === 0) return [];

    const { data: channels, error } = await supabase
      .from('channels')
      .select('*')
      .in('id', channelIds)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return channels?.map(channel => {
      const membership = memberships?.find(m => m.channel_id === channel.id);
      return this.mapSupabaseChannelToChannel(channel, membership);
    }) || [];
  }

  async joinChannel(channelId: string): Promise<void> {
    const currentUser = DB.getUser();
    if (!currentUser) throw new Error('User not authenticated');

    await this.addMember(channelId, currentUser.id, 'member');
  }

  async leaveChannel(channelId: string): Promise<void> {
    const currentUser = DB.getUser();
    if (!currentUser) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('channel_members')
      .delete()
      .eq('channel_id', channelId)
      .eq('user_id', currentUser.id);

    if (error) throw error;
  }

  private async addMember(channelId: string, userId: string, role: 'admin' | 'moderator' | 'member'): Promise<void> {
    const { error } = await supabase
      .from('channel_members')
      .upsert({
        channel_id: channelId,
        user_id: userId,
        role,
        is_muted: false,
        notifications_enabled: true,
      }, {
        onConflict: 'channel_id,user_id'
      });

    if (error) throw error;

    // Update member count
    await supabase.rpc('increment_channel_member_count', { channel_id: channelId });
  }

  // === MESSAGE MANAGEMENT ===
  
  async sendMessage(channelId: string, text: string, replyTo?: string): Promise<Message> {
    const currentUser = DB.getUser();
    if (!currentUser) throw new Error('User not authenticated');

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        channel_id: channelId,
        sender_id: currentUser.id,
        text,
        reply_to: replyTo,
        is_edited: false,
        is_deleted: false,
      })
      .select()
      .single();

    if (error) throw error;

    return this.mapSupabaseMessageToMessage(message, currentUser);
  }

  async getMessages(channelId: string, limit: number = 50): Promise<Message[]> {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('channel_id', channelId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const currentUser = DB.getUser();
    return messages?.reverse().map(msg => this.mapSupabaseMessageToMessage(msg, currentUser)) || [];
  }

  async editMessage(messageId: string, newText: string): Promise<void> {
    const currentUser = DB.getUser();
    if (!currentUser) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('messages')
      .update({
        text: newText,
        is_edited: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .eq('sender_id', currentUser.id);

    if (error) throw error;
  }

  async deleteMessage(messageId: string): Promise<void> {
    const currentUser = DB.getUser();
    if (!currentUser) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('messages')
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .eq('sender_id', currentUser.id);

    if (error) throw error;
  }

  // === REALTIME SUBSCRIPTIONS ===
  
  subscribeToChannel(channelId: string, callbacks: {
    onNewMessage: (message: Message) => void;
    onMessageUpdated: (message: Message) => void;
    onMessageDeleted: (messageId: string) => void;
    onUserJoined: (userId: string) => void;
    onUserLeft: (userId: string) => void;
  }): void {
    // Unsubscribe from existing subscription
    this.unsubscribeFromChannel(channelId);

    const subscription = supabase
      .channel(`chat_${channelId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        }, 
        async (payload) => {
          const currentUser = DB.getUser();
          if (currentUser) {
            const message = this.mapSupabaseMessageToMessage(payload.new as SupabaseMessage, currentUser);
            callbacks.onNewMessage(message);
          }
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          const currentUser = DB.getUser();
          if (currentUser) {
            const message = this.mapSupabaseMessageToMessage(payload.new as SupabaseMessage, currentUser);
            callbacks.onMessageUpdated(message);
          }
        }
      )
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'channel_members',
          filter: `channel_id=eq.${channelId}`
        },
        (payload) => {
          callbacks.onUserJoined(payload.new.user_id);
        }
      )
      .on('postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'channel_members',
          filter: `channel_id=eq.${channelId}`
        },
        (payload) => {
          callbacks.onUserLeft(payload.old.user_id);
        }
      )
      .subscribe();

    this.subscriptions.set(channelId, subscription);
  }

  unsubscribeFromChannel(channelId: string): void {
    const subscription = this.subscriptions.get(channelId);
    if (subscription) {
      supabase.removeChannel(subscription);
      this.subscriptions.delete(channelId);
    }
  }

  // === UTILITY METHODS ===
  
  private mapSupabaseChannelToChannel(supabaseChannel: SupabaseChannel, membership?: any): Channel {
    return {
      id: supabaseChannel.id,
      name: supabaseChannel.name,
      type: supabaseChannel.type,
      description: supabaseChannel.description,
      avatar: supabaseChannel.avatar,
      members: [], // Will be populated separately if needed
      admins: [], // Will be populated separately if needed
      unreadCount: 0, // Will be calculated based on last_read_at
      isMuted: membership?.is_muted || supabaseChannel.is_muted,
      isPinned: supabaseChannel.is_pinned,
      createdAt: supabaseChannel.created_at,
      createdBy: supabaseChannel.created_by,
    };
  }

  private mapSupabaseMessageToMessage(supabaseMessage: SupabaseMessage, currentUser: any): Message {
    return {
      id: supabaseMessage.id,
      channelId: supabaseMessage.channel_id,
      senderId: supabaseMessage.sender_id,
      senderName: currentUser.username, // Will be updated with actual sender data
      senderAvatar: currentUser.avatar,
      text: supabaseMessage.text,
      timestamp: supabaseMessage.created_at,
      isEdited: supabaseMessage.is_edited,
      isDeleted: supabaseMessage.is_deleted,
      isOwn: supabaseMessage.sender_id === currentUser.id,
      replyTo: supabaseMessage.reply_to,
      reactions: [],
      attachments: [],
    };
  }

  // === DEFAULT CHANNELS CREATION ===
  
  async createDefaultChannels(): Promise<void> {
    const currentUser = DB.getUser();
    if (!currentUser) return;

    const defaultChannels = [
      { name: 'General', type: 'channel' as const, description: 'General discussion channel' },
      { name: 'Random', type: 'channel' as const, description: 'Random conversations' },
      { name: 'Tech Talk', type: 'channel' as const, description: 'Technology discussions' },
    ];

    for (const channelData of defaultChannels) {
      try {
        await this.createChannel(channelData);
      } catch (error) {
        // Channel might already exist, ignore error
        console.log(`Channel ${channelData.name} might already exist`);
      }
    }
  }

  // Cleanup
  cleanup(): void {
    this.subscriptions.forEach((subscription, channelId) => {
      supabase.removeChannel(subscription);
    });
    this.subscriptions.clear();
  }
}

export default SupabaseChatService.getInstance();
