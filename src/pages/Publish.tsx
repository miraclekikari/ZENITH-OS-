import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { supabase } from '../lib/supabaseClient';
import { getUser } from '../services/storageService';

// Helper to convert Data URL to Blob
const dataURLtoBlob = (dataurl: string): Blob | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

const Publish: React.FC = () => {
  const navigate = useNavigate();
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const dataUrl = sessionStorage.getItem('zenith-publish-media');
    if (dataUrl) {
      setMediaUrl(dataUrl);
      sessionStorage.removeItem('zenith-publish-media');
    } else {
      // No media found, maybe the user refreshed the page.
      // Redirecting them to studio to prevent a broken state.
      navigate('/studio');
    }
  }, [navigate]);

  const handlePublish = async () => {
    if (!mediaUrl || isLoading) return;

    const user = getUser();
    if (!user) {
      console.error("No user found. Cannot publish.");
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      const imageBlob = dataURLtoBlob(mediaUrl);
      if (!imageBlob) throw new Error("Failed to convert image data.");

      // 1. Upload image to Supabase Storage
      const filePath = `public/${user.id}/${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, imageBlob);

      if (uploadError) throw uploadError;

      // 2. Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

      if (!publicUrlData) throw new Error("Failed to get public URL for the image.");
      const publicImageUrl = publicUrlData.publicUrl;

      // 3. Insert post data into the 'posts' table
      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: caption,
          media_url: publicImageUrl,
          media_type: 'image'
        });

      if (insertError) throw insertError;

      // 4. On success, navigate to the feed
      navigate('/feed');

    } catch (error) {
      console.error("Error publishing post:", error);
      // Optionally, show a notification to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="w-full max-w-lg bg-[#111111] border border-white/[0.04] rounded-2xl flex flex-col shadow-2xl">
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-white">Publish Post</h1>
            </div>
            <div className="flex items-center gap-2">
                 <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
                    <Icon icon="times" />
                </button>
            </div>
        </header>
        
        <main className="flex-1 p-6 flex flex-col gap-6">
            {mediaUrl ? (
              <img src={mediaUrl} alt="Preview" className="w-full rounded-lg object-contain max-h-96" />
            ) : (
              <div className="w-full aspect-square bg-black/20 rounded-lg flex items-center justify-center text-white/40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zenith-primary"></div>
              </div>
            )}
            
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full h-24 bg-transparent text-white placeholder-white/40 focus:outline-none resize-none"
            />
        </main>

        <footer className="p-6 border-t border-white/[0.04]">
          <button 
            onClick={handlePublish} 
            disabled={!mediaUrl || isLoading}
            className="w-full px-4 py-3 text-md bg-emerald-500 rounded-lg text-white font-semibold hover:bg-emerald-600 transition-colors disabled:bg-emerald-800 disabled:text-white/50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Publishing...
                </>
            ) : (
                'Publish'
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Publish;
