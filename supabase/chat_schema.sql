-- ============================================
-- ZENITH OS - Chat System Database Schema
-- Execute this in your Supabase SQL Editor
-- ============================================

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- ============================================
-- 1. CHANNELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('private', 'group', 'channel')),
    avatar TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_pinned BOOLEAN DEFAULT FALSE,
    is_muted BOOLEAN DEFAULT FALSE,
    member_count INTEGER DEFAULT 0
);

-- Indexes for channels
CREATE INDEX idx_channels_type ON channels(type);
CREATE INDEX idx_channels_created_by ON channels(created_by);
CREATE INDEX idx_channels_created_at ON channels(created_at DESC);

-- Enable RLS on channels
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

-- Policies for channels
CREATE POLICY "channels_select_policy" 
    ON channels FOR SELECT 
    USING (true);

CREATE POLICY "channels_insert_policy" 
    ON channels FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "channels_update_policy" 
    ON channels FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = created_by);

CREATE POLICY "channels_delete_policy" 
    ON channels FOR DELETE 
    TO authenticated 
    USING (auth.uid() = created_by);

-- ============================================
-- 2. CHANNEL MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS channel_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE,
    is_muted BOOLEAN DEFAULT FALSE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    UNIQUE(channel_id, user_id)
);

-- Indexes for channel_members
CREATE INDEX idx_channel_members_channel_id ON channel_members(channel_id);
CREATE INDEX idx_channel_members_user_id ON channel_members(user_id);
CREATE INDEX idx_channel_members_role ON channel_members(role);

-- Enable RLS on channel_members
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;

-- Policies for channel_members
CREATE POLICY "channel_members_select_policy" 
    ON channel_members FOR SELECT 
    USING (true);

CREATE POLICY "channel_members_insert_policy" 
    ON channel_members FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "channel_members_update_policy" 
    ON channel_members FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY "channel_members_delete_policy" 
    ON channel_members FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);

-- ============================================
-- 3. MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
    forwarded_from UUID REFERENCES messages(id) ON DELETE SET NULL,
    forwarded_channel_id UUID REFERENCES channels(id) ON DELETE SET NULL
);

-- Indexes for messages
CREATE INDEX idx_messages_channel_id ON messages(channel_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_reply_to ON messages(reply_to);
CREATE INDEX idx_messages_channel_created ON messages(channel_id, created_at DESC);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages
CREATE POLICY "messages_select_policy" 
    ON messages FOR SELECT 
    USING (true);

CREATE POLICY "messages_insert_policy" 
    ON messages FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "messages_update_policy" 
    ON messages FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = sender_id);

CREATE POLICY "messages_delete_policy" 
    ON messages FOR DELETE 
    TO authenticated 
    USING (auth.uid() = sender_id);

-- ============================================
-- 4. MESSAGE ATTACHMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for message_attachments
CREATE INDEX idx_message_attachments_message_id ON message_attachments(message_id);

-- Enable RLS on message_attachments
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Policies for message_attachments
CREATE POLICY "message_attachments_select_policy" 
    ON message_attachments FOR SELECT 
    USING (true);

CREATE POLICY "message_attachments_insert_policy" 
    ON message_attachments FOR INSERT 
    TO authenticated 
    WITH CHECK (EXISTS (
        SELECT 1 FROM messages 
        WHERE messages.id = message_attachments.message_id 
        AND messages.sender_id = auth.uid()
    ));

-- ============================================
-- 5. MESSAGE REACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- Indexes for message_reactions
CREATE INDEX idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON message_reactions(user_id);
CREATE INDEX idx_message_reactions_emoji ON message_reactions(emoji);

-- Enable RLS on message_reactions
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Policies for message_reactions
CREATE POLICY "message_reactions_select_policy" 
    ON message_reactions FOR SELECT 
    USING (true);

CREATE POLICY "message_reactions_insert_policy" 
    ON message_reactions FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "message_reactions_delete_policy" 
    ON message_reactions FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);

-- ============================================
-- 6. TYPING INDICATORS TABLE ( ephemeral )
-- ============================================
CREATE TABLE IF NOT EXISTS typing_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 seconds'),
    UNIQUE(channel_id, user_id)
);

-- Indexes for typing_indicators
CREATE INDEX idx_typing_indicators_channel_id ON typing_indicators(channel_id);
CREATE INDEX idx_typing_indicators_expires_at ON typing_indicators(expires_at);

-- Enable RLS on typing_indicators
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;

-- Policies for typing_indicators
CREATE POLICY "typing_indicators_select_policy" 
    ON typing_indicators FOR SELECT 
    USING (true);

