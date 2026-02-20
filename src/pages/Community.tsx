import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Post } from '../types';
import { getPosts, togglePostLike } from '../lib/supabaseService';
import PostCard from '../components/PostCard';
import CommentsDrawer from '../components/CommentsDrawer';
import { mapSupabaseRowToPost } from '../utils/mapSupabaseRowToPost';
import Icon from '../components/Icon';

const Community: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);

  const refreshFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: postsData, error: postsError } = await getPosts();
      if (postsError) {
        console.error('Feed Error:', postsError.message);
        setPosts([]);
        return;
      }
      const mappedPosts = (postsData || []).map(p => mapSupabaseRowToPost(p, {}, {}, new Set()));
      setPosts(mappedPosts);
    } catch (err) {
      console.error(err);
      setPosts([]);
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
    await togglePostLike(id, post.isLiked);
  }, [posts]);

  const handleComment = useCallback((id: string) => {
    setCommentPostId(id);
  }, []);

  if (isLoading) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zenith-bg text-zenith-green font-mono">
            <div className="w-12 h-12 border-4 border-zenith-green border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>{t('loadingTransmissions')}</p>
        </div>
    );
  }

  return (
    <div className="w-full h-full bg-zenith-bg relative">
      <div className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} onComment={() => handleComment(post.id)} />
        ))}
      </div>

      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/70 to-transparent flex items-center justify-center pointer-events-none z-10">
          <h1 className="font-tech text-xl text-white tracking-widest">{t('neuralFeed')}</h1>
      </div>

      <button onClick={() => navigate('/publish')} className="absolute bottom-24 md:bottom-6 right-6 w-14 h-14 bg-zenith-green text-black rounded-full shadow-[0_0_20px_var(--z-primary)] flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-transform z-20">
        <Icon icon="fas fa-plus" />
      </button>

      <CommentsDrawer postId={commentPostId ?? ''} isOpen={!!commentPostId} onClose={() => setCommentPostId(null)} onCommentAdded={refreshFeed} />
    </div>
  );
};

export default Community;
