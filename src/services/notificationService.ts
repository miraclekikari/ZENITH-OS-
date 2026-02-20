import { supabase } from '../lib/supabaseClient';
import { getUser } from './storageService';

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'reply' | 'repost' | 'message';

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  actor_username: string;
  actor_avatar: string;
  type: NotificationType;
  post_id?: string;
  comment_id?: string;
  channel_id?: string;
  message: string;
  preview_text?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

class NotificationService {
  private static instance: NotificationService;
  private subscription: any = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // ============================================
  // NOTIFICATION CRUD
  // ============================================

  async fetchNotifications(limit: number = 50): Promise<Notification[]> {
    const currentUser = getUser();
    if (!currentUser) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  }

  async fetchUnreadCount(): Promise<number> {
    const currentUser = getUser();
    if (!currentUser) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', currentUser.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error counting unread notifications:', error);
      return 0;
    }

    return count || 0;
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    const currentUser = getUser();
    if (!currentUser) return false;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', currentUser.id);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  }

  async markAllAsRead(): Promise<void> {
    const currentUser = getUser();
    if (!currentUser) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', currentUser.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    const currentUser = getUser();
    if (!currentUser) return false;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', currentUser.id);

    if (error) {
      console.error('Error deleting notification:', error);
      return false;
    }

    return true;
  }

  // ============================================
  // REALTIME SUBSCRIPTIONS
  // ============================================

  subscribeToNotifications(
    onNewNotification: (notification: Notification) => void,
    onUpdate: () => void
  ): void {
    const currentUser = getUser();
    if (!currentUser) return;

    // Clean up existing subscription
    this.unsubscribe();

    // Subscribe to new notifications
    this.subscription = supabase
      .channel(`notifications:${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          
          // Call callback (sound is handled by the component hook)
          onNewNotification(newNotification);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`,
        },
        () => {
          onUpdate();
        }
      )
      .subscribe();
  }

  unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  // ============================================
  // CREATE NOTIFICATIONS (for manual creation)
  // ============================================

  async createNotification(data: {
    user_id: string;
    actor_id: string;
    type: NotificationType;
    message: string;
    post_id?: string;
    comment_id?: string;
    preview_text?: string;
  }): Promise<Notification | null> {
    const currentUser = getUser();
    if (!currentUser) return null;

    // Get actor profile
    const { data: actorProfile } = await supabase
      .from('chat_profiles')
      .select('username, avatar_url')
      .eq('id', data.actor_id)
      .single();

    const notification = {
      user_id: data.user_id,
      actor_id: data.actor_id,
      actor_username: actorProfile?.username || 'Unknown',
      actor_avatar: actorProfile?.avatar_url || '',
      type: data.type,
      message: data.message,
      post_id: data.post_id,
      comment_id: data.comment_id,
      preview_text: data.preview_text,
      is_read: false,
    };

    const { data: result, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }

    return result;
  }
}

// Export singleton instance
export default NotificationService.getInstance();