CREATE POLICY "typing_indicators_insert_policy" 
    ON typing_indicators FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "typing_indicators_update_policy" 
    ON typing_indicators FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY "typing_indicators_delete_policy" 
    ON typing_indicators FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);

-- ============================================
-- 7. USER PROFILES EXTENSION FOR CHAT
-- ============================================
-- Add chat-related columns to existing profiles table if it exists
-- Or create a new chat_profiles table

CREATE TABLE IF NOT EXISTS chat_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away', 'busy')),
    last_seen_at TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for chat_profiles
CREATE INDEX idx_chat_profiles_username ON chat_profiles(username);
CREATE INDEX idx_chat_profiles_status ON chat_profiles(status);

-- Enable RLS on chat_profiles
ALTER TABLE chat_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for chat_profiles
CREATE POLICY "chat_profiles_select_policy" 
    ON chat_profiles FOR SELECT 
    USING (true);

CREATE POLICY "chat_profiles_insert_policy" 
    ON chat_profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "chat_profiles_update_policy" 
    ON chat_profiles FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id);

-- ============================================
-- 8. USER PRESENCE TABLE ( for online status )
-- ============================================
CREATE TABLE IF NOT EXISTS user_presence (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away', 'busy')),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_typing BOOLEAN DEFAULT FALSE,
    typing_in_channel UUID REFERENCES channels(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for user_presence
CREATE INDEX idx_user_presence_status ON user_presence(status);
CREATE INDEX idx_user_presence_last_seen ON user_presence(last_seen_at);

-- Enable RLS on user_presence
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- Policies for user_presence
CREATE POLICY "user_presence_select_policy" 
    ON user_presence FOR SELECT 
    USING (true);

CREATE POLICY "user_presence_insert_policy" 
    ON user_presence FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "user_presence_update_policy" 
    ON user_presence FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for channels
CREATE TRIGGER update_channels_updated_at 
    BEFORE UPDATE ON channels 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for messages
CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for chat_profiles
CREATE TRIGGER update_chat_profiles_updated_at 
    BEFORE UPDATE ON chat_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired typing indicators
CREATE OR REPLACE FUNCTION cleanup_expired_typing_indicators()
RETURNS void AS $$
BEGIN
    DELETE FROM typing_indicators 
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STORAGE BUCKET FOR ATTACHMENTS
-- ============================================

-- Create a storage bucket for chat attachments (if not exists)
-- Note: You may need to create this through the Supabase UI
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('chat-attachments', 'chat-attachments', true);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert default channels (uncomment if you want sample data)
/*
INSERT INTO channels (name, description, type, created_by) 
VALUES 
    ('General', 'General discussion for everyone', 'channel', NULL),
    ('Random', 'Random conversations and fun', 'channel', NULL),
    ('Tech Talk', 'Technology discussions and support', 'channel', NULL);
*/

-- ============================================
-- REALTIME SUBSCRIPTIONS (for live updates)
-- ============================================

-- Enable realtime for all tables
BEGIN;
  -- Add tables to the publication (if not already added)
  -- Note: You may need to adjust this based on your Supabase setup
  -- publication supabase_realtime should already exist
COMMIT;

-- ============================================
-- VIEWS (for easier querying)
-- ============================================

-- View for channel details with member count
CREATE OR REPLACE VIEW channel_details AS
SELECT 
    c.*,
    COUNT(cm.id) as member_count,
    json_agg(
        json_build_object(
            'user_id', cm.user_id,
            'role', cm.role,
            'joined_at', cm.joined_at
        )
    ) as members
FROM channels c
LEFT JOIN channel_members cm ON c.id = cm.channel_id
GROUP BY c.id;

-- View for messages with sender details
CREATE OR REPLACE VIEW message_details AS
SELECT 
    m.*,
    json_build_object(
        'id', cp.id,
        'username', cp.username,
        'full_name', cp.full_name,
        'avatar_url', cp.avatar_url,
        'is_verified', cp.is_verified
    ) as sender,
    json_agg(
        json_build_object(
            'emoji', mr.emoji,
            'count', COUNT(mr.id),
            'users', array_agg(mr.user_id)
        )
    ) as reactions
FROM messages m
LEFT JOIN chat_profiles cp ON m.sender_id = cp.id
LEFT JOIN message_reactions mr ON m.id = mr.message_id
GROUP BY m.id, cp.id, cp.username, cp.full_name, cp.avatar_url, cp.is_verified;

-- ============================================
-- END OF SCHEMA
-- ============================================
