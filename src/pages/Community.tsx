import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import VideoShort from '../components/shorts/VideoShort';
import { Post } from '../types/profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const CommunityPage: React.FC = () => {
  const [shorts, setShorts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
    fetchShorts();
  }, []);

  const fetchShorts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles (id, username, avatar_url, status)') // Fetch author info
        .eq('type', 'video')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShorts(data || []);
    } catch (error) {
      console.error('Error fetching shorts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    try {
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('shorts-videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('shorts-videos')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('posts').insert({
        user_id: userId,
        type: 'video',
        image_url: publicUrlData.publicUrl, // Store video url in image_url
        caption: 'Nouveau Short! 🎉',
      });

      if (dbError) throw dbError;

      // Refresh shorts list
      fetchShorts();
    } catch (error) {
      console.error('Error uploading short:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-black text-white">Chargement...</div>;
  }

  return (
    <div className="h-screen bg-black flex justify-center items-center">
       <div className="w-full max-w-md h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth relative">
        {shorts.map((short) => (
          <div key={short.id} className="h-full w-full snap-start flex items-center justify-center">
            <VideoShort post={short} />
          </div>
        ))}
         {shorts.length === 0 && (
          <div className="h-full w-full snap-start flex items-center justify-center text-white text-center">
            <p>Aucun short pour le moment. <br/> Soyez le premier à en publier un !</p>
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        accept="video/mp4,video/quicktime" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
      />

       <button 
        onClick={handleUploadClick} 
        disabled={uploading}
        className="absolute bottom-20 right-5 bg-white text-black font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200 transition-all z-10 disabled:bg-gray-400"
       >
        {uploading ? 'Envoi en cours...' : <><FontAwesomeIcon icon={faUpload} className="mr-2" /> Publier</>}
       </button>
    </div>
  );
};

export default CommunityPage;
