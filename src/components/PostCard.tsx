import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types';
import SafeImage from './SafeImage';
import Icon from './Icon';

interface PostProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
}

const PostCard: React.FC<PostProps> = ({ post, onLike, onComment }) => {
  const [showHeart, setShowHeart] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (post.username) navigate(`/profile/${post.username}`);
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    if (e.detail === 2) {
      if (!post.isLiked) onLike?.(); // Like only if not already liked
      setShowHeart(true);
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  const handleShare = async () => {
    const shareData = { url: `${window.location.origin}/post/${post.id}` };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto snap-start animate-fade-in" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Media container with double-tap like */}
      <div className="absolute inset-0 bg-black rounded-xl overflow-hidden cursor-pointer" onClick={handleDoubleTap}>
        <SafeImage 
          src={post.image || ''} 
          alt="Post content" 
          fallbackSeed={post.id}
          className="w-full h-full object-cover"
        />
        {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Icon icon="fa-heart" className="fas fa-heart text-white/90 text-8xl animate-ping opacity-75" />
            </div>
        )}
      </div>

      {/* Vertical Action Bar (TikTok Style) */}
      <div className="absolute right-0 bottom-24 md:bottom-16 flex flex-col items-center gap-5 p-4 z-10">
        <ActionButton icon="fa-heart" count={post.likes} isActivated={post.isLiked} onClick={onLike} />
        <ActionButton icon="fa-comment-dots" count={post.comments} onClick={onComment} />
        <ActionButton icon="fa-share" onClick={handleShare} />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pt-20 bg-gradient-to-t from-black/80 to-transparent z-10 text-white">
        <div className="flex items-center gap-3 mb-2">
            <div onClick={handleProfileClick} className="w-10 h-10 rounded-full cursor-pointer flex-shrink-0">
                <SafeImage src={post.avatar} alt={post.author} fallbackSeed={post.username} className="w-full h-full rounded-full" />
            </div>
            <div onClick={handleProfileClick} className="font-bold text-sm cursor-pointer hover:underline">
                @{post.username || post.author}
            </div>
        </div>
        <p className="text-sm line-clamp-3">{post.content}</p>
      </div>
    </div>
  );
};

// Helper component for action buttons
const ActionButton = ({ icon, count, isActivated, onClick }: {
  icon: string; 
  count?: number; 
  isActivated?: boolean;
  onClick?: () => void;
}) => (
    <div className="flex flex-col items-center gap-1">
        <button 
            onClick={onClick} 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all text-2xl active:scale-110 ${isActivated ? 'bg-red-500 text-white' : 'bg-black/50 text-white/90 backdrop-blur-sm'}`}>
            <Icon icon={isActivated ? `fas ${icon}` : `far ${icon}`} />
        </button>
        {count !== undefined && <span className="text-xs text-white/90 font-bold">{count}</span>}
    </div>
);

export default PostCard;
