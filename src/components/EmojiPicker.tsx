import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUpload, faStar, faHeart, faLaugh, faAngry, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onStickerSelect: (stickerUrl: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES = [
  { name: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'] },
  { name: 'Gestures', emojis: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝', '👍', '👎', '✊', '👊', '🤛', '🤜'] },
  { name: 'Objects', emojis: ['⌚', '📱', '📲', '💻', '⌨', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '📼'] },
  { name: 'Symbols', emojis: ['❤', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮'] },
  { name: 'Flags', emojis: ['🏳', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸'] }
];

const DEFAULT_STICKERS = [
  'https://picsum.photos/seed/sticker1/150/150',
  'https://picsum.photos/seed/sticker2/150/150',
  'https://picsum.photos/seed/sticker3/150/150',
  'https://picsum.photos/seed/sticker4/150/150',
  'https://picsum.photos/seed/sticker5/150/150',
  'https://picsum.photos/seed/sticker6/150/150',
  'https://picsum.photos/seed/sticker7/150/150',
  'https://picsum.photos/seed/sticker8/150/150',
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, onStickerSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState<'emojis' | 'stickers'>('emojis');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [customStickers, setCustomStickers] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStickerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setCustomStickers(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    onClose();
  };

  const handleStickerClick = (stickerUrl: string) => {
    onStickerSelect(stickerUrl);
    onClose();
  };

  return (
    <div className="absolute bottom-full mb-2 right-0 w-80 bg-zenith-surface border border-zenith-greenDim rounded-xl shadow-2xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zenith-greenDim">
        <h3 className="font-semibold text-zenith-primary">Emoji & Stickers</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zenith-greenDim/20 rounded text-zenith-dim"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zenith-greenDim">
        <button
          onClick={() => setActiveTab('emojis')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'emojis' 
              ? 'text-zenith-primary border-b-2 border-zenith-primary' 
              : 'text-zenith-dim hover:text-zenith-primary'
          }`}
        >
          <FontAwesomeIcon icon={faLaugh} className="mr-2" />
          Emojis
        </button>
        <button
          onClick={() => setActiveTab('stickers')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'stickers' 
              ? 'text-zenith-primary border-b-2 border-zenith-primary' 
              : 'text-zenith-dim hover:text-zenith-primary'
          }`}
        >
          <FontAwesomeIcon icon={faStar} className="mr-2" />
          Stickers
        </button>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {activeTab === 'emojis' ? (
          <div>
            {/* Category Tabs */}
            <div className="flex gap-1 p-2 border-b border-zenith-greenDim overflow-x-auto">
              {EMOJI_CATEGORIES.map((category, index) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(index)}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === index
                      ? 'bg-zenith-primary text-white'
                      : 'bg-zenith-greenDim/20 text-zenith-dim hover:bg-zenith-greenDim/40'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="p-3">
              <div className="grid grid-cols-8 gap-1">
                {EMOJI_CATEGORIES[selectedCategory].emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className="p-2 text-xl hover:bg-zenith-greenDim/20 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Upload Button */}
            <div className="p-3 border-b border-zenith-greenDim">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleStickerUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 bg-zenith-primary text-white rounded-lg hover:bg-zenith-primary/80 transition-colors flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faUpload} />
                Upload Custom Stickers
              </button>
            </div>

            {/* Sticker Grid */}
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {/* Default Stickers */}
                {DEFAULT_STICKERS.map((sticker, index) => (
                  <button
                    key={`default-${index}`}
                    onClick={() => handleStickerClick(sticker)}
                    className="aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-zenith-primary transition-all"
                  >
                    <img
                      src={sticker}
                      alt={`Sticker ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                
                {/* Custom Stickers */}
                {customStickers.map((sticker, index) => (
                  <button
                    key={`custom-${index}`}
                    onClick={() => handleStickerClick(sticker)}
                    className="aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-zenith-primary transition-all relative"
                  >
                    <img
                      src={sticker}
                      alt={`Custom Sticker ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 w-2 h-2 bg-zenith-primary rounded-full" />
                  </button>
                ))}
              </div>
              
              {customStickers.length === 0 && (
                <div className="text-center py-8 text-zenith-dim">
                  <FontAwesomeIcon icon={faUpload} className="text-3xl mb-2 opacity-50" />
                  <p className="text-sm">Upload your own stickers!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Reactions */}
      <div className="flex justify-around p-3 border-t border-zenith-greenDim">
        {['❤️', '😂', '😮', '😢', '👍', '👎'].map((reaction) => (
          <button
            key={reaction}
            onClick={() => handleEmojiClick(reaction)}
            className="text-2xl hover:scale-110 transition-transform"
          >
            {reaction}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
