-- ============================================
-- ZENITH OS - Notifications System Schema
-- Activity Feed similar to Instagram
-- ============================================

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Target user (who receives the notification)
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Actor (who performed the action)
    actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    actor_username VARCHAR(255),
    actor_avatar TEXT,
    
    -- Action type
    type VARCHAR(50) NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'mention', 'reply', 'repost', 'message')),
    
    -- Related content
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    
    -- Notification content
    message TEXT,
    preview_text TEXT, -- Short preview of the content
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- For grouping similar notifications (optional)
    group_id UUID,
    group_count INTEGER DEFAULT 1
);

-- Indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_actor_id ON notifications(actor_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "notifications_select_own" 
    ON notifications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_system" 
    ON notifications FOR INSERT 
    TO authenticated 
    WITH CHECK (true); -- Allow system to create notifications

CREATE POLICY "notifications_update_own" 
    ON notifications FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" 
    ON notifications FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Create notification on like
-- ============================================
CREATE OR REPLACE FUNCTION create_like_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create notification if the liker is not the post owner
    IF NEW.user_id != (SELECT author_id FROM posts WHERE id = NEW.post_id) THEN
        INSERT INTO notifications (
            user_id,
            actor_id,
            actor_username,
            actor_avatar,
            type,
            post_id,
            message
        )
        SELECT 
            p.author_id,
            NEW.user_id,
            cp.username,
            cp.avatar_url,
            'like',
            NEW.post_id,
            cp.username || ' a aimé votre post'
        FROM posts p
        LEFT JOIN chat_profiles cp ON cp.id = NEW.user_id
        WHERE p.id = NEW.post_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for likes
DROP TRIGGER IF EXISTS trg_create_like_notification ON post_likes;
CREATE TRIGGER trg_create_like_notification
    AFTER INSERT ON post_likes
    FOR EACH ROW
    EXECUTE FUNCTION create_like_notification();

-- ============================================
-- FUNCTION: Create notification on comment
-- ============================================
CREATE OR REPLACE FUNCTION create_comment_notification()
RETURNS TRIGGER AS $$
DECLARE
    post_author UUID;
    mentioned_users TEXT[];
    mentioned_user TEXT;
BEGIN
    -- Get post author
    SELECT author_id INTO post_author FROM posts WHERE id = NEW.post_id;
    
    -- Create notification for post author (if not the commenter)
    IF NEW.author_id != post_author THEN
        INSERT INTO notifications (
            user_id,
            actor_id,
            actor_username,
            actor_avatar,
            type,
            post_id,
            comment_id,
            message,
            preview_text
        )
        SELECT 
            post_author,
            NEW.author_id,
            cp.username,
            cp.avatar_url,
            'comment',
            NEW.post_id,
            NEW.id,
            cp.username || ' a commenté votre post',
            substring(NEW.content from 1 for 100)
        FROM chat_profiles cp
        WHERE cp.id = NEW.author_id;
    END IF;
    
    -- Check for @mentions in comment
    mentioned_users := array_agg(matches[1]) FROM regexp_matches(NEW.content, '@(\w+)', 'g') AS matches;
    
    FOREACH mentioned_user IN ARRAY mentioned_users
    LOOP
        INSERT INTO notifications (
            user_id,
            actor_id,
            actor_username,
            actor_avatar,
            type,
            post_id,
            comment_id,
            message,
            preview_text
        )
        SELECT 
            cp.id,
            NEW.author_id,
            sender_cp.username,
            sender_cp.avatar_url,
            'mention',
            NEW.post_id,
            NEW.id,
            sender_cp.username || ' vous a mentionné dans un commentaire',
            substring(NEW.content from 1 for 100)
        FROM chat_profiles cp
        CROSS JOIN chat_profiles sender_cp
        WHERE cp.username = mentioned_user 
        AND sender_cp.id = NEW.author_id
        AND cp.id != NEW.author_id; -- Don't notify self
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comments
DROP TRIGGER IF EXISTS trg_create_comment_notification ON comments;
CREATE TRIGGER trg_create_comment_notification
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION create_comment_notification();

-- ============================================
-- FUNCTION: Create notification on follow
-- ============================================
CREATE OR REPLACE FUNCTION create_follow_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (
        user_id,
        actor_id,
        actor_username,
        actor_avatar,
        type,
        message
    )
    SELECT 
        NEW.following_id,
        NEW.follower_id,
        cp.username,
        cp.avatar_url,
        'follow',
        cp.username || ' a commencé à vous suivre'
    FROM chat_profiles cp
    WHERE cp.id = NEW.follower_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for follows (requires a follows table)
-- DROP TRIGGER IF EXISTS trg_create_follow_notification ON follows;
-- CREATE TRIGGER trg_create_follow_notification
--     AFTER INSERT ON follows
--     FOR EACH ROW
--     EXECUTE FUNCTION create_follow_notification();

-- ============================================
-- FUNCTION: Mark notification as read
-- ============================================
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE notifications 
    SET is_read = TRUE, read_at = NOW()
    WHERE id = notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Mark all notifications as read
-- ============================================
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
    UPDATE notifications 
    SET is_read = TRUE, read_at = NOW()
    WHERE user_id = auth.uid() AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEW: Notification details with actor info
-- ============================================
CREATE OR REPLACE VIEW notification_details AS
SELECT 
    n.*,
    json_build_object(
        'id', actor.id,
        'username', actor.username,
        'full_name', actor.full_name,
        'avatar_url', actor.avatar_url,
        'is_verified', actor.is_verified
    ) as actor,
    CASE 
        WHEN n.post_id IS NOT NULL THEN json_build_object(
            'id', p.id,
            'content', substring(p.content from 1 for 100),
            'image_url', p.image_url
        )
        ELSE NULL
    END as post,
    CASE 
        WHEN n.comment_id IS NOT NULL THEN json_build_object(
            'id', c.id,
            'content', substring(c.content from 1 for 100)
        )
        ELSE NULL
    END as comment
FROM notifications n
LEFT JOIN chat_profiles actor ON n.actor_id = actor.id
LEFT JOIN posts p ON n.post_id = p.id
LEFT JOIN comments c ON n.comment_id = c.id;

-- ============================================
-- REALTIME: Enable realtime for notifications
-- ============================================
-- Add table to supabase_realtime publication
-- This allows listening to new notifications via WebSocket

-- Note: In Supabase, you typically do this via the dashboard:
-- Database > Replication > supabase_realtime > Add notifications table

-- ============================================
-- END OF SCHEMA
-- ============================================
