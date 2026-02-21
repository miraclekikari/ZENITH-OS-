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
        video_ref.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Intersection Observer to play/pause video on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 } // 50% of the video must be visible to play
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        onClick={handleVideoClick}
        className="w-full h-full object-contain"
        src={post.image_url} // Using image_url as video_url
        loop
        playsInline
      />

      <div className="absolute bottom-10 left-4 text-white z-10">
        <h3 className="font-bold">@username</h3> { /* Replace with actual username */}
        <p className="text-sm mt-1">{post.caption}</p>
      </div>

      <div className="absolute bottom-10 right-4 flex flex-col items-center space-y-6 text-white z-10">
        {/* Like Button */}
        <div className="flex flex-col items-center cursor-pointer">
          <div className="w-12 h-12 flex items-center justify-center bg-black/40 rounded-full">
            <FontAwesomeIcon icon={faHeart} className="text-2xl" />
          </div>
          <span className="text-sm font-bold mt-1">{post.likes_count}</span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center cursor-pointer">
          <div className="w-12 h-12 flex items-center justify-center bg-black/40 rounded-full">
            <FontAwesomeIcon icon={faComment} className="text-2xl" />
          </div>
          <span className="text-sm font-bold mt-1">{post.comments_count}</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center cursor-pointer">
          <div className="w-12 h-12 flex items-center justify-center bg-black/40 rounded-full">
            <FontAwesomeIcon icon={faShare} className="text-2xl" />
          </div>
          <span className="text-sm font-bold mt-1">Share</span>
        </div>

        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full bg-white mt-4 relative animate-spin-slow border-2 border-gray-400">
           {/* Placeholder for avatar image */}
           {/* LIVE indicator logic will go here */}
        </div>
      </div>
    </div>
  );
};

export default VideoShort;
