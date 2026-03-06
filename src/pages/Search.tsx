
import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

const SearchPage = () => {
  const posts = Array.from({ length: 12 });

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white">
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-xl p-4 md:p-6">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-white/5 border border-white/10 rounded-lg h-12 px-4 pl-10 focus:outline-none focus:border-white/20 transition-colors font-sans"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon size={18} className="text-white/30" />
          </div>
        </div>
      </div>

      <main className="p-1 md:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {posts.map((_, index) => (
              <div key={index} className="aspect-square bg-white/5">
                <img 
                  src={`https://picsum.photos/300/300?random=${index}`} 
                  alt="Random content"
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
