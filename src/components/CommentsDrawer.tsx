import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user_id: string;
    // You might want to join with profiles to get user info
}

interface CommentsDrawerProps {
  postId: string; // Corrected from number to string
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void; // Optional callback
}

const CommentsDrawer: React.FC<CommentsDrawerProps> = ({ postId, isOpen, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
        const {data: {user}} = await supabase.auth.getUser();
        if(user) setUserId(user.id);
    }
    getUserId();
  }, []);

  const fetchComments = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*, profiles(username, avatar_url)') // Example of joining with profiles
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
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
        await fetchComments(); // Refetch all comments to get the latest
        setNewComment('');
        await supabase.rpc('increment_post_comments', { post_id_arg: postId });
        onCommentAdded?.(); // Call the callback if it exists
      }

    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-[#1c1c1c] text-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
        <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                <h2 className="text-xl font-bold">Commentaires</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><FontAwesomeIcon icon={faTimes} size="lg" /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2">
                {loading ? <p className="text-center text-gray-400">Chargement...</p> : 
                    comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3">
                           {/* Replace with actual avatar */}
                           <div className="w-8 h-8 bg-gray-600 rounded-full flex-shrink-0"></div>
                           <div className="flex-grow">
                                <p className="text-sm">
                                    <span className="font-bold text-gray-200 mr-2">{(comment as any).profiles?.username || 'Anonyme'}</span>
                                    {comment.content}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(comment.created_at).toLocaleDateString()}</p>
                           </div>
                        </div>
                    ))
                }
                {comments.length === 0 && !loading && <p className="text-gray-400 text-center pt-10">Soyez le premier à commenter.</p>}
            </div>

            {userId ? (
                <form onSubmit={handleAddComment} className="mt-auto border-t border-gray-700 pt-3">
                    <input 
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Laissez un commentaire..."
                        className="w-full bg-[#2a2a2a] text-white placeholder-gray-400 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </form>
            ) : (
                <p className="text-center text-sm text-gray-400 mt-auto border-t border-gray-700 pt-4">Vous devez être connecté pour commenter.</p>
            )}
        </div>
    </div>
  );
};

export default CommentsDrawer;
