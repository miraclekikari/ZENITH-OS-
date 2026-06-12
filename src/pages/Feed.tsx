import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PostCard from '../components/PostCard';
import ComposeBox from '../components/ComposeBox';

const mockPosts = [
  {
    id: '1',
    username: 'Kikari',
    handle: 'kikari',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kikari',
    content: "Bienvenue sur la nouvelle version de Zenith ! 🚀\n\nOn a repensé toute l'expérience pour plus de fluidité et d'élégance. Qu'en pensez-vous ? #ZenithRefit #SocialNetwork",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80',
    likes: 1240,
    comments: 48,
    retweets: 12,
    isLiked: true,
  },
  {
    id: '2',
    username: 'Zenith OS',
    handle: 'zenith_os',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zenith',
    content: "L'élégance du Midnight Indigo. 🌌\n\nNotre nouvelle palette de couleurs a été conçue pour réduire la fatigue visuelle tout en conservant un aspect technologique et futuriste.",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    likes: 856,
    comments: 24,
    retweets: 5,
  },
  {
    id: '3',
    username: 'React News',
    handle: 'react_news',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=react',
    content: "React 19 est enfin là ! Les Server Components vont changer la donne pour les performances des réseaux sociaux comme Zenith.",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    likes: 2100,
    comments: 156,
    retweets: 89,
  }
];

const Feed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-20">
        <div className="px-4 py-3">
          <h1 className="text-xl font-display font-bold">Accueil</h1>
        </div>
        <div className="flex">
          <button 
            onClick={() => setActiveTab('for-you')}
            className="flex-1 py-4 text-sm font-semibold hover:bg-muted/30 transition-colors relative"
          >
            <span className={activeTab === 'for-you' ? 'text-foreground' : 'text-muted-foreground'}>Pour vous</span>
            {activeTab === 'for-you' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('following')}
            className="flex-1 py-4 text-sm font-semibold hover:bg-muted/30 transition-colors relative"
          >
            <span className={activeTab === 'following' ? 'text-foreground' : 'text-muted-foreground'}>Abonnements</span>
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Compose Box */}
      <div className="hidden md:block">
        <ComposeBox />
      </div>

      {/* Posts List */}
      <div className="flex flex-col">
        {mockPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Feed;