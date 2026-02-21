import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Profile } from '../types';
import ShortsFeed from '../components/ShortsFeed';
import Icon from '../components/Icon';

const LiveUser: React.FC<{ profile: Profile }> = ({ profile }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="relative">
      <img src={profile.avatar_url} alt={profile.username} className="w-12 h-12 rounded-full" />
      <div className="absolute inset-0 rounded-full ring-2 ring-red-500 animate-pulse"></div>
    </div>
    <div>
      <p className="font-bold text-white">{profile.username}</p>
      <p className="text-sm text-gray-400">En direct</p>
    </div>
  </div>
);

const CommunityPage: React.FC = () => {
  const [streamingProfiles, setStreamingProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchStreamingProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'streaming');
      
      if (error) {
        console.error("Error fetching streaming profiles:", error);
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
      const { error } = await supabase.storage
        .from('shorts-videos')
        .upload(fileName, file);

      if (error) {
        alert("Erreur lors de l'upload : " + error.message);
      } else {
        alert("Vidéo uploadée avec succès !");
      }
    };
    input.click();
  };

  return (
    // The main container must be relative to position children on top of it.
    <div className="h-full w-full relative bg-black">
      {/* The ShortsFeed takes up 100% of the space, as intended. */}
      <ShortsFeed />

      {/* The upload button is positioned absolutely on top. */}
      <button onClick={handleUploadClick} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full">
          <Icon icon="camera" className="text-2xl text-white"/>
      </button>

      {/* The sidebar is also positioned absolutely, overlaying the feed. */}
      <aside className="absolute top-0 right-0 h-full hidden md:block w-80 bg-black/30 backdrop-blur-md p-4 z-10 border-l border-gray-800/50">
        <h2 className="font-bold text-xl mb-4 text-white">En Direct</h2>
        <div>
          {streamingProfiles.length > 0 ? (
            streamingProfiles.map(profile => <LiveUser key={profile.id} profile={profile} />)
          ) : (
            <p className="text-gray-400">Personne n'est en direct pour le moment.</p>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CommunityPage;
