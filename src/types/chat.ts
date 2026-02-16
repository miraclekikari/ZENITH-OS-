export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  isOwn: boolean;
  isEdited?: boolean;
  replyTo?: string;
  reactions?: Reaction[];
  attachments?: Attachment[];
  forwardedFrom?: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  name: string;
  size: number;
  thumbnail?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'private' | 'group' | 'channel';
  description?: string;
  avatar?: string;
  members: string[];
  admins: string[];
  lastMessage?: Message;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  createdAt: string;
  createdBy: string;
}

export interface ChatUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
  isTyping?: boolean;
  bio?: string;
  phone?: string;
  isVerified: boolean;
}

export interface TypingIndicator {
  userId: string;
  username: string;
  channelId: string;
  timestamp: string;
}

export interface ChatSettings {
  notifications: boolean;
  sound: boolean;
  vibration: boolean;
  nightMode: boolean;
  readReceipts: boolean;
  onlineStatus: boolean;
  typingIndicators: boolean;
  messagePreview: boolean;
}

export interface SearchResult {
  type: 'user' | 'message' | 'channel';
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  timestamp?: string;
  highlight?: string;
}
