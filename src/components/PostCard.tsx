import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types';
import SafeImage from './SafeImage';
import Icon from './Icon';

interface PostProps {
  post: Post;
  onLike?: () => void;
  onRepost?: () => void;
  onComment?: () => void;
}

const PostCard: React.FC<PostProps> = ({ post, onLike, onRepost, onComment }) => {
  const [showHeart, setShowHeart] = useState(false);
  const navigate = useNavigate();

  const isLiked = post.isLiked ?? false;
  const isReposted = post.isReposted ?? false;

  const handleProfileClick = () => {
    if (post.username) {
      navigate(`/profile/${post.username}`);
    }
  };

  // 1. Logique Double Tap (TikTok/Insta Style)
  const handleDoubleTap = (e: React.MouseEvent) => {
    if (e.detail === 2) {
      setShowHeart(true);
      onLike?.();
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  // 2. Logique Partage (navigator.share sur mobile et ordi)
  const handleShare = async () => {
    const shareData: ShareData = {
      title: 'Zenith Transmission',
      text: post.content || undefined,
      url: window.location.origin + '/post/' + post.id
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard?.writeText(shareData.url);
          alert('Lien copié dans le presse-papiers.');
        }
      }
    } else {
      await navigator.clipboard?.writeText(shareData.url);
      alert('Lien copié dans le presse-papiers.');
    }
  };

  return (
    <div className="bg-zenith-surface border border-zenith-greenDim rounded-2xl overflow-hidden mb-6 group">
      {/* Header : Profil */}
      <div className="p-4 flex items-center gap-3">
        <div 
          onClick={handleProfileClick}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-zenith-green to-blue-500 border border-zenith-greenDim overflow-hidden cursor-pointer hover:scale-105 transition-transform"
        >
          <SafeImage 
            src={post.avatar} 
            alt={post.author}
            fallbackSeed={post.username || post.author}
            className="w-full h-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div 
              onClick={handleProfileClick}
              className="text-white font-bold text-sm cursor-pointer hover:text-zenith-green transition-colors"
            >
              {post.author}
            </div>
            {post.isVerified && (
              <Icon icon="fa-check" className="fas fa-check text-cyan-400 text-xs" />
            )}
          </div>
          <div className="text-zenith-dim text-[10px]">TRANSMISSION ENCRYPTED</div>
        </div>
      </div>

      {/* Media avec Double Tap */}
      <div className="relative aspect-square bg-black flex items-center justify-center cursor-pointer min-h-[200px]" onClick={handleDoubleTap}>
        {(post.image ?? (post as { imageUrl?: string }).imageUrl) ? (
          <SafeImage 
            src={post.image ?? (post as { imageUrl?: string }).imageUrl!} 
            alt="content"
            fallbackSeed={post.id}
            className="w-full h-full"
          />
        ) : null}
        
        {/* L'animation du cœur qui pop */}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Icon icon="fa-heart" className="fas fa-heart text-white text-8xl animate-ping opacity-75" />
          </div>
        )}
      </div>

      {/* Barre d'actions "Lourde" */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-5 items-center">
            <button onClick={onLike} className={`transition-transform active:scale-150 flex items-center gap-1.5 ${isLiked ? 'text-red-500' : 'text-white'}`} title="Like">
              <Icon icon="fa-heart" className={`${isLiked ? 'fas' : 'far'} fa-heart text-2xl`} />
              {post.likes > 0 && <span className="text-sm">{post.likes}</span>}
            </button>
            <button onClick={onComment} className="text-white hover:text-zenith-green transition-colors flex items-center gap-1.5" title="Commenter">
              <Icon icon="fa-comment" className="far fa-comment text-2xl" />
              {post.comments > 0 && <span className="text-sm">{post.comments}</span>}
            </button>
            <button onClick={onRepost} className={`transition-colors flex items-center gap-1.5 ${isReposted ? 'text-zenith-green' : 'text-white hover:text-zenith-green'}`} title="Repost">
              <Icon icon="fa-retweet" className="fas fa-retweet text-2xl" />
              {post.shares > 0 && <span className="text-sm">{post.shares}</span>}
            </button>
            <button onClick={handleShare} className="text-white hover:text-zenith-green transition-colors" title="Partager">
              <Icon icon="fa-share" className="far fa-paper-plane text-2xl" />
            </button>
          </div>
          <button className="text-white hover:text-zenith-green">
            <Icon icon="fa-bookmark" className="far fa-bookmark text-2xl" />
          </button>
        </div>

        {/* Caption & Commentaires */}
        <div className="space-y-2">
          <p className="text-white text-sm">
            <span className="font-bold mr-2">{post.author}</span>
            {post.content ?? (post as { caption?: string }).caption ?? ''}
          </p>
          {post.comments > 0 && (
            <button onClick={onComment} className="text-zenith-dim text-xs font-bold uppercase tracking-widest hover:text-white">
              Voir les {post.comments} commentaire(s) chiffré(s)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
