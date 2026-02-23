import { supabase } from '../lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

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

let channelSubscription: RealtimeChannel | null = null;

// --- CHAT SERVICE ---

/**
 * Fetches messages for a given channel.
 */
export const getMessages = async (channelId: number): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*, profiles(*)')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data as Message[];
};

