import { useEffect, useRef } from 'react';

const AdFeed = () => {
  const isInitialized = useRef(false);
  
  useEffect(() => {
    if (isInitialized.current) return;
    
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isInitialized.current = true;
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4 shadow-lg">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
        Sponsorisé
      </span>
      
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-format="fluid"
           data-ad-layout-key="-7c+eo+1+2-5"
           data-ad-client="ca-pub-9217335272764775"
           data-ad-slot="6226658967"></ins>
    </div>
  );
};

export default AdFeed;
