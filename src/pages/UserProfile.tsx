import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileByUsername, getUserPosts, getProfileStats } from '../lib/profileService';
import { Profile } from '../types';
import SafeImage from '../components/SafeImage';

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');

  useEffect(() => {
    const loadPageData = async () => {
      if (!username) return;

      setLoading(true);
      try {
        // 1. Get profile by username
        const { data: profileData, error: profileError } = await getProfileByUsername(username);

        if (profileError || !profileData) {
          throw profileError || new Error('Profil non trouvé');
        }

        setProfile(profileData);

        // 2. Use the profile ID to get posts and stats
        const [postsResponse, statsResponse] = await Promise.all([
          getUserPosts(profileData.id),
          getProfileStats(profileData.id),
        ]);

        if (postsResponse.error) throw postsResponse.error;
        setPosts(postsResponse.data || []);

        if (statsResponse.error) throw statsResponse.error;
        setStats(statsResponse);

      } catch (error) {
        console.error('Erreur chargement profil:', error);
        setProfile(null); // This will trigger the "not found" message
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [username, navigate]);

  const getStatusColor = () => {
    // Simuler un statut en ligne (à remplacer par une vraie logique)
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-zenith-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-white mb-2">Profil introuvable</h1>
        <p className="text-zenith-dim mb-6">L'utilisateur @{username} n'existe pas</p>
        <button
          onClick={() => navigate('/community')}
          className="px-6 py-3 bg-zenith-green text-black font-bold rounded-lg hover:shadow-[0_0_15px_var(--z-primary)] transition-all"
        >
          Retour au réseau
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header du Profil */}
      <div className="bg-zinc-950 border border-zenith-green rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar avec bordure néon */}
          <div className="relative">
            <div className={`w-32 h-32 rounded-full border-4 ${getStatusColor()} p-1 shadow-[0_0_20px_rgba(0,255,0,0.5)]`}>
              <SafeImage
                src={profile.avatar_url || ''}
                alt={profile.username}
                fallbackSeed={profile.username}
                className="w-full h-full rounded-full bg-zinc-800"
              />
            </div>
            {profile.is_verified && (
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-zinc-950">
                <i className="fas fa-check text-white text-sm"></i>
              </div>
            )}
          </div>

          {/* Infos du profil */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white font-mono">
                @{profile.username}
              </h1>
              {profile.is_verified && (
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/30">
                  VÉRIFIÉ
                </span>
              )}
            </div>
            
            <p className="text-zenith-dim mb-4 font-mono text-sm">
              {profile.full_name}
            </p>

            {profile.bio && (
              <p className="text-white mb-6 font-mono text-sm leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.posts}</div>
                <div className="text-xs text-zenith-dim uppercase">Fragments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.followers}</div>
                <div className="text-xs text-zenith-dim uppercase">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.following}</div>
                <div className="text-xs text-zenith-dim uppercase">Following</div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-zenith-green text-black font-bold rounded-lg hover:shadow-[0_0_15px_var(--z-primary)] transition-all">
                S'abonner
              </button>
              <button className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 text-sm font-bold transition-all ${
            activeTab === 'posts'
              ? 'border-b-2 border-zenith-green text-white'
              : 'text-zenith-dim hover:text-white'
          }`}
        >
          📸 Posts
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-6 py-3 text-sm font-bold transition-all ${
            activeTab === 'saved'
              ? 'border-b-2 border-zenith-green text-white'
              : 'text-zenith-dim hover:text-white'
          }`}
        >
          💾 Enregistrés
        </button>
      </div>

      {/* Grille de contenu */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {activeTab === 'posts' ? (
          posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
              >
                <SafeImage
                  src={post.image_url || 'https://picsum.photos/seed/post/400/400'}
                  alt="Post"
                  fallbackSeed={post.id}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <div className="text-white flex items-center gap-2">
                    <i className="fas fa-heart"></i>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="text-white flex items-center gap-2">
                    <i className="fas fa-comment"></i>
                    <span className="font-bold">0</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <div className="text-4xl mb-4">📸</div>
              <p className="text-zenith-dim">Aucun post pour le moment</p>
            </div>
          )
        ) : (
          <div className="col-span-3 text-center py-12">
            <div className="text-4xl mb-4">💾</div>
            <p className="text-zenith-dim">Aucun contenu enregistré</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
