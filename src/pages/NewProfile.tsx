import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { formatAvatar } from '../utils/avatar';
import { Profile } from '../types/profile';
import { PostgrestError } from '@supabase/supabase-js';
import { Image, User, AtSign, Calendar, MessageSquare, Heart } from 'lucide-react';

interface Post {
  id: string;
  image_url: string;
  content: string;
  created_at: string;
}

const NewProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null | string>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch user's posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('id, image_url, content, created_at')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false });
        if (postsError) throw postsError;
        setPosts(postsData || []);

      } catch (err: any) {
        setError(err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="w-full h-full flex items-center justify-center text-white/50">Loading Profile...</div>;
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    return <div className="w-full h-full flex items-center justify-center text-red-400">Error: {errorMessage}</div>;
  }

  if (!profile) {
    return <div className="w-full h-full flex items-center justify-center text-white/50">Profile not found.</div>;
  }

  const avatarUrl = formatAvatar(profile.avatar_url, profile.username);

  return (
    <div className="min-h-screen w-full text-white p-4 md:p-8 bg-[#0a0a0a]">
        <header className="w-full max-w-4xl mx-auto bg-[#111]/70 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-emerald-500 to-cyan-500 flex-shrink-0">
                    <img src={avatarUrl} alt={profile.username} className="w-full h-full rounded-full object-cover border-4 border-[#111]" />
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold">{profile.full_name || 'Anonymous User'}</h1>
                    <p className="text-cyan-400 flex items-center justify-center md:justify-start gap-2 mt-1"><AtSign size={16} />{profile.username}</p>
                    <p className="text-white/50 text-sm mt-3 max-w-md">{profile.bio || 'No bio available.'}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-white/40 mt-4">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </header>

        <main className="w-full max-w-4xl mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Image size={20} /> Your Posts</h2>
            {posts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                    {posts.map((post) => (
                        <div key={post.id} className="relative aspect-square group overflow-hidden rounded-xl border border-white/[0.08]">
                            <img src={post.image_url} alt={post.content || 'Post'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                <p className="text-xs text-white/90 truncate">{post.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full text-center py-16 bg-[#111]/70 backdrop-blur-xl border border-dashed border-white/[0.1] rounded-2xl">
                    <Image size={40} className="mx-auto text-white/20 mb-4"/>
                    <h3 className="font-bold text-lg text-white/80">No Posts Yet</h3>
                    <p className="text-sm text-white/40">Start sharing your moments to see them here.</p>
                </div>
            )}
        </main>
    </div>
  );
};

export default NewProfile;
