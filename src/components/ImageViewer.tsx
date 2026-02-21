import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faHeart as faHeartSolid, faComment } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { supabase } from '../lib/supabaseClient';
import { Post } from '../types/profile';
import CommentsDrawer from './CommentsDrawer';

interface ImageViewerProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ post, isOpen, onClose }) => {
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (!userId || !post) return;

    const checkLikeStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('post_likes')
          .select('*')
          .eq('post_id', post.id)
          .eq('user_id', userId)
          .single();
        
        setIsLiked(!error && !!data);
      } catch (err) {
        // Error implies not liked, which is the default
      }
    };

    checkLikeStatus();
    setLikeCount(post.likes_count || 0);

  }, [post, userId]);

  const handleLike = async () => {
    if (!userId) return; // Must be logged in to like

    if (isLiked) {
      // Unlike
      const { error } = await supabase.from('post_likes').delete().match({ post_id: post.id, user_id: userId });
      if (!error) {
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        // Decrement on the posts table
        await supabase.rpc('decrement_post_likes', { post_id_arg: post.id });
      }
    } else {
      // Like
      const { error } = await supabase.from('post_likes').insert({ post_id: post.id, user_id: userId });
      if (!error) {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        // Increment on the posts table
        await supabase.rpc('increment_post_likes', { post_id_arg: post.id });
      }
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col md:flex-row items-center justify-center" onClick={onClose}>
      <div className="relative w-full h-full md:w-3/4 md:h-auto p-4" onClick={(e) => e.stopPropagation()}>
        <img src={post.image_url} alt={post.caption || 'Post image'} className="w-full h-full object-contain" />
      </div>
      
      <div className="w-full md:w-1/4 h-full bg-[#1c1c1c] text-white flex flex-col p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex-grow overflow-y-auto">
            <div className="flex items-center mb-4">
                {/* Placeholder for user avatar/name */}
                <div className="w-10 h-10 bg-gray-600 rounded-full mr-3"></div>
                <span className="font-bold">{post.user_id}</span> { /* Replace with profile username later */}
            </div>
            <p className="mb-4 text-gray-300">{post.caption}</p>

            <div className="flex items-center space-x-4 mb-4">
                <button onClick={handleLike} className="flex items-center space-x-2 text-lg">
                    <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeartRegular} className={`${isLiked ? 'text-red-500' : 'text-white'} transition-transform duration-200 hover:scale-125`} />
                    <span>{likeCount}</span>
                </button>
                <button onClick={() => setIsCommentsDrawerOpen(true)} className="flex items-center space-x-2 text-lg">
                    <FontAwesomeIcon icon={faComment} />
                    <span>{post.comments_count || 0}</span>
                </button>
            </div>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl"><FontAwesomeIcon icon={faTimes} /></button>
      </div>

      <CommentsDrawer postId={post.id} isOpen={isCommentsDrawerOpen} onClose={() => setIsCommentsDrawerOpen(false)} />
    </div>
  );
};

export default ImageViewer;
