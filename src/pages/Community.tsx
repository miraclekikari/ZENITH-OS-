import React, { useState, useEffect, useMemo } from 'react';
import { Post, Story, Community as CommunityType } from '../types';
import { generateCommunityNews } from '../services/geminiService';
import { DB } from '../services/storageService';
import PostCard from '../components/PostCard';

// --- MOCK DATA (Pour l'interface statique) ---
const mockStories: Story[] = [
  { id: '1', user: 'DevMike', avatar: 'https://picsum.photos/seed/u2/200/200', image: '', isSeen: false },
  { id: '2', user: 'Sarah_AI', avatar: 'https://picsum.photos/seed/u3/200/200', image: '', isSeen: true },
  { id: '3', user: 'Ghost_01', avatar: 'https://picsum.photos/seed/ghost/200/200', image: '', isSeen: false },
  { id: '4', user: 'NetRunner', avatar: 'https://picsum.photos/seed/net/200/200', image: '', isSeen: false },
];

const mockCommunities: CommunityType[] = [
  { id: 'c1', name: 'React Developers', description: 'Components & Hooks', members: 1240, isPrivate: false, topic: 'React.js' },
  { id: 'c2', name: 'CyberSec Elite', description: 'Encrypted Discussions', members: 45, isPrivate: true, topic: 'Cybersecurity' },
  { id: 'c3', name: 'AI Research', description: 'LLMs & Neural Nets', members: 890, isPrivate: false, topic: 'Artificial Intelligence' },
  { id: 'c4', name: 'Off-World Tech', description: 'SpaceX & Beyond', members: 320, isPrivate: false, topic: 'Space Tech' },
];

