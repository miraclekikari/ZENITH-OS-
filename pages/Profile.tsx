import React, { useState, useEffect } from 'react';
import { Post, UserProfile } from '../types';
import { DB } from '../services/storageService';
import { SkillMatrix } from '../components/SkillMatrix';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'grid' | 'list' | 'saved' | 'neural'>('grid');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const currentUser = DB.getUser();
    setUser(currentUser);
    
    if (currentUser) {
        // Initialize mock posts with state
        const initialPosts: Post[] = Array.from({ length: 9 }).map((_, i) => ({
            id: `p${i}`,
            author: currentUser.username,
            avatar: currentUser.avatar,
            content: i % 2 === 0 ? 'Deploying new neural architecture to the main grid. #CyberSec #AI' : 'Just hit Level 5 clearance! The restricted sectors are wild.',
            image: `https://picsum.photos/seed/${i + 200}/600/400`,
            likes: Math.floor(Math.random() * 500) + 50,
            comments: Math.floor(Math.random() * 50) + 5,
            shares: Math.floor(Math.random() * 20),
            isVerified: true,
            timestamp: `${i + 1}d ago`,
            isModerated: true,
            isLiked: false,
            isReposted: false
        }));
        setPosts(initialPosts);
    }
  }, []);

  const togglePrivacy = () => {
    if (!user) return;
    const newStatus = user.privacy === 'PUBLIC' ? 'ENCRYPTED' : 'PUBLIC';
    const updatedUser = { ...user, privacy: newStatus };
    setUser(updatedUser);
    DB.saveUser({ privacy: newStatus });
  };

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked
        };
      }
      return p;
    }));
  };

  const toggleRepost = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          shares: p.isReposted ? p.shares - 1 : p.shares + 1,
          isReposted: !p.isReposted
        };
      }
      return p;
    }));
  };

  if (!user) return <div className="p-10 text-center text-zenith-green animate-pulse">Initializing Profile Link...</div>;

  return (
    <div className="animate-fade-in pb-20">
      
      {/* Header Profile Section */}
      <div className="max-w-5xl mx-auto">
        
        {/* Banner */}
        <div className="h-60 rounded-b-3xl overflow-hidden relative border-b border-zenith-greenDim">
           <img src={user.banner} className="w-full h-full object-cover opacity-80" alt="banner" />
           <div className="absolute inset-0 bg-gradient-to-t from-zenith-bg to-transparent"></div>
        </div>

        {/* Profile Info */}
        <div className="px-6 md:px-12 relative -mt-20 flex flex-col md:flex-row items-end md:items-start gap-6">
           
           {/* Avatar */}
           <div className="relative group">
             <div className={`w-40 h-40 rounded-full p-1 bg-zenith-bg border-4 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] ${user.privacy === 'ENCRYPTED' ? 'border-red-500' : 'border-zenith-green'}`}>
               <img src={user.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="avatar" />
             </div>
             <button className="absolute bottom-2 right-2 bg-zenith-surface border border-zenith-green text-zenith-green p-2 rounded-full hover:bg-zenith-green hover:text-black transition-colors">
               <i className="fas fa-camera"></i>
             </button>
           </div>

           {/* Details */}
           <div className="flex-1 mt-4 md:mt-20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h1 className="text-3xl font-tech text-white flex items-center gap-2">
                       {user.username} 
                       {user.role === 'ROOT' && <i className="fas fa-shield-alt text-red-500 text-xl" title="Root Admin"></i>}
                       {user.role === 'USER' && <i className="fas fa-check-circle text-blue-500 text-xl" title="Verified"></i>}
                    </h1>
                    <div className="text-zenith-dim font-mono text-lg">{user.handle}</div>
                 </div>
                 
                 <div className="flex gap-3">
                    <button onClick={togglePrivacy} className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${user.privacy === 'ENCRYPTED' ? 'bg-red-500/20 text-red-500 border border-red-500' : 'bg-zenith-green/20 text-zenith-green border border-zenith-green'}`}>
                       <i className={`fas ${user.privacy === 'ENCRYPTED' ? 'fa-lock' : 'fa-lock-open'}`}></i>
                       {user.privacy === 'ENCRYPTED' ? 'PRIVATE' : 'PUBLIC'}
                    </button>
                    <button onClick={() => setIsEditing(true)} className="bg-zenith-surface border border-zenith-greenDim text-white px-6 py-2 rounded-lg font-bold hover:bg-white/5 transition-all">
                       Edit Profile
                    </button>
                 </div>
              </div>

              <p className="mt-4 text-gray-300 max-w-2xl leading-relaxed">{user.bio}</p>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-zenith-dim">
                 {user.website && <span className="flex items-center gap-1 hover:text-zenith-green cursor-pointer"><i className="fas fa-link"></i> {user.website}</span>}
                 {user.location && <span className="flex items-center gap-1"><i className="fas fa-map-marker-alt"></i> {user.location}</span>}
                 <span className="flex items-center gap-1"><i className="fas fa-calendar-alt"></i> ID: {user.id}</span>
              </div>

              {/* Stats Row */}
              <div className="flex gap-8 mt-6 border-y border-zenith-greenDim py-4">
                 <div className="cursor-pointer hover:text-zenith-green transition-colors">
                    <span className="font-bold text-white text-lg block">{user.postsCount}</span>
                    <span className="text-xs text-zenith-dim uppercase">Posts</span>
                 </div>
                 <div className="cursor-pointer hover:text-zenith-green transition-colors">
                    <span className="font-bold text-white text-lg block">{user.followers}</span>
                    <span className="text-xs text-zenith-dim uppercase">Followers</span>
                 </div>
                 <div className="cursor-pointer hover:text-zenith-green transition-colors">
                    <span className="font-bold text-white text-lg block">{user.following}</span>
                    <span className="text-xs text-zenith-dim uppercase">Following</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Badges Scroll */}
        <div className="px-6 md:px-12 mt-6 overflow-x-auto pb-2">
           <div className="flex gap-3">
              {user.badges.map(badge => (
                 <div key={badge} className="flex items-center gap-2 bg-zenith-surface border border-zenith-greenDim px-3 py-1.5 rounded-full whitespace-nowrap">
                    <i className="fas fa-medal text-yellow-500"></i>
                    <span className="text-xs font-bold text-white">{badge}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* Content Tabs */}
        <div className="flex justify-center mt-8 border-b border-zenith-greenDim sticky top-0 bg-zenith-bg/95 backdrop-blur z-20">
           {[
             { id: 'grid', icon: 'fa-th' },
             { id: 'list', icon: 'fa-bars' },
             { id: 'neural', icon: 'fa-project-diagram' },
             { id: 'saved', icon: 'fa-bookmark' },
           ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 text-center border-b-2 transition-all ${activeTab === tab.id ? 'border-zenith-green text-zenith-green' : 'border-transparent text-zenith-dim hover:text-white'}`}
              >
                 <i className={`fas ${tab.icon} text-lg`}></i>
              </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="p-4">
           {activeTab === 'grid' && (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                 {posts.map(post => (
                    <div key={post.id} className="aspect-square bg-zenith-surface relative group overflow-hidden cursor-pointer">
                       <img src={post.image} className="w-full h-full object-cover" alt="post" />
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                          <div className="flex items-center gap-2"><i className="fas fa-heart"></i> {post.likes}</div>
                          <div className="flex items-center gap-2"><i className="fas fa-comment"></i> {post.comments}</div>
                       </div>
                    </div>
                 ))}
              </div>
           )}

           {activeTab === 'list' && (
              <div className="max-w-2xl mx-auto space-y-6">
                 {posts.map(post => (
                    <div key={post.id} className="glass-card rounded-xl overflow-hidden hover:border-zenith-green transition-all duration-300">
                       <div className="p-4 flex items-center gap-3">
                          <img src={post.avatar} className="w-10 h-10 rounded-full border border-zenith-greenDim" alt="avatar" />
                          <div>
                            <div className="text-sm font-bold text-white hover:underline cursor-pointer">{post.author}</div>
                            <div className="text-xs text-zenith-dim">{post.timestamp}</div>
                          </div>
                          <button className="ml-auto text-zenith-dim hover:text-white"><i className="fas fa-ellipsis-h"></i></button>
                       </div>
                       
                       <div className="px-4 pb-2 text-sm text-gray-300 leading-relaxed">
                          {post.content}
                       </div>

                       {post.image && (
                         <div className="mt-2">
                           <img src={post.image} className="w-full h-auto object-cover max-h-[500px]" alt="post" />
                         </div>
                       )}

                       {/* Action Bar */}
                       <div className="p-4 flex items-center justify-between border-t border-white/5 mt-2 select-none">
                          
                          {/* Like */}
                          <button 
                             onClick={() => toggleLike(post.id)}
                             className={`group flex items-center gap-2 transition-colors duration-300 ${post.isLiked ? 'text-pink-500' : 'text-zenith-dim hover:text-pink-500'}`}
                          >
                             <div className={`p-2 rounded-full ${post.isLiked ? 'bg-pink-500/10' : 'group-hover:bg-pink-500/10'} transition-all`}>
                               <i className={`${post.isLiked ? 'fas' : 'far'} fa-heart text-xl ${post.isLiked ? 'scale-110 animate-pulse-fast' : 'group-active:scale-90'} transition-transform`}></i>
                             </div>
                             <span className="font-mono font-bold text-sm">{post.likes}</span>
                          </button>

                          {/* Comment */}
                          <button className="group flex items-center gap-2 text-zenith-dim hover:text-blue-500 transition-colors duration-300">
                             <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-all">
                               <i className="far fa-comment text-xl group-active:scale-90 transition-transform"></i>
                             </div>
                             <span className="font-mono font-bold text-sm">{post.comments}</span>
                          </button>

                          {/* Repost */}
                          <button 
                             onClick={() => toggleRepost(post.id)}
                             className={`group flex items-center gap-2 transition-colors duration-300 ${post.isReposted ? 'text-green-500' : 'text-zenith-dim hover:text-green-500'}`}
                          >
                             <div className={`p-2 rounded-full ${post.isReposted ? 'bg-green-500/10' : 'group-hover:bg-green-500/10'} transition-all`}>
                               <i className={`fas fa-retweet text-xl transition-transform ${post.isReposted ? 'rotate-180 text-green-500' : 'group-hover:rotate-180'}`}></i>
                             </div>
                             <span className="font-mono font-bold text-sm">{post.shares}</span>
                          </button>

                          {/* Share */}
                          <button className="group text-zenith-dim hover:text-yellow-500 transition-colors">
                             <div className="p-2 rounded-full group-hover:bg-yellow-500/10 transition-all">
                               <i className="far fa-bookmark text-xl group-active:scale-90"></i>
                             </div>
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           )}

           {activeTab === 'neural' && (
             <div className="max-w-5xl mx-auto">
                <SkillMatrix />
             </div>
           )}
           
           {activeTab === 'saved' && (
             <div className="flex flex-col items-center justify-center py-20 text-zenith-dim">
               <i className="far fa-bookmark text-4xl mb-4"></i>
               <p>No saved transmissions.</p>
             </div>
           )}
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-lg rounded-2xl p-6 relative animate-scale-up">
               <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-zenith-dim hover:text-white">
                  <i className="fas fa-times text-xl"></i>
               </button>
               <h2 className="text-2xl font-tech text-white mb-6">Edit Profile</h2>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-zenith-dim mb-1">Display Name</label>
                     <input type="text" defaultValue={user.username} className="w-full bg-black/40 border border-zenith-greenDim rounded p-2 text-white" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-zenith-dim mb-1">Bio</label>
                     <textarea defaultValue={user.bio} className="w-full bg-black/40 border border-zenith-greenDim rounded p-2 text-white h-24 resize-none"></textarea>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-zenith-dim mb-1">Website</label>
                     <input type="text" defaultValue={user.website} className="w-full bg-black/40 border border-zenith-greenDim rounded p-2 text-white" />
                  </div>
                  <button onClick={() => setIsEditing(false)} className="w-full bg-zenith-green text-black font-bold py-3 rounded-lg mt-4 hover:brightness-110">
                     Save Changes
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Profile;