import { supabase } from '../lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// --- TYPE DEFINITIONS ---

export type Profile = {
  id: string;
  username: string;
  avatar_url: string;
  status: 'online' | 'offline' | string;
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

export type Channel = {
  id: number;
  name: string;
};

let channelSubscription: RealtimeChannel | null = null;

// --- CHAT SERVICE API ---

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

export const getChannelDetails = async (channelId: number): Promise<Channel | null> => {
  const { data, error } = await supabase.from('channels').select('id, name').eq('id', channelId).single();
  if (error) {
    console.error('Error fetching channel details:', error);
    return null;
  }
  return data;
};

export const getMembers = async (channelId: number): Promise<Profile[]> => {
  const { data: memberIds, error: idsError } = await supabase.from('channel_members').select('profile_id').eq('channel_id', channelId);
  if (idsError || !memberIds || memberIds.length === 0) {
    if (idsError) console.error('Error fetching member IDs:', idsError);
    return [];
  }

  const profileIds = memberIds.map((m) => m.profile_id);
  const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('*').in('id', profileIds);
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return [];
  }
  return profilesData as Profile[];
};

export const sendMessage = async (channelId: number, content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase.from('messages').insert({ content, author_id: user.id, channel_id: channelId });
    if (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const uploadAttachment = async (channelId: number, file: File) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const fileName = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('chat-attachments').upload(fileName, file);
    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
    }

    const { data } = supabase.storage.from('chat-attachments').getPublicUrl(fileName);
    if (!data) throw new Error("Could not get public URL");

    return sendMessage(channelId, data.publicUrl);
};

export const subscribeToChannel = (
  channelId: number,
  onNewMessage: (message: Message) => void
) => {
  if (channelSubscription) {
    supabase.removeChannel(channelSubscription);
    channelSubscription = null;
  }

  channelSubscription = supabase
    .channel(`room:${channelId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` },
      async (payload) => {
        const newMsg = payload.new as Omit<Message, 'profiles'>;
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', newMsg.author_id).single();
        const fullMessage: Message = { ...newMsg, profiles: (profileData as Profile) || null };
        onNewMessage(fullMessage);
      }
    )
    .subscribe();

  return () => {
    if (channelSubscription) {
      supabase.removeChannel(channelSubscription);
      channelSubscription = null;
    }
  };
};
