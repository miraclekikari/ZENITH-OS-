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
        .from('profiles') // Corrected to 'profiles' table
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
      // This error is expected if the user isn't following, so we can ignore it.
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

  const handleBannerUpload = async (file: File) => {
    if (!isOwnProfile || !profile) return;
    try {
      const fileName = `public/${profile.id}/banner.jpg`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
      await supabase.from('profiles').update({ banner_url: publicUrl }).eq('id', profile.id);
      setProfile({ ...profile, banner_url: publicUrl });
    } catch (error) {
      console.error('Error uploading banner:', error);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!isOwnProfile || !profile) return;
    try {
      const fileName = `public/${profile.id}/avatar.jpg`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
      setProfile({ ...profile, avatar_url: publicUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zenith-primary"></div></div>;
  }

  if (!profile) {
    return <div className="text-center py-8"><p className="text-gray-500">Profile not found</p></div>;
  }
  
  const isStreaming = profile.status === 'streaming';

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="relative h-48 md:h-64 bg-gray-200 overflow-hidden">
        {profile.banner_url && <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover"/>}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <button onClick={() => bannerInputRef.current?.click()} className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl">
              <FontAwesomeIcon icon={faCamera} className="mr-2 text-gray-700" />
              <span className="text-gray-700 font-medium">Edit Banner</span>
            </button>
            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0])}/>
          </div>
        )}
      </div>

        <div className="px-4 pb-4">
          <div className="flex items-start justify-between -mt-16">
            <div className="relative">
              {isStreaming && (
                <>
                  <div className="absolute -inset-1 rounded-full bg-red-500 animate-pulse-fast"></div>
                   <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg z-10">LIVE</div>
                </>
              )}
              <div className={`relative w-32 h-32 rounded-full border-4 shadow-2xl overflow-hidden bg-gray-300 ${isStreaming ? 'border-red-500' : 'border-white'}`}>
                  {profile.avatar_url ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center"><span className="text-white text-3xl font-bold">{profile.username.charAt(0).toUpperCase()}</span></div>}
              </div>
              {isOwnProfile && <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 bg-zenith-primary text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-zenith-primary/80 transition-all duration-200 shadow-lg border-2 border-white"><FontAwesomeIcon icon={faCamera} className="text-sm" /></button>}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}/>
            </div>

            <div className="flex gap-2 mt-20">
              {isOwnProfile ? (
                <>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"><FontAwesomeIcon icon={faEdit} className="mr-2" />Edit Profile</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"><FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />Share Profile</button>
                </>
              ) : (
                <>
                  <button onClick={handleFollow} className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${isFollowing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-zenith-primary text-black hover:bg-zenith-primary/80'}`}>
                    <FontAwesomeIcon icon={isFollowing ? faUserMinus : faUserPlus} className="mr-2" />
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">Message</button>
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"><FontAwesomeIcon icon={faEllipsisH} /></button>
                </>
              )}
            </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2"><h2 className="text-xl font-bold text-gray-900">{profile.username}</h2>{profile.is_verified && <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">✓</span></div>}</div>
          <div className="flex gap-6 mt-2 text-sm">
              <span className="font-medium text-gray-900"><strong>{posts.length}</strong> posts</span>
              <span className="font-medium text-gray-900"><strong>{followersCount}</strong> followers</span>
              <span className="font-medium text-gray-900"><strong>{profile.following_count}</strong> following</span>
          </div>
          <div className="mt-3">
            <p className="text-gray-900">{profile.bio}</p>
            {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-1 block"><FontAwesomeIcon icon={faExternalLinkAlt} className="mr-1" />{profile.website}</a>}
            {profile.location && <p className="text-gray-500 mt-1"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />{profile.location}</p>}
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6">
          <div className="flex">
            {[
              { id: 'posts', label: 'POSTS', icon: null },
              { id: 'saved', label: 'SAVED', icon: faBookmark },
              { id: 'tagged', label: 'TAGGED', icon: null }
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-3 text-xs font-medium border-t ${activeTab === tab.id ? 'border-t-gray-900 text-gray-900' : 'border-t-transparent text-gray-400 hover:text-gray-600'} transition-colors`}>
                {tab.icon && <FontAwesomeIcon icon={tab.icon} className="mr-1" />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <div key={post.id} className="relative aspect-square group cursor-pointer" onClick={() => handlePostClick(post)}>
                  <img src={post.image_url} alt={post.caption} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1"><FontAwesomeIcon icon={faHeart} />{post.likes_count}</span>
                      <span className="flex items-center gap-1"><FontAwesomeIcon icon={faComment} />{post.comments_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {showImageViewer && selectedPost && (
        <ImageViewer post={selectedPost} isOpen={showImageViewer} onClose={() => setShowImageViewer(false)} />
      )}
    </div>
  );
};

export default InstagramProfile;
