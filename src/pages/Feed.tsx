
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Post, Story, UserProfile } from '../types';
import { getPosts, togglePostLike } from '../lib/supabaseService';
import { getUser } from '../services/storageService';
import PostCard from '../components/PostCard';
import CommentsDrawer from '../components/CommentsDrawer';
import { mapSupabaseRowToPost } from '../utils/mapSupabaseRowToPost';
import Icon from '../components/Icon';

// Mock data for stories
const mockStories: Story[] = [
  { id: '1', user: 'You', username: 'miracleikari', avatar: 'https://picsum.photos/seed/you/200/200', image: '', isSeen: false },
  { id: '2', user: 'Sarah', username: 'sarah.c', avatar: 'https://picsum.photos/seed/sarah/200/200', image: '', isSeen: false },
  { id: '3', user: 'Mike', username: 'mike_w', avatar: 'https://picsum.photos/seed/mike/200/200', image: '', isSeen: false },
  { id: '4', user: 'Lana', username: 'lanadel', avatar: 'https://picsum.photos/seed/lana/200/200', image: '', isSeen: true },
  { id: '5', user: 'Chris', username: 'chris.p', avatar: 'https://picsum.photos/seed/chris/200/200', image: '', isSeen: true },
  { id: '6', user: 'Zoe', username: 'zoe_k', avatar: 'https://picsum.photos/seed/zoe/200/200', image: '', isSeen: false },
  { id: '7', user: 'David', username: 'david_b', avatar: 'https://picsum.photos/seed/david/200/200', image: '', isSeen: false },
];

const StoryCircle: React.FC<{ story: Story }> = ({ story }) => (
    <div className="flex flex-col items-center space-y-1">
        <div className={`w-16 h-16 rounded-full p-0.5 flex items-center justify-center bg-black ${story.isSeen ? 'bg-gray-700' : 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600'}`}>
            <div className="w-full h-full bg-black rounded-full p-0.5">
                <img src={story.avatar} alt={story.user} className="w-full h-full rounded-full object-cover" />
            </div>
        </div>
        <p className="text-xs text-center text-white truncate w-16">{story.user}</p>
    </div>
);

const Feed: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [isLoading, setIsLoading] = useState(true);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(getUser());
  }, []);

  const refreshFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: postsData, error: postsError } = await getPosts();
      if (postsError) throw postsError;
      const mappedPosts = (postsData || []).map(p => mapSupabaseRowToPost(p, {}, {}, new Set()));
      setPosts(mappedPosts);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);

  const toggleLike = useCallback(async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    setPosts(currentPosts => currentPosts.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
    await togglePostLike(id, !post.isLiked);
  }, [posts]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center bg-black"><Icon icon="spinner" spin={true} className="text-4xl text-white"/></div>;
  }

  return (
    <div className="w-full h-full bg-black text-white md:bg-zenith-bg">
        {/* Header for Desktop */}
        <header className="hidden md:flex items-center justify-between p-4 border-b border-gray-800">
            <h1 className="font-tech text-2xl text-white tracking-widest">ZENITH FEED</h1>
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/studio')} className="text-white">
                    <Icon icon="plus-square-regular" className="text-2xl" />
                </button>
                <button className="text-white">
                    <Icon icon="heart-regular" className="text-2xl" />
                </button>
                <button className="text-white">
                    <Icon icon="paper-plane-regular" className="text-2xl" />
                </button>
            </div>
        </header>

        <div className="w-full h-full md:pt-4 overflow-y-auto scrollbar-hide">
            {/* User Profile Section */}
            {currentUser && (
                <div className="hidden md:flex items-center justify-between p-4 my-4 max-w-lg mx-auto">
                    <div className="flex items-center">
                        <img src={currentUser.avatar || 'https://picsum.photos/seed/profile/200/200'} alt="Your Profile" className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400" />
                        <div className="ml-4">
                            <p className="font-bold text-lg">{currentUser.username}</p>
                            <p className="text-sm text-gray-400">Welcome back!</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate(`/profile`)} 
                        className="py-2 px-4 bg-cyan-500/80 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors">
                        View Profile
                    </button>
                </div>
            )}

            {/* Stories Bar */}
            <div className="w-full px-2 py-3 border-b border-gray-800">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                    {stories.map(story => <StoryCircle key={story.id} story={story} />)}
                </div>
            </div>

            {/* Posts Feed */}
            <div className="w-full max-w-lg mx-auto pb-20 md:pb-4">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} onComment={() => setCommentPostId(post.id)} />
                ))}
            </div>
        </div>

        <CommentsDrawer postId={commentPostId ?? ''} isOpen={!!commentPostId} onClose={() => setCommentPostId(null)} onCommentAdded={refreshFeed} />
    </div>
  );
};

export default Feed;
