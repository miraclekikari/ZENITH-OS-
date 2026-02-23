import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '../types';
import { timeAgo } from '../utils/timeAgo';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const handleDoubleClick = () => {
    if (!post.isLiked) {
      onLike(post.id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  return (
    <article className="bg-[#0a0a0a] md:bg-[#111] md:rounded-xl md:border md:border-white/[0.06] mb-3 md:mb-5 overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-purple-500 p-[2px] flex-shrink-0">
          <img
            src={post.avatar}
            alt={post.author}
            className="w-full h-full rounded-full object-cover bg-[#0a0a0a]"
            crossOrigin="anonymous"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-white truncate">{post.username}</span>
            {post.isVerified && <BadgeCheck size={14} className="text-cyan-400 flex-shrink-0" />}
            {post.location && (
              <span className="text-xs text-white/30 truncate hidden sm:inline">
                {'- '}{post.location}
              </span>
            )}
          </div>
        </div>
        <button className="text-white/40 hover:text-white/70 transition-colors flex-shrink-0">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Image */}
      {post.image && (
        <div
          className="w-full bg-black flex items-center justify-center relative cursor-pointer select-none"
          onDoubleClick={handleDoubleClick}
        >
          <img
            src={post.image}
            alt="Post content"
            className="w-full max-h-[70vh] object-contain"
            crossOrigin="anonymous"
          />
          {/* Heart animation on double click */}
          <AnimatePresence>
            {showHeartAnim && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Heart size={80} className="text-white fill-white drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.75 }}
            onClick={() => onLike(post.id)}
            className="transition-colors"
          >
            <Heart
              size={24}
              className={post.isLiked ? 'text-red-500 fill-red-500' : 'text-white hover:text-white/60'}
            />
          </motion.button>
          <button onClick={() => onComment(post.id)} className="text-white hover:text-white/60 transition-colors">
            <MessageCircle size={24} />
          </button>
          <button className="text-white hover:text-white/60 transition-colors">
            <Send size={22} />
          </button>
        </div>
        <button className="text-white hover:text-white/60 transition-colors">
          <Bookmark size={24} />
        </button>
      </div>

      {/* Post Info */}
      <div className="px-3 pb-3 space-y-1">
        <p className="font-bold text-sm text-white">{post.likes.toLocaleString()} likes</p>
        <p className={`text-sm text-white/80 ${isExpanded ? '' : 'line-clamp-2'}`}>
          <span className="font-bold text-white mr-1.5">{post.username}</span>
          {post.content}
        </p>
        {post.content.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/30 text-sm hover:text-white/50 transition-colors"
          >
            {isExpanded ? 'less' : 'more'}
          </button>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-cyan-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={() => onComment(post.id)}
          className="text-white/25 text-sm hover:text-white/40 transition-colors"
        >
          View all {post.comments} comments
        </button>
        <p className="text-white/15 text-[11px] uppercase tracking-wider">{timeAgo(post.timestamp)}</p>
      </div>
    </article>
  );
};

export default PostCard;
