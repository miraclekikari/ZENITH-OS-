import React, { useState, useRef, useEffect } from 'react';
import { Image, Smile, ListTodo, Calendar, MapPin } from 'lucide-react';
import { useUser } from '../context/UserContext';

const ComposeBox: React.FC = () => {
  const { profile } = useUser();
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  return (
    <div className="bg-card border-b border-border p-4 transition-colors">
      <div className="flex gap-4">
        <img 
          src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'default'}`} 
          className="w-12 h-12 rounded-full border border-border object-cover flex-shrink-0" 
          alt="Mon profil" 
        />
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            placeholder="Quoi de neuf ?"
            className="w-full bg-transparent border-none focus:ring-0 text-xl font-sans text-foreground placeholder:text-muted-foreground resize-none min-h-[60px] overflow-hidden"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={1}
          />
          
          <div className="flex items-center justify-between border-t border-border pt-3 mt-2">
            <div className="flex items-center gap-1 text-primary">
              <button className="p-2 rounded-full hover:bg-primary/10 transition-colors cursor-pointer" title="Image">
                <Image size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-primary/10 transition-colors cursor-pointer" title="Sondage">
                <ListTodo size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-primary/10 transition-colors cursor-pointer" title="Emoji">
                <Smile size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-primary/10 transition-colors cursor-pointer" title="Programme">
                <Calendar size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-primary/10 transition-colors cursor-pointer" title="Lieu">
                <MapPin size={20} />
              </button>
            </div>
            
            <button 
              disabled={!content.trim()}
              className="bg-[var(--gradient-primary)] text-white px-6 py-2 rounded-full font-display font-bold shadow-[var(--shadow-glow)] disabled:opacity-50 disabled:shadow-none hover:opacity-90 transition-all cursor-pointer"
            >
              Publier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeBox;