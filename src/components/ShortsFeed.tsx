import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '../types';
import CommentsDrawer from './CommentsDrawer';
import {
  Heart,
  MessageCircle,
  Share2,
  Music2,
  Plus,
  Bookmark,
} from 'lucide-react';

// Mock video posts for when Supabase is not connected
const mockShorts: Post[] = [
  {
    id: 'short-1', author: 'CyberDancer', username: 'cyber.dancer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dancer',
    content: 'Neon city vibes at midnight. The future is here.', image: '', likes: 48200, comments: 1340, shares: 5620,
    isVerified: true, timestamp: new Date().toISOString(), isModerated: false,
  },
  {
    id: 'short-2', author: 'TechNova', username: 'tech.nova', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=technova',
    content: 'Building the next generation of social platforms. ZENITH OS demo.', image: '', likes: 23100, comments: 890, shares: 2100,
    isVerified: true, timestamp: new Date().toISOString(), isModerated: false,
  },
  {
    id: 'short-3', author: 'PixelArt', username: 'pixel.art', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=pixel',
    content: 'Digital art process - from sketch to final render in 60 seconds', image: '', likes: 67800, comments: 2100, shares: 8900,
    isVerified: false, timestamp: new Date().toISOString(), isModerated: false,
  },
];

interface ShortVideoProps {
  post: Post;
  onComment: (postId: string) => void;
  isActive: boolean;
}

const ShortVideo: React.FC<ShortVideoProps> = ({ post, onComment, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const handleLike = async () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
    if (post.id) {
      try { await supabase.rpc('increment_post_likes', { post_id_arg: post.id, increment_value: isLiked ? -1 : 1 }); } catch { /* ignore */ }
    }
  };

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  };

  return (
    <div className="w-full h-full snap-start relative flex items-center justify-center bg-black">
      {/* Video or placeholder */}
      {post.image ? (
        <video ref={videoRef} src={post.image} loop muted playsInline className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a] flex items-center justify-center">
          <div className="text-center px-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Music2 size={32} className="text-white/20" />
            </div>
            <p className="text-white/20 text-sm">Video content</p>
          </div>
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

      {/* Right-side floating action buttons */}
      <div className="absolute right-3 bottom-24 md:bottom-20 flex flex-col items-center gap-5 z-10">
        {/* Profile */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <img
              src={post.avatar}
              alt={post.author}
              className="w-11 h-11 rounded-full border-2 border-white"
              crossOrigin="anonymous"
            />
            <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-black">
              <Plus size={12} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Like */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleLike}
          className="flex flex-col items-center gap-1"
        >
          <div className={`w-11 h-11 rounded-full ${isLiked ? 'bg-red-500/20' : 'bg-white/10'} backdrop-blur-md flex items-center justify-center transition-colors`}>
            <Heart
              size={24}
              className={isLiked ? 'text-red-500 fill-red-500' : 'text-white'}
            />
          </div>
          <span className="text-white text-[11px] font-bold">{formatCount(likes)}</span>
        </motion.button>

        {/* Comment */}
        <button onClick={() => onComment(post.id)} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-white text-[11px] font-bold">{formatCount(post.comments)}</span>
        </button>

        {/* Bookmark */}
        <button onClick={() => setIsSaved(!isSaved)} className="flex flex-col items-center gap-1">
          <div className={`w-11 h-11 rounded-full ${isSaved ? 'bg-amber-500/20' : 'bg-white/10'} backdrop-blur-md flex items-center justify-center transition-colors`}>
            <Bookmark size={22} className={isSaved ? 'text-amber-400 fill-amber-400' : 'text-white'} />
          </div>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
            <Share2 size={22} className="text-white" />
          </div>
          <span className="text-white text-[11px] font-bold">{formatCount(post.shares)}</span>
        </button>

        {/* Music disc */}
        <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden animate-spin" style={{ animationDuration: '5s' }}>
          <img
            src={post.avatar}
            alt="music"
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-4 right-20 z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-white text-sm">@{post.username}</span>
          {post.isVerified && (
            <div className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">{'>'}</span>
            </div>
          )}
        </div>
        <p className="text-white/80 text-sm line-clamp-2 leading-relaxed">{post.content}</p>
        {/* Music bar */}
        <div className="flex items-center gap-2 mt-3">
          <Music2 size={12} className="text-white/50" />
          <div className="overflow-hidden flex-1">
            <p className="text-white/40 text-xs whitespace-nowrap animate-shimmer">
              Original Sound - {post.username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShortsFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const postElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchShorts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(*)')
        .eq('post_type', 'video')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setPosts(mockShorts);
      } else {
        const mappedPosts: Post[] = data.map((row: any) => ({
          id: row.id,
          author: row.profiles?.full_name || 'Unknown',
          username: row.profiles?.username || 'unknown',
          avatar: row.profiles?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=default',
          content: row.content,
          image: row.image_url,
          likes: row.likes_count || 0,
          comments: row.comments_count || 0,
          shares: 0,
          isVerified: row.profiles?.is_verified || false,
          timestamp: row.created_at,
          isModerated: false,
        }));
        setPosts(mappedPosts);
      }
    };
    fetchShorts();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePostId(entry.target.getAttribute('data-post-id'));
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.8 }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    postElementsRef.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });
    return () => {
      postElementsRef.current.forEach((el) => {
        if (el) observerRef.current?.unobserve(el);
      });
    };
  }, [posts]);

  return (
    <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide bg-black">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={(el) => { postElementsRef.current[index] = el; }}
          data-post-id={post.id}
          className="h-full w-full snap-start"
        >
          <ShortVideo post={post} onComment={setCommentPostId} isActive={activePostId === post.id} />
        </div>
      ))}
      <CommentsDrawer postId={commentPostId ?? ''} isOpen={!!commentPostId} onClose={() => setCommentPostId(null)} />
    </div>
  );
};

export default ShortsFeed;
