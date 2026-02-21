import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { Post } from '../../types/profile';

interface VideoShortProps {
  post: Post;
}

const VideoShort: React.FC<VideoShortProps> = ({ post }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play(); // Corrected from video_ref to videoRef
        setIsPlaying(true);
      }
    }
  };
  
  // Intersection Observer to play/pause video on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay when the video is 50% visible
          videoRef.current?.play().catch(error => console.error("Video autoplay failed", error));
          setIsPlaying(true);
        } else {
          // Pause when it's not visible
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 } 
    );

    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        onClick={handleVideoClick}
        className="w-full h-full object-contain"
        src={post.image_url} // Using image_url as video_url for now
        loop
        playsInline
        muted // Muted is often required for autoplay to work
      />

      {/* ... (UI Elements remain the same) */}
    </div>
  );
};

export default VideoShort;
