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
    <div className="h-full w-full flex justify-center items-start p-4 md:p-8">
      {/* Centered Content Area */}
      <div className="w-full max-w-md">
        {/* Stories Section - Placeholder */}
        <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Stories</h2>
            <div className="flex space-x-4">
                {/* Example Story */}
                <div className="flex flex-col items-center space-y-1">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-0.5">
                        <img className="w-full h-full rounded-full bg-black p-0.5" src="https://api.dicebear.com/7.x/bottts/svg?seed=profil" alt="story"/>
                    </div>
                    <span className="text-xs text-white">profil</span>
                </div>
            </div>
        </div>

        {/* Main Feed using ShortsFeed component */}
        <div className="h-[70vh] w-full relative rounded-lg overflow-hidden">
          <ShortsFeed />
          <button onClick={handleUploadClick} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full">
              <Icon icon="camera" className="text-2xl text-white"/>
          </button>
        </div>
      </div>

      {/* Right Sidebar for Live Streams & Suggestions - Appears next to the content on larger screens */}
      <div className="hidden lg:block w-80 ml-8">
        <div className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-gray-800">
            <h2 className="font-bold text-xl mb-4 text-white">En Direct</h2>
            <div>
              {streamingProfiles.length > 0 ? (
                streamingProfiles.map(profile => <LiveUser key={profile.id} profile={profile} />)
              ) : (
                <p className="text-gray-400">Personne n'est en direct pour le moment.</p>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
