import React from 'react';

export const ThinkingIndicator = () => (
  <div className="flex items-center space-x-2 px-4 py-3 bg-gray-900/50 rounded-lg border border-zenith-green/30">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-zenith-green rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
    </div>
    <span className="text-sm font-mono text-zenith-green animate-pulse">
      ZENITH_AI: Processing<span className="typing-dots">...</span>
    </span>
  </div>
);
