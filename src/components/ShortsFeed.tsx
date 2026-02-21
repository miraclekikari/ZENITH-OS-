import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Post } from '../types';
import CommentsDrawer from './CommentsDrawer';
import Icon from './Icon';

interface ShortProps {
  post: Post;
  onComment: (postId: string) => void;
  isIntersecting: boolean;
}

const Short: React.FC<ShortProps> = ({ post, onComment, isIntersecting }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  useEffect(() => {
    if (isIntersecting) {
      videoRef.current?.play();
    } else {
      if (videoRef.current) { // Check if ref exists before assignment
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isIntersecting]);

  const handleLike = async () => {
    const newLikes = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setIsLiked(!isLiked);

    if (post.id) {
        await supabase.rpc('increment_post_likes', { post_id_arg: post.id, increment_value: isLiked ? -1 : 1 });
    }
  };

  return (
    <div className="w-full h-full snap-start relative flex items-center justify-center">
      <video ref={videoRef} src={post.image} loop muted playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-20 right-2 flex flex-col items-center gap-4 text-white z-10">
        <div className="flex flex-col items-center">
          <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full border-2 border-white mb-2"/>
          <button className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center -mt-5">
            <Icon icon="plus" className="text-sm"/>
          </button>
        </div>
        <button onClick={handleLike} className="flex flex-col items-center">
          <Icon icon={isLiked ? 'heart-solid' : 'heart-regular'} className={`text-3xl ${isLiked ? 'text-red-500' : 'text-white'}`} />
          <span className="font-bold text-sm">{likes}</span>
        </button>
        <button onClick={() => onComment(post.id)} className="flex flex-col items-center">
          <Icon icon="comment-dots-regular" className="text-3xl" />
          <span className="font-bold text-sm">{post.comments}</span>
        </button>
      </div>
      <div className="absolute bottom-5 left-4 text-white z-10">
        <h3 className="font-bold">@{post.username}</h3>
        <p className="text-sm">{post.content}</p>
      </div>
    </div>
  );
};


const ShortsFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [intersectingPost, setIntersectingPost] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchShorts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, profiles(*)`)
        .eq('post_type', 'video')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shorts:', error);
      } else {
        // Map Supabase data to Post type
        const mappedPosts: Post[] = data.map((row: any) => ({
            id: row.id,
            author: row.profiles?.full_name || 'Unknown',
            username: row.profiles?.username || 'unknown',
            avatar: row.profiles?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=default',
            content: row.content,
            image: row.image_url,
            likes: row.likes_count,
            comments: row.comments_count,
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
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8 // 80% of the video needs to be visible
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIntersectingPost(entry.target.getAttribute('data-post-id'));
        }
      });
    }, options);

    return () => observerRef.current?.disconnect();
  }, []);

  const postElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    postElementsRef.current.forEach(el => {
      if (el) observerRef.current?.observe(el);
    });
    return () => {
      postElementsRef.current.forEach(el => {
        if (el) observerRef.current?.unobserve(el);
      });
    }
  }, [posts]);

  return (
    <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide bg-black">
      {posts.map((post, index) => (
        <div 
          key={post.id} 
          ref={el => postElementsRef.current[index] = el}
          data-post-id={post.id}
          className="h-full w-full snap-start"
        >
          <Short 
            post={post}
            onComment={setCommentPostId}
            isIntersecting={intersectingPost === post.id}
          />
        </div>
      ))}
      <CommentsDrawer postId={commentPostId ?? ''} isOpen={!!commentPostId} onClose={() => setCommentPostId(null)} />
    </div>
  );
};

export default ShortsFeed;
