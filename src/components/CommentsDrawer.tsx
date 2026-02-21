import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: { username: string; avatar_url: string };
}

interface CommentsDrawerProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

const CommentsDrawer: React.FC<CommentsDrawerProps> = ({ postId, isOpen, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUserId();
  }, []);

  const fetchComments = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*, profiles(username, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setComments(data || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchComments();
  }, [isOpen, postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userId || !postId) return;

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({ post_id: postId, user_id: userId, content: newComment.trim() })
        .select();
      if (error) throw error;
      if (data) {
        await fetchComments();
        setNewComment('');
        try { await supabase.rpc('increment_post_comments', { post_id_arg: postId }); } catch { /* ignore */ }
        onCommentAdded?.();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-[#111]/95 backdrop-blur-xl border-l border-white/[0.06] text-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06] flex-shrink-0">
              <h2 className="font-bold text-base">Comments</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {loading && (
                <div className="flex items-center justify-center py-10">
                  <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                </div>
              )}

              {!loading && comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <img
                    src={(comment as any).profiles?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=default'}
                    alt="avatar"
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-bold text-white/80 mr-2">
                        {(comment as any).profiles?.username || 'Anonymous'}
                      </span>
                      <span className="text-white/60">{comment.content}</span>
                    </p>
                    <p className="text-[11px] text-white/20 mt-1">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}

              {!loading && comments.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-white/20 text-sm">Be the first to comment.</p>
                </div>
              )}
            </div>

            {/* Input */}
            {userId ? (
              <form onSubmit={handleAddComment} className="p-4 border-t border-white/[0.06] flex-shrink-0">
                <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 py-2 border border-white/[0.06]">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/20 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="text-emerald-400 disabled:text-white/10 transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 border-t border-white/[0.06] text-center">
                <p className="text-white/20 text-sm">Sign in to comment</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommentsDrawer;
