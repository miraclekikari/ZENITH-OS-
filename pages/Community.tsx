import React, { useState } from 'react';
import { Post, Short } from '../types';

const mockShorts: Short[] = [
  { id: '1', title: 'CSS Hacks', image: 'https://picsum.photos/seed/1/200/300', views: '1.2k' },
  { id: '2', title: 'Setup Tour', image: 'https://picsum.photos/seed/2/200/300', views: '5k' },
  { id: '3', title: 'Day in Life', image: 'https://picsum.photos/seed/3/200/300', views: '800' },
  { id: '4', title: 'React Tips', image: 'https://picsum.photos/seed/4/200/300', views: '10k' },
];

const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    { id: '1', author: 'Zenith Admin', content: 'Welcome to Titan v5.0. The system is stable.', likes: 120, isVerified: true, timestamp: '2h ago' },
    { id: '2', author: 'DevStudent_99', content: 'Just finished the Network module. Highly recommended!', likes: 45, isVerified: false, timestamp: '4h ago' },
  ]);
  const [newPost, setNewPost] = useState('');

  // Sentinel Algorithm (Client-Side Moderation)
  const sentinelCheck = (text: string) => {
    const forbidden = ['spam', 'fake', 'scam', 'hate'];
    return !forbidden.some(word => text.toLowerCase().includes(word));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    
    if (!sentinelCheck(newPost)) {
      alert("⚠️ SENTINEL ALERT: Content blocked by moderation algorithm.");
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: 'You',
      content: newPost,
      likes: 0,
      isVerified: true,
      timestamp: 'Just now'
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* Shorts Section */}
      <section>
        <h3 className="font-tech text-lg mb-4 flex items-center gap-2">
          <i className="fas fa-play-circle text-zenith-green"></i> Zenith Shorts
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {mockShorts.map(short => (
            <div key={short.id} className="min-w-[140px] h-60 bg-zenith-surface border border-zenith-greenDim rounded-xl relative overflow-hidden group cursor-pointer hover:border-zenith-green transition-all">
              <img src={short.image} alt={short.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-3">
                <div className="font-bold text-sm">{short.title}</div>
                <div className="text-xs text-zenith-green">{short.views} views</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feed Section */}
      <section className="max-w-2xl mx-auto">
        <div className="bg-zenith-surface border border-zenith-greenDim rounded-xl p-4 mb-6">
          <textarea 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Broadcast to the network..."
            className="w-full bg-black border border-zenith-greenDim rounded p-3 text-sm focus:outline-none focus:border-zenith-green resize-none h-24"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-zenith-dim">Sentinel Moderation Active</span>
            <button onClick={handlePost} className="bg-zenith-green text-black px-4 py-1.5 rounded font-bold text-sm hover:opacity-80">
              Broadcast
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-zenith-surface border border-zenith-greenDim rounded-xl p-4 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-zenith-dim rounded-full flex items-center justify-center text-black font-bold">
                  {post.author[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-sm">
                    {post.author}
                    {post.isVerified && <i className="fas fa-check-circle text-zenith-green text-xs"></i>}
                  </div>
                  <div className="text-[10px] text-zenith-dim">{post.timestamp}</div>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{post.content}</p>
              <div className="flex gap-4 mt-3 pt-3 border-t border-zenith-greenDim text-xs text-zenith-dim">
                <button className="hover:text-zenith-green"><i className="far fa-heart"></i> {post.likes}</button>
                <button className="hover:text-zenith-green"><i className="far fa-comment"></i> Reply</button>
                <button className="hover:text-zenith-green"><i className="fas fa-share"></i> Share</button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Community;