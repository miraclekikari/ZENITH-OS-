import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEdit, faExternalLinkAlt, faMapMarkerAlt, faHeart, faComment, faBookmark, faEllipsisH, faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { Profile, Post } from '../types/profile';
import { supabase } from '../lib/supabaseClient';
import ImageViewer from './ImageViewer';

interface InstagramProfileProps {
  profileId: string;
  isOwnProfile?: boolean;
}

const InstagramProfile: React.FC<InstagramProfileProps> = ({ profileId, isOwnProfile = false }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    if (!isOwnProfile) {
      checkFollowStatus();
    }
  }, [profileId, isOwnProfile]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_profiles') // This should probably be 'profiles' to match the chat
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) throw error;
      setProfile(data);
      setFollowersCount(data.followers_count || 0);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const checkFollowStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', profileId)
        .single();

      setIsFollowing(!error && !!data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (isFollowing) {
        await supabase.from('followers').delete().eq('follower_id', user.id).eq('following_id', profileId);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        await supabase.from('followers').insert({ follower_id: user.id, following_id: profileId });
        setFollowersCount(prev => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setShowImageViewer(true);
  };

  // ... (handleBannerUpload and handleAvatarUpload remain the same)

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zenith-primary"></div></div>;
  }

  if (!profile) {
    return <div className="text-center py-8"><p className="text-gray-500">Profile not found</p></div>;
  }
  
  const isStreaming = profile.status === 'streaming';

  return (
    <div className="max-w-4xl mx-auto bg-white">
       {/* ... (Banner code remains the same) */}
      <div className="px-4 pb-4">
          <div className="flex items-start justify-between -mt-16">
            <div className="relative">
              {/* LIVE Indicator Logic */}
              {isStreaming && (
                <div className="absolute -inset-1.5 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse-fast"></div>
                    <div className="relative w-32 h-32 rounded-full border-4 border-white"></div>
                    <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                        LIVE
                    </div>
                </div>
              )}
              <div className={`w-32 h-32 rounded-full border-4 shadow-2xl overflow-hidden relative ${isStreaming ? 'border-red-500' : 'border-white'}`}>
                <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200">
                  {profile.avatar_url ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center"><span className="text-white text-3xl font-bold">{profile.username.charAt(0).toUpperCase()}</span></div>}
                </div>
              </div>
              {isOwnProfile && <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 bg-zenith-primary text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-zenith-primary/80 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-white"><FontAwesomeIcon icon={faCamera} className="text-sm" /></button>}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}/>
            </div>

             {/* ... (Rest of the component remains the same) */}
        </div>
       </div>
    </div>
  );
};

export default InstagramProfile;
