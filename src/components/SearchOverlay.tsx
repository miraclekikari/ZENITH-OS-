import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, Hash } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { formatAvatar } from '../utils/avatar';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'user' | 'post';
  title: string;
  subtitle?: string;
  avatarUrl: string;
  path: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Fetch users
        const { data: users, error: userError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
          .limit(5);
        if (userError) throw userError;

        // Fetch posts (simple content search)
        const { data: posts, error: postError } = await supabase
            .from('posts')
            .select('id, content, user_id, profiles(username, avatar_url)') // Assuming you have RLS and policies set up for this
            .textSearch('content', searchTerm, { type: 'websearch' })
            .limit(5);
        if(postError) throw postError;

        const formattedUsers: SearchResult[] = users.map(user => ({
          id: user.id,
          type: 'user',
          title: user.username,
          subtitle: user.full_name,
          avatarUrl: formatAvatar(user.avatar_url, user.username),
          path: `/profile/${user.username}`,
        }));

        const formattedPosts: SearchResult[] = posts.map((post: any) => ({
            id: post.id,
            type: 'post',
            title: post.content.substring(0, 40) + '...',
            subtitle: `by @${post.profiles.username}`,
            avatarUrl: formatAvatar(post.profiles.avatar_url, post.profiles.username),
            path: `/post/${post.id}` // Assuming a /post/:id route
        }));

        setResults([...formattedUsers, ...formattedPosts]);

      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-start justify-center p-4 pt-[15vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-lg bg-[#0a0a0a]/80 border border-white/10 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search for users, posts, #tags..."
                  className="w-full bg-white/[0.05] border-none rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {searchTerm.length > 1 && (
              <div className="border-t border-white/[0.07] px-2 py-2 max-h-[50vh] overflow-y-auto">
                {loading && <p className='text-center text-xs text-white/40 py-4'>Searching...</p>}
                {!loading && results.length === 0 && searchTerm.length > 1 && <p className='text-center text-xs text-white/40 py-4'>No results found for "{searchTerm}"</p>}
                {results.map((result) => (
                  <Link to={result.path} onClick={onClose} key={result.id + result.type}>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-black/50 flex-shrink-0 flex items-center justify-center">
                           {result.type === 'user' ? 
                                <img src={result.avatarUrl} alt={result.title} className="w-full h-full object-cover rounded-lg"/> :
                                <Hash size={16} className="text-white/50" />
                           }
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white/90">{result.title}</p>
                            {result.subtitle && <p className="text-xs text-white/40">{result.subtitle}</p>}
                        </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
