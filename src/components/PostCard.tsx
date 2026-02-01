import React, { useState } from 'react';
import { DB } from '../services/storageService';

interface PostProps {
  post: any;
}

const PostCard: React.FC<PostProps> = ({ post }) => {
  const [showHeart, setShowHeart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // 1. Logique Double Tap (TikTok/Insta Style)
  const handleDoubleTap = (e: React.MouseEvent) => {
    // On détecte le double clic
    if (e.detail === 2) {
      setShowHeart(true);
      setIsLiked(true);
      DB.toggleLike(post.id);
      
      if (navigator.vibrate) navigator.vibrate(50);
      
      // On cache le cœur après l'animation
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  // 2. Logique Partage
  const handleShare = async () => {
    const shareData = {
      title: 'Zenith Transmission',
      text: post.caption,
      url: window.location.origin + '/post/' + post.id
    };

    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to neural clipboard!");
    }
  };

  return (
    <div className="bg-zenith-surface border border-zenith-greenDim rounded-2xl overflow-hidden mb-6 group">
      {/* Header : Profil */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zenith-green to-blue-500 border border-zenith-greenDim"></div>
        <div>
          <div className="text-white font-bold text-sm">Zenith_Explorer</div>
          <div className="text-zenith-dim text-[10px]">TRANSMISSION ENCRYPTED</div>
        </div>
      </div>

      {/* Media avec Double Tap */}
      <div className="relative aspect-square bg-black flex items-center justify-center cursor-pointer" onClick={handleDoubleTap}>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="content" className="w-full h-full object-cover" />
        )}
        
        {/* L'animation du cœur qui pop */}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <i className="fas fa-heart text-white text-8xl animate-ping opacity-75"></i>
          </div>
        )}
      </div>

      {/* Barre d'actions "Lourde" */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-5">
            <button onClick={() => setIsLiked(!isLiked)} className={`transition-transform active:scale-150 ${isLiked ? 'text-red-500' : 'text-white'}`}>
              <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-2xl`}></i>
            </button>
            <button className="text-white hover:text-zenith-green transition-colors">
              <i className="far fa-comment text-2xl"></i>
            </button>
            <button className="text-white hover:text-zenith-green transition-colors" title="Repost">
              <i className="fas fa-retweet text-2xl"></i>
            </button>
            <button onClick={handleShare} className="text-white hover:text-zenith-green transition-colors">
              <i className="far fa-paper-plane text-2xl"></i>
            </button>
          </div>
          <button className="text-white hover:text-zenith-green">
            <i className="far fa-bookmark text-2xl"></i>
          </button>
        </div>

        {/* Caption & Commentaires */}
        <div className="space-y-2">
          <p className="text-white text-sm">
            <span className="font-bold mr-2">Zenith_Explorer</span>
            {post.caption}
          </p>
          <button className="text-zenith-dim text-xs font-bold uppercase tracking-widest hover:text-white">
            View all 12 encrypted comments
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
