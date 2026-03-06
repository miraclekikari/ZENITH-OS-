import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Post, Story } from '../types';
import { getPosts, togglePostLike } from '../lib/supabaseService';
import { getUser } from '../services/storageService';
import PostCard from '../components/PostCard';
import CommentsDrawer from '../components/CommentsDrawer';
import { mapSupabaseRowToPost } from '../utils/mapSupabaseRowToPost';
import { Heart, MessageCircle, PlusSquare, Send, Command } from 'lucide-react';

// Mock stories (structure preserved)
const mockStories: Story[] = [
  { id: '1', user: 'Your Story', username: 'you', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=you', image: '', isSeen: false },
  { id: '2', user: 'Sarah', username: 'sarah.c', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah', image: '', isSeen: false },
  { id: '3', user: 'Mike', username: 'mike_w', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=mike', image: '', isSeen: false },
  { id: '4', user: 'Lana', username: 'lanadel', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=lana', image: '', isSeen: true },
  { id: '5', user: 'Chris', username: 'chris.p', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=chris', image: '', isSeen: true },
  { id: '6', user: 'Zoe', username: 'zoe_k', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=zoe', image: '', isSeen: false },
  { id: '7', user: 'Nova', username: 'nova_x', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nova', image: '', isSeen: false },
  { id: '8', user: 'Aria', username: 'aria.m', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=aria', image: '', isSeen: false },
];

// Mock posts (structure preserved)
const mockPosts: Post[] = [
  {
    id: '1', author: 'NovaAgent', username: 'nova_agent', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nova',
    content: 'Just finished building the new ZENITH interface. The glassmorphism effects are looking incredible. What do you think?',
    image: 'https://picsum.photos/seed/zenith1/600/600', likes: 2847, comments: 142, shares: 89,
    isVerified: true, timestamp: new Date(Date.now() - 3600000).toISOString(), isModerated: false, isLiked: false,
    tags: ['zenith', 'design', 'darkmode'],
  },
  {
    id: '2', author: 'CyberPilot', username: 'cyber_pilot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=cyber',
    content: 'Night coding session. The new Community module with full-screen video scroll is finally live.',
    image: 'https://picsum.photos/seed/zenith2/600/750', likes: 1523, comments: 87, shares: 34,
    isVerified: false, timestamp: new Date(Date.now() - 7200000).toISOString(), isModerated: false, isLiked: true,
    location: 'Tokyo, Japan',
  },
];

const StoryCircle: React.FC<{ story: Story; index: number }> = ({ story, index }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    className="flex flex-col items-center gap-1.5 flex-shrink-0"
  >
    <div className={`w-[66px] h-[66px] rounded-full p-[2px] ${
      story.isSeen
        ? 'bg-white/10'
        : 'bg-gradient-to-tr from-emerald-500 to-cyan-500'
    }`}>
      <div className="w-full h-full bg-[#0a0a0a] rounded-full p-[2px]">
        <img
          src={story.avatar}
          alt={story.user}
          className="w-full h-full rounded-full object-cover"
          crossOrigin="anonymous"
        />
      </div>
    </div>
    <span className={`text-[11px] w-16 text-center truncate ${story.isSeen ? 'text-white/25' : 'text-white/60'}`}>
      {story.user}
    </span>
  </motion.button>
);

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState({ avatar: ''});

  useEffect(() => {
    const fetchUser = async () => {
        const user = await getUser();
        if(user) setCurrentUser(user);
    }
    fetchUser();
  }, [])

  const refreshFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: postsData, error: postsError } = await getPosts();
      if (postsError) throw postsError;
      const mappedPosts = (postsData || []).map((p: any) => mapSupabaseRowToPost(p, {}, {}, new Set()));
      if (mappedPosts.length > 0) {
        setPosts(mappedPosts);
      } else {
        setPosts(mockPosts);
      }
    } catch {
      setPosts(mockPosts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);

  const toggleLike = useCallback(async (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    setPosts((current) =>
      current.map((p) =>
        p.id === id
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
    await togglePostLike(id, !post.isLiked);
  }, [posts]);

  return (
    <div className="w-full h-full bg-[#0a0a0a] text-white">
      <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-white/[0.06] sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-10">
        <h1 className="font-tech text-xl text-white tracking-[0.15em]">ZENITH</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/studio')} className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"><PlusSquare size={22} /></button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"><Heart size={22} /></button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all relative">
            <Send size={20} />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>
        </div>
      </header>

      <div className="w-full h-full overflow-y-auto pb-20 md:pb-4">
        <div className="max-w-lg mx-auto">
          <div className="px-4 md:px-0 py-4 border-b border-white/[0.06]">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
              {mockStories.map((story, index) => <StoryCircle key={story.id} story={story} index={index} />)}
            </div>
          </div>

          <div className="p-4 md:px-0">
            <div className="flex items-center gap-3 bg-black/[0.2] rounded-lg p-3">
                <span className="text-emerald-400 font-mono text-sm whitespace-nowrap">USER@ZENITH_OS:~$</span>
                <input 
                    type="text" 
                    placeholder="Initiate a new broadcast..."
                    className="bg-transparent w-full focus:outline-none text-white/80 placeholder-white/20 text-sm"
                />
            </div>
          </div>
          
          <div className="px-4 md:px-0 flex items-center gap-2.5 text-xs text-emerald-400/70 font-mono uppercase border-b border-t border-white/[0.05] py-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            LIVE STREAM ACTIVE
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>
          )}

          {!isLoading && (
            <div className="pt-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  className="border-b border-white/[0.05] last:border-b-0 transition-all hover:bg-white/[0.02]"
                >
                  <PostCard
                    post={post}
                    onLike={() => toggleLike(post.id)}
                    onComment={() => setCommentPostId(post.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CommentsDrawer
        postId={commentPostId ?? ''}
        isOpen={!!commentPostId}
        onClose={() => setCommentPostId(null)}
        onCommentAdded={refreshFeed}
      />
    </div>
  );
};

export default Feed;