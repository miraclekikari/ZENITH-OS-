import React, { useState, useRef } from 'react';
import { moderateContent } from '../services/geminiService';
import { AIChat } from '../components/Tools';

const Publish: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0 && !caption) return;
    
    setIsUploading(true);
    setStatus('Initializing Security Scan...');

    // Simulate AI Moderation Check
    let safe = true;
    let reason = '';

    // Check Caption
    if (caption) {
      setStatus('Scanning Text...');
      const check = await moderateContent(caption);
      if (!check.safe) {
        safe = false;
        reason = check.reason || 'Harmful Text';
      }
    }

    // Check First Image (Simulated for Demo)
    if (safe && files.length > 0 && files[0].type.startsWith('image/')) {
       setStatus('Scanning Image via AI Sentinel...');
       try {
         const b64 = await fileToBase64(files[0]);
         const check = await moderateContent('', b64);
         if (!check.safe) {
            safe = false;
            reason = check.reason || 'NSFW Image Detected';
         }
       } catch (e) {
         console.error(e);
       }
    }

    if (!safe) {
      setIsUploading(false);
      setStatus('');
      alert(`⚠️ UPLOAD BLOCKED BY SENTINEL AI ⚠️\n\nReason: ${reason}\n\nThis incident has been logged.`);
      return;
    }

    setStatus('Uploading encrypted data...');
    setTimeout(() => {
      alert("Transmission Successful. Content verified and posted.");
      setFiles([]);
      setCaption('');
      setIsUploading(false);
      setStatus('');
    }, 1500);
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-zenith-greenDim pb-4">
        <div>
          <h2 className="text-3xl font-tech text-white">SECURE TRANSMISSION</h2>
          <p className="text-zenith-dim text-sm">All content is verified by AI Sentinel v7.0</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isUploading}
          className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${isUploading ? 'bg-gray-600 text-gray-300' : 'bg-zenith-green text-black hover:shadow-[0_0_20px_var(--z-primary)]'}`}
        >
          {isUploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          {isUploading ? 'PROCESSING' : 'PUBLISH'}
        </button>
      </div>

      {status && (
        <div className="mb-6 bg-zenith-greenDim border border-zenith-green text-zenith-green p-4 rounded-xl flex items-center gap-3 animate-pulse">
           <i className="fas fa-shield-alt text-xl"></i>
           <span className="font-mono font-bold">{status}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload Tools */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drop Zone */}
          <div 
            className={`relative min-h-[300px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden ${dragActive ? 'border-zenith-green bg-zenith-greenDim/20' : 'border-zenith-dim bg-black/40'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {files.length === 0 ? (
              <div className="text-center p-10">
                <input ref={inputRef} type="file" multiple className="hidden" onChange={handleChange} />
                <div className="w-20 h-20 bg-zenith-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-zenith-greenDim">
                   <i className="fas fa-cloud-upload-alt text-3xl text-zenith-green"></i>
                </div>
                <h3 className="font-bold text-xl text-white">Drag & Drop Media</h3>
                <p className="text-sm text-zenith-dim mb-6">Photos, Videos, Code Snippets</p>
                <button onClick={() => inputRef.current?.click()} className="px-6 py-2 border border-zenith-text text-white rounded-lg hover:bg-white hover:text-black transition-all text-sm font-bold">
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="w-full h-full p-4 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[500px] scrollbar-thin">
                {files.map((file, i) => (
                  <div key={i} className="relative group aspect-square bg-zenith-surface rounded-xl overflow-hidden border border-zenith-greenDim hover:border-zenith-green transition-all shadow-lg">
                    {file.type.startsWith('image/') ? (
                      <>
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="preview" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-6">
                            <div className="text-xs font-bold text-white truncate">{file.name}</div>
                            <div className="text-[10px] text-zenith-green font-mono">{formatFileSize(file.size)}</div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zenith-dim p-4 relative">
                        <i className="fas fa-file-alt text-4xl mb-3 text-zenith-dim group-hover:text-white transition-colors"></i>
                        <span className="text-xs font-bold text-white truncate w-full text-center">{file.name}</span>
                        <span className="text-[10px] text-zenith-green mt-1 font-mono">{formatFileSize(file.size)}</span>
                      </div>
                    )}
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500 border border-red-500/50 hover:border-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all z-10 backdrop-blur-sm group-hover:scale-110"
                      title="Cancel / Remove File"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
                
                {/* Add More Button */}
                <div 
                  onClick={() => inputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-zenith-greenDim hover:border-zenith-green hover:bg-zenith-greenDim/10 flex flex-col items-center justify-center cursor-pointer transition-all"
                >
                   <input ref={inputRef} type="file" multiple className="hidden" onChange={handleChange} />
                   <i className="fas fa-plus text-2xl text-zenith-green mb-2"></i>
                   <span className="text-xs text-zenith-dim font-bold">ADD MORE</span>
                </div>
              </div>
            )}
          </div>

          <textarea 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full bg-black/30 border border-zenith-greenDim rounded-xl p-4 text-white focus:outline-none focus:border-zenith-green h-32 resize-none"
            placeholder="Enter encrypted caption..."
          />
        </div>

        {/* Right Column: AI Assistant */}
        <div className="lg:col-span-1">
          <div className="h-full flex flex-col">
            <div className="mb-2 flex items-center gap-2 text-zenith-dim">
              <i className="fas fa-magic text-zenith-green"></i>
              <span className="text-xs font-bold uppercase tracking-wider">Publishing Assistant</span>
            </div>
            <div className="flex-1 min-h-[500px] lg:min-h-0">
               <AIChat />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Publish;