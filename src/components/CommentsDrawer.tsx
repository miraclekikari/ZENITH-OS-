import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user_id: string;
    // Add profile info if you want to display username/avatar
}

interface CommentsDrawerProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}

const CommentsDrawer: React.FC<CommentsDrawerProps> = ({ postId, isOpen, onClose }) => {
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

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*') // Consider selecting specific columns + user profile
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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userId) return;

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({ post_id: postId, user_id: userId, content: newComment.trim() })
        .select();

      if (error) throw error;
      
      // Optimistically add comment to UI
      if (data) {
        setComments([...comments, data[0]]);
        setNewComment('');
        // Increment comments_count on the post
        await supabase.rpc('increment_post_comments', { post_id_arg: postId });
      }

    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-[#2f3136] text-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
        <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Commentaires</h2>
                <button onClick={onClose}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto mb-4">
                {loading ? <p>Chargement...</p> : 
                    comments.map(comment => (
                        <div key={comment.id} className="mb-3 p-2 rounded-lg bg-black/20">
                            <div className="flex items-center mb-1">
                                {/* Add user avatar here */}
                                <p className="font-bold text-sm text-green-400">{comment.user_id.substring(0, 8)}...</p> {/* Replace with actual username */}
                            </div>
                            <p className="text-gray-300">{comment.content}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(comment.created_at).toLocaleString()}</p>
                        </div>
                    ))
                }
                 {comments.length === 0 && !loading && <p className="text-gray-400 text-center">Aucun commentaire pour l'instant.</p>}
            </div>

            {userId && (
                <form onSubmit={handleAddComment} className="mt-auto">
                    <input 
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        className="w-full bg-[#40444b] text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none"
                    />
                </form>
            )}
        </div>
    </div>
  );
};

export default CommentsDrawer;
