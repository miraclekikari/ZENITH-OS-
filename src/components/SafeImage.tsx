import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSeed?: string;
  onError?: () => void;
}

const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSeed = 'default',
  onError 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Utiliser DiceBear comme fallback
      const fallbackUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${fallbackSeed}`;
      setImgSrc(fallbackUrl);
      onError?.();
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setImgSrc(src);
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover ${hasError ? 'opacity-80' : ''}`}
        onError={handleError}
        onLoad={() => setHasError(false)}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/50">
          <button
            onClick={handleRetry}
            className="p-2 bg-zenith-green/20 rounded-full text-zenith-green hover:bg-zenith-green/30 transition-colors"
            title="Réessayer de charger l'image"
          >
            <i className="fas fa-redo text-sm"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default SafeImage;
