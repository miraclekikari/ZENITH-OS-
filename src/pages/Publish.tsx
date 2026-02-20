import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AIChat } from '../components/Tools';
import { createPost } from '../lib/supabaseService';
import { generateCreativeCaption } from '../services/geminiService';

const Publish: React.FC = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleAICaption = async () => {
    setStatus(t('ai.generating'));
    try {
      const newCaption = await generateCreativeCaption(caption || files[0]?.name || 'A new post');
      setCaption(newCaption.caption || caption);
    } catch (err) {
      console.error(err);
    } finally {
      setStatus(null);
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0 && !caption.trim()) return;

    setIsUploading(true);
    setStatus(t('upload.initializing'));

    try {
      let uploadedUrl = '';
      if (files.length > 0) {
        setStatus(t('upload.uploadingMedia'));
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        uploadedUrl = data.secure_url;
      }

      setStatus(t('upload.saving'));
      await createPost(caption, uploadedUrl);

      setStatus(t('upload.complete'));
      setTimeout(() => {
        setFiles([]);
        setCaption('');
        setIsUploading(false);
        setStatus(null);
        alert(t('upload.successAlert'));
      }, 1500);

    } catch (error) {
      console.error(error);
      setStatus(t('upload.error'));
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-tech text-white">{t('publish.title')}</h2>
        <button onClick={handleSubmit} disabled={isUploading} className="px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 bg-zenith-green text-black hover:shadow-[0_0_20px_var(--z-primary)] disabled:bg-gray-500">
          {isUploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          {isUploading ? t('publish.publishing') : t('publish.publish')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div onClick={() => inputRef.current?.click()} className="cursor-pointer aspect-square bg-zenith-surface rounded-lg border-2 border-dashed border-zenith-dim flex flex-col items-center justify-center text-center p-4 hover:border-zenith-green transition-all">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {files.length > 0 && files[0] ? (
              <img src={URL.createObjectURL(files[0])} alt="Preview" className="w-full h-full object-contain rounded-md" />
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt text-4xl text-zenith-green mb-4"></i>
                <p className="font-bold text-white">{t('publish.dragOrClick')}</p>
                <p className="text-sm text-zenith-dim">{t('publish.mediaHint')}</p>
              </>
            )}
          </div>
          
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full bg-zenith-surface border border-zenith-greenDim rounded-lg p-3 text-white focus:outline-none focus:border-zenith-green h-28 resize-none" placeholder={t('publish.captionPlaceholder')} />
          
          <button onClick={handleAICaption} disabled={isUploading} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-500 transition-colors">
            <i className="fas fa-robot"></i>
            {t('publish.aiAssist')}
          </button>
          
          {status && <p className="text-center text-zenith-green font-mono text-sm animate-pulse">{status}</p>}
        </div>

        <div>
            <div className="h-full flex flex-col">
               <div className="mb-2 flex items-center gap-2 text-zenith-dim">
                 <i className="fas fa-broadcast-tower text-zenith-green"></i>
                 <span className="text-xs font-bold uppercase tracking-wider">{t('publish.aiChatTitle')}</span>
               </div>
               <div className="flex-1 min-h-[400px]">
                  <AIChat />
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Publish;
