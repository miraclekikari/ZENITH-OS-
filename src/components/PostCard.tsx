import React, { useState } from 'react';
import { Post } from '../types';
import { timeAgo } from '../utils/timeAgo';
import Icon from './Icon';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-black md:bg-zenith-surface md:rounded-lg border-b md:border border-gray-800 mb-4">
      {/* Post Header */}
      <div className="flex items-center p-3">
        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
        <div className="ml-3">
            <span className="font-bold text-white">{post.username}</span>
            {post.isVerified && <i className="fas fa-check-circle text-blue-500 ml-1"></i>}
        </div>
        <button className="ml-auto text-white"><i className="fas fa-ellipsis-h"></i></button>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="w-full bg-black flex items-center justify-center">
           <img src={post.image} alt="Post content" className="w-full max-h-[70vh] object-contain" />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
            <button onClick={() => onLike(post.id)} className={`transition-transform transform active:scale-75 ${post.isLiked ? 'text-red-500' : 'text-white'}`}>
                <Icon icon={post.isLiked ? 'fa-heart' : 'fa-heart-o'} className="text-2xl" solid={post.isLiked} />
            </button>
            <button onClick={() => onComment(post.id)} className="text-white">
                <Icon icon="fa-comment-o" className="text-2xl" />
            </button>
            <button className="text-white">
                <Icon icon="fa-paper-plane-o" className="text-2xl" />
            </button>
        </div>
        <button className="text-white">
            <Icon icon="fa-bookmark-o" className="text-2xl" />
        </button>
      </div>

      {/* Post Info */}
      <div className="px-3 pb-3">
        <p className="font-bold text-white">{post.likes} likes</p>
        <p className={`text-white mt-1 ${isExpanded ? '' : 'truncate'}`}>
            <span className="font-bold">{post.username}</span> {post.content}
        </p>
        {post.content.length > 100 && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 text-sm mt-1">
                {isExpanded ? 'moins' : 'plus'}
            </button>
        )}
        <p onClick={() => onComment(post.id)} className="text-gray-400 text-sm mt-2 cursor-pointer">Voir les {post.comments} commentaires</p>
        <p className="text-gray-500 text-xs mt-2 uppercase">{timeAgo(post.timestamp)}</p>
      </div>
    </div>
  );
};

export default PostCard;
