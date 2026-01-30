import React, { useState, useEffect } from 'react';
import { Post, UserProfile } from '../types';
import { DB } from '../services/storageService';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'grid' | 'list' | 'saved' | 'tagged'>('grid');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(DB.getUser());
  }, []);

  const togglePrivacy = () => {
    if (!user) return;
    const newStatus = user.privacy === 'PUBLIC' ? 'ENCRYPTED' : 'PUBLIC';
    const updatedUser = { ...user, privacy: newStatus };
    setUser(updatedUser);
    DB.saveUser({ privacy: newStatus });
  };

  const mockPosts: Post[] = Array.from({ length: 9 }).map((_, i) => ({
    id: `p${i}`,
    author: user?.username || 'User',
    avatar: user?.avatar || '',
    content: 'Code snippet',
    image: `https://picsum.photos/seed/${i + 100}/400/400`,
    likes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 50),
    shares: 10,
    isVerified: true,
    timestamp: '1d ago',
    isModerated: true
  }));

  if (!user) return <div>Loading Profile...</div>;

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
             { id: 'saved', icon: 'fa-bookmark' },
             { id: 'tagged', icon: 'fa-user-tag' }
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

        {/* Grid Content */}
        <div className="p-4">
           {activeTab === 'grid' && (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                 {mockPosts.map(post => (
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
                 {mockPosts.map(post => (
                    <div key={post.id} className="glass-card rounded-xl overflow-hidden">
                       <div className="p-4 flex items-center gap-3">
                          <img src={post.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
                          <div className="text-sm font-bold text-white">{post.author}</div>
                          <i className="fas fa-ellipsis-h ml-auto text-zenith-dim cursor-pointer"></i>
                       </div>
                       <img src={post.image} className="w-full h-auto" alt="post" />
                       <div className="p-4">
                          <div className="flex gap-4 text-xl mb-3">
                             <i className="far fa-heart hover:text-red-500 cursor-pointer transition-colors"></i>
                             <i className="far fa-comment hover:text-blue-500 cursor-pointer transition-colors"></i>
                             <i className="far fa-paper-plane hover:text-green-500 cursor-pointer transition-colors"></i>
                             <i className="far fa-bookmark ml-auto hover:text-yellow-500 cursor-pointer transition-colors"></i>
                          </div>
                          <div className="font-bold text-sm mb-1">{post.likes} likes</div>
                          <p className="text-sm text-gray-300">
                             <span className="font-bold text-white mr-2">{post.author}</span>
                             {post.content}
                          </p>
                          <div className="text-xs text-zenith-dim mt-2 uppercase">{post.timestamp}</div>
                       </div>
                    </div>
                 ))}
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