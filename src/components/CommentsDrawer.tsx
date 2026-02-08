import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { DEFAULT_USER_ID } from '../lib/constants';

export interface CommentRow {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at?: string;
}

interface CommentsDrawerProps {
  postId: string;
  postAuthor?: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  postId,
  postAuthor,
  isOpen,
  onClose,
  onCommentAdded
}) => {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('id, post_id, user_id, content, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (!error) setComments((data ?? []) as CommentRow[]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (isOpen && postId) fetchComments();
  }, [isOpen, postId, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const { error } = await supabase.from('comments').insert({
        id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        post_id: postId,
        user_id: DEFAULT_USER_ID,
        content: text
      });
      if (!error) {
        setInput('');
        await fetchComments();
        onCommentAdded?.();
      }
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:z-50"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-0 right-0 bottom-0 z-50 bg-zenith-surface border-t border-zenith-greenDim rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col max-h-[85vh] animate-slide-up"
        role="dialog"
        aria-label="Commentaires"
      >
        <div className="p-4 border-b border-zenith-greenDim flex items-center justify-between">
          <h3 className="font-tech text-white text-sm tracking-wider">COMMENTAIRES CHIFFRÉS</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zenith-dim hover:text-white transition-colors p-2"
            aria-label="Fermer"
          >
            <i className="fas fa-times text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-zenith-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-zenith-dim text-sm text-center py-6">Aucun commentaire. Soyez le premier.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <img src={`https://picsum.photos/seed/${encodeURIComponent(String(c.user_id))}/64/64`} alt="" className="w-8 h-8 rounded-full flex-shrink-0 object-cover bg-zenith-greenDim/50" />
                <div className="flex-1 min-w-0">
                  <p className="text-zenith-dim text-[10px] font-mono">{c.user_id}</p>
                  <p className="text-white text-sm break-words">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-zenith-greenDim bg-black/40">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrire un commentaire..."
              className="flex-1 bg-black/50 border border-zenith-greenDim rounded-xl px-4 py-3 text-white placeholder-zenith-dim focus:outline-none focus:border-zenith-green text-sm"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="px-5 py-3 bg-zenith-green text-black font-bold rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_var(--z-primary)] transition-all"
            >
              {sending ? <i className="fas fa-spinner fa-spin" /> : 'OK'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CommentsDrawer;
