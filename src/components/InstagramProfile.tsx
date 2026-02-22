import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera, faEdit, faExternalLinkAlt, faMapMarkerAlt,
  faHeart, faComment, faBookmark, faEllipsisH,
  faUserPlus, faUserMinus, faShare, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { Profile, Post } from '../types/profile';
import { supabase } from '../lib/supabaseClient';
import ImageViewer from './ImageViewer';
import AvatarFallback from './AvatarFallback';

interface InstagramProfileProps {
  profileId: string;
  isOwnProfile?: boolean;
}

const InstagramProfile: React.FC<InstagramProfileProps> = ({ profileId, isOwnProfile = false }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
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
        .from('profiles')
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
    } catch {
      // Not following
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40 text-sm">Profile not found</p>
      </div>
    );
  }

  const isStreaming = profile.status === 'streaming';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-64 overflow-hidden rounded-t-2xl bg-white/[0.03]">
        {profile.banner_url ? (
          <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <button
              onClick={() => bannerInputRef.current?.click()}
              className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg cursor-pointer hover:bg-black/70 transition-all border border-white/[0.08] text-white/70 hover:text-white text-sm flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faCamera} className="text-xs" />
              <span>Edit Banner</span>
            </button>
            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0])} />
          </div>
        )}
      </div>

      {/* Profile Info Card */}
      <div className="relative px-4 md:px-8 pb-6 bg-white/[0.02] border border-white/[0.06] border-t-0 rounded-b-2xl backdrop-blur-xl">
        {/* Avatar */}
        <div className="flex items-start justify-between -mt-16 relative z-10">
          <div className="relative">
            {isStreaming && (
              <>
                <div className="absolute -inset-1.5 rounded-full bg-red-500/60 animate-pulse" />
                <div className="absolute -bottom-1 right-0 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg z-10">
                  LIVE
                </div>
              </>
            )}
            <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 shadow-2xl overflow-hidden ${isStreaming ? 'border-red-500' : 'border-[#0a0a0a]'}`}>
              <AvatarFallback
                src={profile.avatar_url}
                name={profile.username}
                size={128}
                className="w-full h-full"
              />
            </div>
            {isOwnProfile && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-emerald-500 text-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-400 transition-all shadow-lg border-2 border-[#0a0a0a]"
              >
                <FontAwesomeIcon icon={faCamera} className="text-xs" />
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-20">
            {isOwnProfile ? (
              <>
                <button className="px-4 py-2 bg-white/[0.06] text-white/80 rounded-lg text-sm font-medium hover:bg-white/[0.1] transition-all border border-white/[0.08] flex items-center gap-2">
                  <FontAwesomeIcon icon={faEdit} className="text-xs" />
                  Edit Profile
                </button>
                <button className="px-4 py-2 bg-white/[0.06] text-white/80 rounded-lg text-sm font-medium hover:bg-white/[0.1] transition-all border border-white/[0.08] flex items-center gap-2">
                  <FontAwesomeIcon icon={faShare} className="text-xs" />
                  Share
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleFollow}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    isFollowing
                      ? 'bg-white/[0.06] text-white/80 border border-white/[0.08] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                      : 'bg-emerald-500 text-black hover:bg-emerald-400'
                  }`}
                >
                  <FontAwesomeIcon icon={isFollowing ? faUserMinus : faUserPlus} className="text-xs" />
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
                <button className="px-4 py-2 bg-white/[0.06] text-white/80 rounded-lg text-sm font-medium hover:bg-white/[0.1] transition-all border border-white/[0.08]">
                  Message
                </button>
                <button className="px-3 py-2 bg-white/[0.06] text-white/60 rounded-lg hover:bg-white/[0.1] transition-all border border-white/[0.08]">
                  <FontAwesomeIcon icon={faEllipsisH} className="text-xs" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Username + Bio */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">{profile.username}</h2>
            {profile.is_verified && (
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 text-sm" />
            )}
          </div>
          {profile.full_name && (
            <p className="text-white/40 text-sm mt-0.5">{profile.full_name}</p>
          )}

          {/* Stats Row */}
          <div className="flex gap-6 mt-4 text-sm">
            <div className="text-center">
              <span className="font-bold text-white block">{posts.length}</span>
              <span className="text-white/30 text-xs uppercase tracking-wider">Posts</span>
            </div>
            <div className="text-center cursor-pointer hover:text-emerald-400 transition-colors">
              <span className="font-bold text-white block">{followersCount}</span>
              <span className="text-white/30 text-xs uppercase tracking-wider">Followers</span>
            </div>
            <div className="text-center cursor-pointer hover:text-emerald-400 transition-colors">
              <span className="font-bold text-white block">{profile.following_count || 0}</span>
              <span className="text-white/30 text-xs uppercase tracking-wider">Following</span>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4">
            {profile.bio && <p className="text-white/70 text-sm leading-relaxed">{profile.bio}</p>}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 text-sm mt-1 block transition-colors">
                <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-1 text-xs" />{profile.website}
              </a>
            )}
            {profile.location && (
              <p className="text-white/30 text-sm mt-1">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-xs" />{profile.location}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-white/[0.06] mt-6">
          <div className="flex">
            {[
              { id: 'posts' as const, label: 'POSTS' },
              { id: 'saved' as const, label: 'SAVED' },
              { id: 'tagged' as const, label: 'TAGGED' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-xs font-semibold tracking-wider border-t-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-white/30 hover:text-white/50'
                }`}
              >
                {tab.id === 'saved' && <FontAwesomeIcon icon={faBookmark} className="mr-1.5" />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="mt-4">
          {activeTab === 'posts' && (
            posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="relative aspect-square group cursor-pointer overflow-hidden rounded-sm"
                    onClick={() => handlePostClick(post)}
                  >
                    <img src={post.image_url} alt={post.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="flex gap-4 text-white text-sm font-semibold">
                        <span className="flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faHeart} />
                          {post.likes_count}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faComment} />
                          {post.comments_count}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-white/20">
                <FontAwesomeIcon icon={faCamera} className="text-3xl mb-3" />
                <p className="text-sm">No posts yet</p>
              </div>
            )
          )}
          {activeTab === 'saved' && (
            <div className="flex flex-col items-center justify-center py-16 text-white/20">
              <FontAwesomeIcon icon={faBookmark} className="text-3xl mb-3" />
              <p className="text-sm">No saved posts</p>
            </div>
          )}
          {activeTab === 'tagged' && (
            <div className="flex flex-col items-center justify-center py-16 text-white/20">
              <FontAwesomeIcon icon={faUserPlus} className="text-3xl mb-3" />
              <p className="text-sm">No tagged posts</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Viewer Modal */}
      {showImageViewer && selectedPost && (
        <ImageViewer post={selectedPost} isOpen={showImageViewer} onClose={() => setShowImageViewer(false)} />
      )}
    </div>
  );
};

export default InstagramProfile;
