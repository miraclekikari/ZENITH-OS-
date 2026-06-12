import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, Share2, MoreHorizontal } from 'lucide-react';
import { timeAgo } from '../utils/timeAgo';

interface PostCardProps {
  post: {
    id: string;
    username: string;
    handle: string;
    avatar: string;
    content: string;
    timestamp: string;
    image?: string;
    likes: number;
    comments: number;
    retweets: number;
    isLiked?: boolean;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="bg-card border-b border-border p-4 hover-lift cursor-pointer transition-all">
      <div className="flex gap-3">
        {/* Avatar */}
        <img 
          src={post.avatar} 
          className="w-12 h-12 rounded-full border border-border object-cover" 
          alt={post.username} 
        />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-display font-semibold text-foreground truncate">{post.username}</span>
              <span className="text-muted-foreground text-sm truncate">@{post.handle}</span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm whitespace-nowrap">{timeAgo(post.timestamp)}</span>
            </div>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Content */}
          <p className="font-sans text-foreground leading-relaxed mb-3 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Media */}
          {post.image && (
            <div className="rounded-2xl border border-border overflow-hidden mb-3">
              <img src={post.image} className="w-full h-auto max-h-[500px] object-cover" alt="Post content" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between max-w-md text-muted-foreground">
            <button className="flex items-center gap-2 hover:text-primary transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-primary/10">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm">{post.comments}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-emerald-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-emerald-500/10">
                <Repeat2 size={18} />
              </div>
              <span className="text-sm">{post.retweets}</span>
            </button>

            <button className={`flex items-center gap-2 transition-colors group ${post.isLiked ? 'text-destructive' : 'hover:text-destructive'}`}>
              <div className={`p-2 rounded-full ${post.isLiked ? 'bg-destructive/10' : 'group-hover:bg-destructive/10'}`}>
                <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
              </div>
              <span className="text-sm">{post.likes}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-primary transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-primary/10">
                <Share2 size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;