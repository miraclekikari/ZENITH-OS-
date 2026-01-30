import React, { useState, useEffect } from 'react';
import { Post, Story, Community as CommunityType } from '../types';
import { generateCommunityNews } from '../services/geminiService';
import { DB } from '../services/storageService';

const mockStories: Story[] = [
  { id: '1', user: 'Your Story', avatar: 'https://picsum.photos/seed/avatar/200/200', image: '', isSeen: false },
  { id: '2', user: 'DevMike', avatar: 'https://picsum.photos/seed/u2/200/200', image: '', isSeen: false },
  { id: '3', user: 'Sarah_AI', avatar: 'https://picsum.photos/seed/u3/200/200', image: '', isSeen: true },
];

const mockCommunities: CommunityType[] = [
  { id: 'c1', name: 'React Developers', description: 'Components & Hooks', members: 1240, isPrivate: false, topic: 'React.js' },
  { id: 'c2', name: 'CyberSec Elite', description: 'Encrypted Discussions', members: 45, isPrivate: true, topic: 'Cybersecurity' },
  { id: 'c3', name: 'AI Research', description: 'LLMs & Neural Nets', members: 890, isPrivate: false, topic: 'Artificial Intelligence' },
];

const Community: React.FC = () => {
  const [showDM, setShowDM] = useState(false);
  const [news, setNews] = useState<string>("INITIALIZING ZENITH NEWS FEED...");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCommunity, setActiveCommunity] = useState<CommunityType>(mockCommunities[0]);
  
  // Create Sector Form
  const [newSectorName, setNewSectorName] = useState('');
  const [newSectorTopic, setNewSectorTopic] = useState('');
  const [isPrivateSector, setIsPrivateSector] = useState(false);

  const [posts, setPosts] = useState<Post[]>([
    { 
      id: '1', 
      author: 'Zenith Admin', 
      avatar: 'https://picsum.photos/seed/admin/200/200',
      content: 'Titan v7.0 update: Content Moderation AI is now active. All uploads are scanned in real-time.',
      likes: 543, 
      comments: 45, 
      shares: 12, 
      isVerified: true, 
      timestamp: '2h ago',
      image: 'https://picsum.photos/seed/update/600/300',
      isModerated: true,
      isLiked: false
    }
  ]);

  // AI News Ticker Effect
  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      const headline = await generateCommunityNews(activeCommunity.topic);
      if (mounted) setNews(headline);
    };
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Update every minute
    return () => { mounted = false; clearInterval(interval); };
  }, [activeCommunity]);

  const toggleLike = (id: string) => {
    setPosts(posts.map(p => {
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

  const handleCreateSector = () => {
     if(!newSectorName) return;
     // In a real app, this would save to DB
     alert(`Sector "${newSectorName}" Initialized. Encryption: ${isPrivateSector ? 'ON' : 'OFF'}`);
     setShowCreateModal(false);
     setNewSectorName('');
  };

  return (
    <div className="flex h-full relative">
      
      {/* Sidebar Communities (Desktop) */}
      <div className="hidden lg:flex flex-col w-64 pr-6 border-r border-zenith-greenDim mr-6">
        <h3 className="font-tech text-zenith-green mb-4 flex items-center justify-between">
           SECTORS
           <button onClick={() => setShowCreateModal(true)} className="text-xs border border-zenith-green rounded px-2 py-1 hover:bg-zenith-green hover:text-black transition-colors">
             + NEW
           </button>
        </h3>
        <div className="space-y-2">
           {mockCommunities.map(c => (
              <div 
                key={c.id} 
                onClick={() => setActiveCommunity(c)}
                className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between ${activeCommunity.id === c.id ? 'bg-zenith-greenDim border border-zenith-green text-white' : 'hover:bg-white/5 text-zenith-dim'}`}
              >
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-800 to-black flex items-center justify-center font-bold text-xs">
                       {c.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                       <div className="font-bold text-sm">{c.name}</div>
                       <div className="text-[10px] opacity-70">{c.members} mbrs</div>
                    </div>
                 </div>
                 {c.isPrivate && <i className="fas fa-lock text-[10px] text-yellow-500"></i>}
              </div>
           ))}
        </div>
      </div>

      {/* Main Feed */}
      <div className={`flex-1 animate-fade-in pb-20 transition-all duration-300 ${showDM ? 'mr-80 hidden md:block' : ''}`}>
         
         {/* AI News Ticker */}
         <div className="mb-6 bg-black border border-zenith-greenDim rounded-lg p-2 flex items-center gap-3 overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.1)]">
            <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse whitespace-nowrap">
               LIVE FEED
            </div>
            <div className="text-xs font-mono text-zenith-green whitespace-nowrap overflow-hidden">
               <span className="inline-block animate-[expandLine_10s_linear_infinite]">{news}</span>
            </div>
         </div>

         {/* Stories */}
         <div className="flex gap-4 overflow-x-auto pb-4 mb-6 px-1 scrollbar-hide">
            {mockStories.map(story => (
               <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className={`w-16 h-16 rounded-full p-[2px] ${story.isSeen ? 'bg-zenith-dim' : 'bg-gradient-to-tr from-yellow-400 to-zenith-green'} group-hover:scale-105 transition-transform duration-300`}>
                     <img src={story.avatar} className="w-full h-full rounded-full object-cover border-2 border-black" alt="story" />
                  </div>
                  <span className="text-xs text-white truncate w-16 text-center group-hover:text-zenith-green transition-colors">{story.user}</span>
               </div>
            ))}
         </div>

         {/* Feed */}
         <div className="space-y-6">
            {posts.map(post => (
               <div key={post.id} className="glass-card rounded-xl p-5 hover:border-zenith-greenDim transition-colors duration-300">
                  <div className="flex gap-4">
                     <img src={post.avatar} className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80 transition-opacity" alt="author" />
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 overflow-hidden">
                              <span className="font-bold text-white hover:underline cursor-pointer truncate">{post.author}</span>
                              {post.isVerified && <i className="fas fa-check-circle text-blue-500 text-xs" title="Verified Personnel"></i>}
                              <span className="text-zenith-dim text-sm truncate">@{post.author.toLowerCase().replace(' ', '')}</span>
                              <span className="text-zenith-dim text-sm whitespace-nowrap">· {post.timestamp}</span>
                           </div>
                           <button className="text-zenith-dim hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                              <i className="fas fa-ellipsis-h"></i>
                           </button>
                        </div>
                        
                        <p className="mt-2 text-gray-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        
                        {post.image && (
                           <div className="mt-3 rounded-xl overflow-hidden border border-zenith-greenDim">
                              <img src={post.image} className="w-full h-auto object-cover max-h-[500px]" alt="content" />
                           </div>
                        )}
                        
                        {/* Action Bar */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 pr-4">
                           <button className="flex items-center gap-2 group text-zenith-dim hover:text-blue-400 transition-colors duration-300">
                              <div className="relative w-9 h-9 flex items-center justify-center rounded-full group-hover:bg-blue-500/10 group-active:scale-90 transition-all duration-200">
                                 <i className="far fa-comment text-lg group-hover:scale-110 transition-transform duration-200"></i>
                              </div>
                              <span className="text-sm font-mono group-hover:font-bold transition-all">{post.comments}</span>
                           </button>
                           
                           <button className="flex items-center gap-2 group text-zenith-dim hover:text-green-400 transition-colors duration-300">
                              <div className="relative w-9 h-9 flex items-center justify-center rounded-full group-hover:bg-green-500/10 group-active:scale-90 transition-all duration-200">
                                 <i className="fas fa-retweet text-lg group-hover:rotate-180 transition-transform duration-500"></i>
                              </div>
                              <span className="text-sm font-mono group-hover:font-bold transition-all">{post.shares}</span>
                           </button>
                           
                           <button 
                              className={`flex items-center gap-2 group transition-colors duration-300 ${post.isLiked ? 'text-pink-500' : 'text-zenith-dim hover:text-pink-500'}`}
                              onClick={() => toggleLike(post.id)}
                           >
                              <div className={`relative w-9 h-9 flex items-center justify-center rounded-full group-active:scale-75 transition-all duration-200 ${post.isLiked ? 'bg-pink-500/10' : 'group-hover:bg-pink-500/10'}`}>
                                 <i className={`${post.isLiked ? 'fas' : 'far'} fa-heart text-lg ${post.isLiked ? 'animate-scale-up' : 'group-hover:scale-110'} transition-transform duration-200`}></i>
                              </div>
                              <span className="text-sm font-mono group-hover:font-bold transition-all">{post.likes}</span>
                           </button>
                           
                           <button className="flex items-center gap-2 group text-zenith-dim hover:text-cyan-400 transition-colors duration-300">
                              <div className="relative w-9 h-9 flex items-center justify-center rounded-full group-hover:bg-cyan-500/10 group-active:scale-90 transition-all duration-200">
                                 <i className="fas fa-share-alt text-lg group-hover:scale-110 transition-transform duration-200"></i>
                              </div>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Secure Comms Hub (Telegram Style) */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-zenith-surface border-l border-zenith-greenDim transform transition-transform duration-300 z-40 ${showDM ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="h-full flex flex-col">
            <div className="p-4 border-b border-zenith-greenDim flex items-center justify-between">
               <h3 className="font-tech text-white flex items-center gap-2"><i className="fas fa-satellite-dish"></i> COMMS HUB</h3>
               <button onClick={() => setShowDM(false)} className="text-zenith-dim hover:text-white"><i className="fas fa-times"></i></button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-zenith-greenDim/30">
               <button className="flex-1 py-2 text-xs font-bold text-zenith-green border-b border-zenith-green">CHATS</button>
               <button className="flex-1 py-2 text-xs font-bold text-zenith-dim hover:text-white">GROUPS</button>
            </div>

            <div className="p-2">
               <input type="text" placeholder="Encrypt Search..." className="w-full bg-black/50 border border-zenith-greenDim rounded-lg p-2 text-sm text-white focus:border-zenith-green outline-none" />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
               <div className="text-[10px] font-bold text-zenith-dim px-4 py-2 bg-black/20">ENCRYPTED CHANNELS</div>
               {[1,2].map(i => (
                  <div key={`group-${i}`} className="p-3 hover:bg-white/5 cursor-pointer flex gap-3 items-center border-b border-white/5">
                     <div className="w-10 h-10 rounded-lg bg-purple-900/40 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                        <i className="fas fa-users"></i>
                     </div>
                     <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-baseline">
                           <span className="font-bold text-sm text-white truncate">Project_Titan_{i}</span>
                           <span className="text-[10px] text-zenith-dim">1m ago</span>
                        </div>
                        <p className="text-xs text-zenith-dim truncate text-green-400 font-mono">system: encryption keys rotated.</p>
                     </div>
                  </div>
               ))}
               
               <div className="text-[10px] font-bold text-zenith-dim px-4 py-2 bg-black/20 mt-2">DIRECT SIGNALS</div>
               {[1,2,3,4,5].map(i => (
                  <div key={i} className="p-3 hover:bg-white/5 cursor-pointer flex gap-3 items-center border-b border-white/5">
                     <div className="relative">
                        <img src={`https://picsum.photos/seed/chat${i}/50/50`} className="w-10 h-10 rounded-full" alt="user" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zenith-surface"></div>
                     </div>
                     <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-baseline">
                           <span className="font-bold text-sm text-white truncate">User_{i}</span>
                           <span className="text-[10px] text-zenith-dim">12:3{i}</span>
                        </div>
                        <p className="text-xs text-zenith-dim truncate">Hey, did you verify the deployment?</p>
                     </div>
                  </div>
               ))}
            </div>

            <div className="p-4 border-t border-zenith-greenDim text-center grid grid-cols-2 gap-2">
               <button className="bg-zenith-green/10 text-zenith-green border border-zenith-green rounded-lg py-2 text-xs font-bold hover:bg-zenith-green hover:text-black transition-colors">
                  <i className="fas fa-plus mr-1"></i> GROUP
               </button>
               <button className="bg-white/5 text-white border border-zenith-dim rounded-lg py-2 text-xs font-bold hover:bg-white/10 transition-colors">
                  <i className="fas fa-comment mr-1"></i> DM
               </button>
            </div>
         </div>
      </div>

      {/* Floating DM Button */}
      {!showDM && (
         <button 
            onClick={() => setShowDM(true)}
            className="fixed bottom-24 md:bottom-10 right-6 w-14 h-14 bg-zenith-green text-black rounded-full shadow-[0_0_20px_var(--z-primary)] flex items-center justify-center text-2xl hover:scale-110 transition-transform z-30"
         >
            <i className="fas fa-comment-dots"></i>
         </button>
      )}

      {/* Create Sector Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="glass-card w-full max-w-md rounded-2xl p-6 relative animate-scale-up border-zenith-green">
              <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-zenith-dim hover:text-white"><i className="fas fa-times"></i></button>
              <h2 className="text-2xl font-tech text-white mb-6">INITIALIZE SECTOR</h2>
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-bold text-zenith-green mb-1 block">SECTOR NAME</label>
                    <input value={newSectorName} onChange={e => setNewSectorName(e.target.value)} className="w-full bg-black/50 border border-zenith-greenDim rounded p-2 text-white outline-none focus:border-zenith-green" placeholder="e.g. Quantum Computing" />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-zenith-green mb-1 block">PRIMARY TOPIC</label>
                    <input value={newSectorTopic} onChange={e => setNewSectorTopic(e.target.value)} className="w-full bg-black/50 border border-zenith-greenDim rounded p-2 text-white outline-none focus:border-zenith-green" placeholder="e.g. Physics" />
                 </div>
                 <div className="flex items-center gap-3 bg-white/5 p-3 rounded">
                    <input type="checkbox" checked={isPrivateSector} onChange={() => setIsPrivateSector(!isPrivateSector)} className="w-5 h-5 accent-zenith-green" />
                    <div>
                       <div className="text-sm font-bold text-white">Encrypted Sector</div>
                       <div className="text-[10px] text-zenith-dim">Invite only. Level 5 Clearance required.</div>
                    </div>
                 </div>
                 <button onClick={handleCreateSector} className="w-full bg-zenith-green text-black font-bold py-3 rounded hover:shadow-[0_0_15px_var(--z-primary)] transition-all">
                    ESTABLISH LINK
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Community;