const Community: React.FC = () => {
  // --- STATE ---
  const [showDM, setShowDM] = useState(false);
  const [news, setNews] = useState<string>("INITIALIZING ZENITH NEURAL LINK...");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCommunity, setActiveCommunity] = useState<CommunityType>(mockCommunities[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Create Sector Form
  const [newSectorName, setNewSectorName] = useState('');
  const [newSectorTopic, setNewSectorTopic] = useState('');
  const [isPrivateSector, setIsPrivateSector] = useState(false);

  // Data Store
  const [posts, setPosts] = useState<Post[]>([]);

  // --- LOGIC: SYNC FEED (Le cœur du système) ---
  useEffect(() => {
    const syncFeed = async () => {
      try {
        const realPosts = await DB.getPosts();
        
        // Si on a des vrais posts, on les charge et on trie par date (le plus récent en haut)
        if (realPosts && realPosts.length > 0) {
          // Astuce : On simule un tri par date si le timestamp n'est pas un vrai objet Date
          const sortedPosts = [...realPosts].reverse(); 
          setPosts(sortedPosts);
        }
      } catch (error) {
        console.error("Neural Link Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // 1. Chargement initial
    syncFeed();

    // 2. "Heartbeat" : Rafraichissement automatique toutes les 5s
    const heartbeat = setInterval(syncFeed, 5000);
    return () => clearInterval(heartbeat);
  }, []);

  // --- LOGIC: AI NEWS ---
  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      // Petit effet visuel de chargement
      if (mounted) setNews("Scanning sector frequencies...");
      const headline = await generateCommunityNews(activeCommunity.topic);
      if (mounted) setNews(headline);
    };
    fetchNews();
    const interval = setInterval(fetchNews, 60000); 
    return () => { mounted = false; clearInterval(interval); };
  }, [activeCommunity]);

  // --- HANDLERS (Interactions) ---
  const toggleLike = (id: string) => {
    // Optimistic UI Update : On met à jour l'interface AVANT la base de données pour que ce soit instantané
    setPosts(currentPosts => currentPosts.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked };
      }
      return p;
    }));
    // TODO: Connecter à DB.likePost(id) ici
  };

  const toggleRepost = (id: string) => {
    setPosts(currentPosts => currentPosts.map(p => {
      if (p.id === id) {
        return { ...p, shares: p.isReposted ? p.shares - 1 : p.shares + 1, isReposted: !p.isReposted };
      }
      return p;
    }));
  };

  const handleComment = (id: string) => {
    // Simulation simple
    setPosts(currentPosts => currentPosts.map(p => {
      if (p.id === id) return { ...p, comments: p.comments + 1 };
      return p;
    }));
  };

  const handleCreateSector = () => {
     if(!newSectorName) return;
     alert(`Sector "${newSectorName}" Initialized. Encryption: ${isPrivateSector ? 'AES-256' : 'Standard'}`);
     setShowCreateModal(false);
     setNewSectorName('');
  };

  // --- FILTERING (Moteur de recherche) ---
  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(p => 
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  // --- RENDER ---
  return (
    <div className="flex h-full relative overflow-hidden">
      
      {/* 1. LEFT SIDEBAR (Navigation & Identity) */}
      <div className="hidden lg:flex flex-col w-72 pr-6 border-r border-zenith-greenDim mr-6 h-full">
        
        {/* User Mini-Profile Widget */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-zenith-greenDim/20 to-transparent border border-zenith-greenDim/50">
           <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                 <img src="https://picsum.photos/seed/me/100/100" className="w-10 h-10 rounded-full border border-zenith-green" alt="Me" />
                 <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-zenith-green rounded-full animate-pulse"></div>
              </div>
              <div>
                 <div className="font-bold text-white text-sm">Zenith_Operative</div>
                 <div className="text-[10px] text-zenith-green font-mono">LVL 4 CLEARANCE</div>
              </div>
           </div>
           <div className="flex justify-between text-[10px] text-zenith-dim font-mono mt-2 pt-2 border-t border-white/5">
              <span>REP: 84%</span>
              <span>CREDITS: 1,240</span>
           </div>
        </div>

        <h3 className="font-tech text-zenith-green mb-4 flex items-center justify-between text-xs tracking-widest">
           SECTOR DATABASE
           <button onClick={() => setShowCreateModal(true)} className="text-[10px] border border-zenith-green/50 rounded px-2 py-1 hover:bg-zenith-green hover:text-black transition-all">
             <i className="fas fa-plus"></i> INIT
           </button>
        </h3>
        
        <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
           {mockCommunities.map(c => (
              <div 
                key={c.id} 
                onClick={() => setActiveCommunity(c)}
                className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between group ${activeCommunity.id === c.id ? 'bg-zenith-greenDim border border-zenith-green text-white shadow-[0_0_10px_rgba(0,255,136,0.1)]' : 'hover:bg-white/5 text-zenith-dim'}`}
              >
                 <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded bg-black flex items-center justify-center font-bold text-xs border ${activeCommunity.id === c.id ? 'border-zenith-green text-zenith-green' : 'border-white/10 text-gray-500'}`}>
                       {c.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                       <div className="font-bold text-sm group-hover:text-white transition-colors">{c.name}</div>
                       <div className="text-[10px] opacity-60 font-mono">{c.members} nodes</div>
                    </div>
                 </div>
                 {c.isPrivate && <i className="fas fa-lock text-[10px] text-yellow-500/80"></i>}
              </div>
           ))}
        </div>
      </div>

      {/* 2. MAIN FEED CENTER */}
      <div className={`flex-1 animate-fade-in pb-32 overflow-y-auto h-full scrollbar-hide transition-all duration-300 ${showDM ? 'mr-80 hidden md:block' : ''}`}>
         
         {/* Search Bar Mobile/Tablet */}
         <div className="lg:hidden mb-4 sticky top-0 z-20 bg-black/80 backdrop-blur-md py-2">
            <input 
              type="text" 
              placeholder="Search Network..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zenith-surface border border-zenith-greenDim rounded-lg px-4 py-2 text-white focus:border-zenith-green outline-none text-sm"
            />
         </div>

         {/* AI News Ticker (Cyberpunk Style) */}
         <div className="mb-6 bg-black border border-zenith-greenDim rounded-none md:rounded-lg p-0 flex items-stretch overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.05)] relative group">
            <div className="bg-red-600/90 text-white text-[10px] font-bold px-3 flex items-center justify-center animate-pulse z-10">
               <i className="fas fa-broadcast-tower mr-2"></i> LIVE
            </div>
            <div className="flex-1 py-2 px-3 bg-gradient-to-r from-black via-black/90 to-transparent relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
               <div className="text-xs font-mono text-zenith-green whitespace-nowrap">
                  <span className="inline-block animate-[scrollLeft_20s_linear_infinite]">{news}</span>
               </div>
            </div>
         </div>

         {/* Stories Strip */}
         <div className="flex gap-4 overflow-x-auto pb-4 mb-6 px-1 scrollbar-hide">
            {/* My Story Button */}
            <div className="flex flex-col items-center gap-1 cursor-pointer group min-w-[64px]">
               <div className="w-16 h-16 rounded-full border-2 border-dashed border-zenith-dim group-hover:border-zenith-green flex items-center justify-center bg-white/5 transition-all">
                  <i className="fas fa-plus text-zenith-dim group-hover:text-zenith-green text-xl"></i>
               </div>
               <span className="text-xs text-zenith-dim group-hover:text-white">Add Log</span>
            </div>
            
            {/* Other Stories */}
            {mockStories.map(story => (
               <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer group min-w-[64px]">
                  <div className={`w-16 h-16 rounded-full p-[2px] ${story.isSeen ? 'bg-zenith-dim/30' : 'bg-gradient-to-tr from-yellow-400 to-zenith-green animate-spin-slow-hover'} group-hover:scale-105 transition-transform duration-300`}>
                     <img src={story.avatar} className="w-full h-full rounded-full object-cover border-2 border-black" alt="story" />
                  </div>
                  <span className="text-xs text-white truncate w-16 text-center group-hover:text-zenith-green transition-colors">{story.user}</span>
               </div>
            ))}
         </div>

         {/* --- THE FEED --- */}
         <div className="space-y-8 max-w-2xl mx-auto">
            
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-zenith-green border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-zenith-green font-mono text-sm animate-pulse">ESTABLISHING NEURAL LINK...</div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredPosts.length === 0 && (
              <div className="glass-card p-10 text-center rounded-2xl border-dashed border border-zenith-dim">
                <i className="fas fa-satellite-dish text-4xl text-zenith-dim mb-4"></i>
                <h3 className="text-white font-bold text-lg">No Signals Detected</h3>
                <p className="text-zenith-dim text-sm mt-2">The network is silent in this sector.</p>
                <button className="mt-4 px-6 py-2 bg-zenith-green text-black font-bold rounded-full hover:scale-105 transition-transform">
                  Initialise New Transmission
                </button>
              </div>
            )}

            {/* Posts Loop */}
            {!isLoading && filteredPosts.map(post => (
               <PostCard 
                 key={post.id} 
                 post={post} 
                 onLike={() => toggleLike(post.id)}
                 onRepost={() => toggleRepost(post.id)}
                 onComment={() => handleComment(post.id)}
               />
            ))}

            {!isLoading && filteredPosts.length > 0 && (
              <div className="text-center py-10 text-zenith-dim text-xs font-mono">
                -- END OF TRANSMISSION --
              </div>
            )}
         </div>
      </div>

      {/* 3. RIGHT SIDEBAR (Secure Comms) */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-black/95 backdrop-blur-xl border-l border-zenith-greenDim transform transition-transform duration-300 z-40 ${showDM ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="h-full flex flex-col">
            <div className="p-4 border-b border-zenith-greenDim flex items-center justify-between bg-zenith-greenDim/10">
               <h3 className="font-tech text-white flex items-center gap-2 text-sm tracking-wider">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 COMMS HUB
               </h3>
               <button onClick={() => setShowDM(false)} className="text-zenith-dim hover:text-white hover:rotate-90 transition-all"><i className="fas fa-times"></i></button>
            </div>
            
            <div className="p-3">
               <div className="relative">
                 <i className="fas fa-search absolute left-3 top-3 text-zenith-dim text-xs"></i>
                 <input 
                    type="text" 
                    placeholder="Search encrypted channels..." 
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-2 py-2 text-xs text-white focus:border-zenith-green outline-none transition-colors" 
                 />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
               {/* Channels */}
               <div className="px-4 py-2 mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zenith-dim">ACTIVE CHANNELS</span>
                  <span className="text-[10px] bg-zenith-green/20 text-zenith-green px-1 rounded">2</span>
               </div>
               
               (i {[1,2].map=> (
                  <div key={chan-${i}} className="px-4 py-3 hover:bg-white/5 cursor-pointer flex gap-3 items-center group border-l-2 border-transparent hover:border-zenith-green transition-all">
                     <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-900/50 to-blue-900/50 text-purple-300 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i className="fas fa-hashtag text-sm"></i>
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                           <span className="font-bold text-sm text-gray-200 truncate">Titan_Project_{i}</span>
                           <span className="text-[9px] text-zenith-dim font-mono">14:02</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate group-hover:text-zenith-green transition-colors font-mono">{" >> "} key rotation complete.</p>
                     </div>
                  </div>
               ))}
               
               {/* DMs */}
               <div className="px-4 py-2 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zenith-dim">DIRECT SIGNALS</span>
               </div>
               {[1,2,3,4,5].map(i => (
                  <div key={sig-${i}} className="px-4 py-3 hover:bg-white/5 cursor-pointer flex gap-3 items-center group border-l-2 border-transparent hover:border-blue-500 transition-all">
                     <div className="relative">
                        <img src={`https://picsum.photos/seed/chat${i}/50/50`} className="w-9 h-9 rounded-full grayscale group-hover:grayscale-0 transition-all" alt="user" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                           <span className="font-bold text-sm text-gray-200 truncate">Operative_{i}</span>
                           <span className="text-[9px] text-zenith-dim font-mono">1m</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate group-hover:text-blue-400 transition-colors">Coordinates received.</p>
                     </div>
                  </div>
               ))}
            </div>
            
            {/* Quick Actions Footer */}
            <div className="p-4 border-t border-zenith-greenDim/30 grid grid-cols-2 gap-3 bg-black/50">
               <button className="flex items-center justify-center gap-2 bg-zenith-green text-black py-2 rounded-lg font-bold text-xs hover:shadow-[0_0_10px_var(--z-primary)] transition-all">
                  <i className="fas fa-plus"></i> NEW CHAT
               </button>
               <button className="flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 py-2 rounded-lg font-bold text-xs hover:bg-white/10 transition-all">
                  <i className="fas fa-cog"></i> CONFIG
               </button>
            </div>
         </div>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      {!showDM && (
         <button 
            onClick={() => setShowDM(true)}
            className="md:hidden fixed bottom-24 right-6 w-12 h-12 bg-zenith-green text-black rounded-full shadow-[0_0_20px_var(--z-primary)] flex items-center justify-center text-xl hover:scale-110 active:scale-90 transition-all z-30"
         >
            <i className="fas fa-comment-alt"></i>
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
         </button>
      )}

      {/* Create Sector Modal (Enhanced) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="glass-card w-full max-w-md rounded-2xl p-0 overflow-hidden relative animate-scale-up border border-zenith-green shadow-[0_0_30px_rgba(0,255,136,0.2)]">
              {/* Header */}
              <div className="bg-zenith-green/10 p-6 border-b border-zenith-green/20">
                 <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-zenith-dim hover:text-white transition-colors"><i className="fas fa-times text-xl"></i></button>
                 <h2 className="text-2xl font-tech text-white mb-1">INITIALIZE SECTOR</h2>
                 <p className="text-xs text-zenith-green font-mono">PROTOCOL: NEW_COMMUNITY_ESTABLISHMENT</p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zenith-dim tracking-wider">SECTOR IDENTIFIER</label>
                    <div className="relative">
                       <i className="fas fa-globe absolute left-3 top-3 text-zenith-green"></i>
                       <input value={newSectorName} onChange={e => setNewSectorName(e.target.value)} className="w-full bg-black/50 border border-zenith-greenDim rounded-lg pl-10 p-2.5 text-white outline-none focus:border-zenith-green focus:shadow-[0_0_10px_rgba(0,255,136,0.1)] transition-all" placeholder="e.g. Quantum Computing" />
                    </div>
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zenith-dim tracking-wider">PRIMARY FREQUENCY (TOPIC)</label>
                    <div className="relative">
                       <i className="fas fa-tag absolute left-3 top-3 text-zenith-green"></i>
                       <input value={newSectorTopic} onChange={e => setNewSectorTopic(e.target.value)} className="w-full bg-black/50 border border-zenith-greenDim rounded-lg pl-10 p-2.5 text-white outline-none focus:border-zenith-green transition-all" placeholder="e.g. Physics" />
                    </div>
                 </div>

                 <div className="flex items-center gap-3 bg-zenith-greenDim/10 p-3 rounded-lg border border-zenith-greenDim/30 hover:border-zenith-green/50 transition-colors cursor-pointer" onClick={() => setIsPrivateSector(!isPrivateSector)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isPrivateSector ? 'bg-zenith-green border-zenith-green' : 'border-zenith-dim'}`}>
                       {isPrivateSector && <i className="fas fa-check text-black text-xs"></i>}
                    </div>
                    <div className="flex-1">
                       <div className="text-sm font-bold text-white flex items-center gap-2">
                          Encrypted Sector {isPrivateSector && <i className="fas fa-lock text-xs text-yellow-500"></i>}
                       </div>
                       <div className="text-[10px] text-zenith-dim">Invite only. High security clearance required.</div>
                    </div>
                 </div>

                 <button onClick={handleCreateSector} className="w-full bg-zenith-green text-black font-bold py-3.5 rounded-lg hover:shadow-[0_0_20px_var(--z-primary)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <i className="fas fa-satellite-dish"></i> ESTABLISH LINK
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Community;
