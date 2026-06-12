import React from 'react';
import { Search, TrendingUp, UserPlus } from 'lucide-react';

const RightRail: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="sticky top-0 bg-background pt-2 pb-4 z-10">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Rechercher sur Zenith"
            className="w-full bg-card border border-border rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-sm"
          />
        </div>
      </div>

      {/* Trends */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold">Tendances pour vous</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { topic: "ZenithRefit", posts: "24.5k" },
            { topic: "React19", posts: "12.2k" },
            { topic: "TailwindV4", posts: "8.1k" },
          ].map((trend) => (
            <div key={trend.topic} className="p-4 hover:bg-muted/30 cursor-pointer transition-colors">
              <p className="text-xs text-muted-foreground">Tendance en France</p>
              <p className="font-semibold mt-0.5">#{trend.topic}</p>
              <p className="text-xs text-muted-foreground mt-1">{trend.posts} posts</p>
            </div>
          ))}
        </div>
        <button className="w-full p-4 text-left text-primary text-sm font-medium hover:bg-muted/30 transition-colors">
          Voir plus
        </button>
      </div>

      {/* Who to follow */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold">Suggestions</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { name: "Kikari", handle: "@kikari", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kikari" },
            { name: "Zenith OS", handle: "@zenith_os", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zenith" },
          ].map((user) => (
            <div key={user.handle} className="p-4 flex items-center justify-between hover:bg-muted/30 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <img src={user.avatar} className="w-10 h-10 rounded-full border border-border" alt={user.name} />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.handle}</span>
                </div>
              </div>
              <button className="bg-foreground text-background text-xs font-bold py-1.5 px-4 rounded-full hover:opacity-90 transition-opacity">
                Suivre
              </button>
            </div>
          ))}
        </div>
        <button className="w-full p-4 text-left text-primary text-sm font-medium hover:bg-muted/30 transition-colors">
          Voir plus
        </button>
      </div>
    </div>
  );
};

export default RightRail;