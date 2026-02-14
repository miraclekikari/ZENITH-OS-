import React, { useEffect } from 'react';

const AdSensePost = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="w-full break-words bg-black/40 border border-zenith-greenDim/30 rounded-2xl p-4 shadow-lg mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-zenith-green/10 flex items-center justify-center border border-zenith-green/30">
              <i className="fas fa-ad text-zenith-green text-xs"></i>
           </div>
           <span className="text-[10px] text-zenith-green font-mono tracking-widest uppercase">Sponsored Signal</span>
        </div>
        <i className="fas fa-ellipsis-h text-zenith-dim text-xs"></i>
      </div>

      {/* Bloc AdSense avec tes identifiants récupérés */}
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-format="fluid"
           data-ad-layout-key="-6t+ed+2i-1n-4w"
           data-ad-client="ca-pub-9217335272764775"
           data-ad-slot="3242306933"></ins>
      
      <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
         <span className="text-[9px] text-zenith-dim font-mono">ENCRYPTED_AD_STREAM</span>
         <button className="text-[10px] px-3 py-1 bg-zenith-green/10 text-zenith-green border border-zenith-green/50 rounded-full">Learn More</button>
      </div>
    </div>
  );
};

export default AdSensePost;
