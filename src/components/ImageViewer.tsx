import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDownload, faShare, faChevronLeft, faChevronRight, faTrash } from '@fortawesome/free-solid-svg-icons';

interface ImageViewerProps {
  images: Array<{
    url: string;
    caption?: string;
    id: string;
  }>;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (imageId: string) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  onDelete
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          navigateImage(-1);
          break;
        case 'ArrowRight':
          navigateImage(1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navigateImage = (direction: number) => {
    setIsLoading(true);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    }
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex].url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image_${images[currentIndex].id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shared Image',
          text: images[currentIndex].caption || 'Check out this image',
          url: images[currentIndex].url
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(images[currentIndex].url);
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
          
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={() => onDelete(currentImage.id)}
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Delete"
              >
                <FontAwesomeIcon icon={faTrash} className="text-lg" />
              </button>
            )}
            <button
              onClick={handleDownload}
              className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Download"
            >
              <FontAwesomeIcon icon={faDownload} className="text-lg" />
            </button>
            <button
              onClick={handleShare}
              className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Share"
            >
              <FontAwesomeIcon icon={faShare} className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => navigateImage(-1)}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-2xl" />
          </button>
          
          <button
            onClick={() => navigateImage(1)}
            disabled={currentIndex === images.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-2xl" />
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="relative max-w-full max-h-full flex items-center justify-center p-8">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        
        <img
          src={currentImage.url}
          alt={currentImage.caption || 'Image'}
          className="max-w-full max-h-full object-contain"
          style={{ maxHeight: '80vh', maxWidth: '90vw' }}
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Caption */}
      {currentImage.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 z-10">
          <p className="text-white text-center">{currentImage.caption}</p>
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
