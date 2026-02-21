import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Profile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import ShortsFeed from '../components/ShortsFeed';
import { Camera, X, Radio, ChevronRight } from 'lucide-react';

// Mock live users
const mockLiveUsers = [
  { id: '1', username: 'NeonLive', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=neonlive', full_name: 'Neon Live', bio: 'Live streaming', is_verified: true, privacy: 'PUBLIC' as const, created_at: '', updated_at: '' },
  { id: '2', username: 'StreamQueen', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=stream', full_name: 'Stream Queen', bio: 'Live streaming', is_verified: false, privacy: 'PUBLIC' as const, created_at: '', updated_at: '' },
  { id: '3', username: 'LiveArtist', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=artist', full_name: 'Live Artist', bio: 'Creating art live', is_verified: true, privacy: 'PUBLIC' as const, created_at: '', updated_at: '' },
];

const LiveUser: React.FC<{ profile: Profile }> = ({ profile }) => (
  <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition-colors w-full group">
    <div className="relative flex-shrink-0">
      <img
        src={profile.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=default'}
        alt={profile.username}
        className="w-11 h-11 rounded-full"
        crossOrigin="anonymous"
      />
      {/* Red pulse neon ring */}
      <div className="absolute inset-0 rounded-full ring-2 ring-red-500 animate-pulse" />
      <div className="absolute inset-0 rounded-full ring-2 ring-red-500/30 animate-ping" style={{ animationDuration: '2s' }} />
      {/* LIVE badge */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-red-500 rounded text-[8px] font-bold text-white leading-none tracking-wider">
        LIVE
      </div>
    </div>
    <div className="flex-1 min-w-0 text-left">
      <p className="font-semibold text-white text-sm truncate">{profile.username}</p>
      <p className="text-[11px] text-white/30">Streaming now</p>
    </div>
    <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" />
  </button>
);

const CommunityPage: React.FC = () => {
  const [streamingProfiles, setStreamingProfiles] = useState<Profile[]>([]);
  const [showLiveSidebar, setShowLiveSidebar] = useState(false);

  useEffect(() => {
    const fetchStreamingProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'streaming');

      if (error || !data || data.length === 0) {
        setStreamingProfiles(mockLiveUsers);
      } else {
        setStreamingProfiles(data);
      }
    };
    fetchStreamingProfiles();
  }, []);

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('shorts-videos').upload(fileName, file);
      if (error) {
        alert('Upload error: ' + error.message);
      } else {
        alert('Video uploaded successfully!');
      }
    };
    input.click();
  };

  return (
    <div className="h-[100dvh] md:h-screen w-full flex bg-black relative overflow-hidden">
      {/* Main full-screen shorts area */}
      <div className="flex-1 relative">
        <ShortsFeed />

        {/* Top overlay buttons */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={() => setShowLiveSidebar(!showLiveSidebar)}
            className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white text-sm"
          >
            <Radio size={14} className="text-red-500" />
            <span className="text-xs font-medium">LIVE</span>
            {streamingProfiles.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center">
                {streamingProfiles.length}
              </span>
            )}
          </button>

          <button
            onClick={handleUploadClick}
            className="pointer-events-auto w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white"
          >
            <Camera size={18} />
          </button>
        </div>
      </div>

      {/* Live Sidebar overlay */}
      <AnimatePresence>
        {showLiveSidebar && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
              onClick={() => setShowLiveSidebar(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/[0.06] z-40 flex flex-col"
            >
              {/* Sidebar header */}
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Radio size={16} className="text-red-500" />
                  <h2 className="font-bold text-white text-sm tracking-wider">LIVE NOW</h2>
                </div>
                <button
                  onClick={() => setShowLiveSidebar(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Live users list */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {streamingProfiles.length > 0 ? (
                  streamingProfiles.map((profile) => (
                    <LiveUser key={profile.id} profile={profile} />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Radio size={24} className="text-white/10 mx-auto mb-3" />
                    <p className="text-white/20 text-sm">No one is live right now</p>
                  </div>
                )}
              </div>

              {/* Go live button */}
              <div className="p-4 border-t border-white/[0.06]">
                <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                  <Radio size={16} />
                  Go Live
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop permanent live sidebar (only on large screens) */}
      <div className="hidden xl:flex w-80 bg-[#0a0a0a] border-l border-white/[0.06] flex-col flex-shrink-0">
        <div className="flex items-center gap-2 p-4 border-b border-white/[0.06]">
          <Radio size={16} className="text-red-500" />
          <h2 className="font-bold text-white text-sm tracking-wider">LIVE NOW</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {streamingProfiles.map((profile) => (
            <LiveUser key={profile.id} profile={profile} />
          ))}
        </div>
        <div className="p-4 border-t border-white/[0.06]">
          <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all">
            <Radio size={16} />
            Go Live
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
