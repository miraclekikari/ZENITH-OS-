import React, { useState, useRef } from 'react';
import { moderateContent, generateCreativeCaption } from '../services/geminiService';
import { AIChat } from '../components/Tools';
import { DB } from '../services/storageService'; 

const FILTERS = [
  { name: 'Normal', style: {} },
  { name: 'Cyber', style: { filter: 'contrast(1.2) saturate(1.5) hue-rotate(180deg)' } },
  { name: 'Noir', style: { filter: 'grayscale(1) brightness(0.8) contrast(1.5)' } },
  { name: 'Retro', style: { filter: 'sepia(0.8) contrast(1.2)' } },
  { name: 'Neon', style: { filter: 'brightness(1.1) contrast(1.1) saturate(2) drop-shadow(0 0 5px cyan)' } },
];

const Publish: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [statusSteps, setStatusSteps] = useState<string[]>([]);
  const [currentFilter, setCurrentFilter] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

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

  // --- DRAG & DROP LOGIC ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (draggedIndex !== null) return;
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (draggedIndex !== null) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDropItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newFiles = [...files];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedFile);
    setFiles(newFiles);
    setDraggedIndex(null);
  };

  const handleAICaption = async () => {
    setIsGenerating(true);
    try {
      const context = caption || (files.length > 0 ? `A photo of ${files[0].name}` : 'A cool tech update');
      const newCaption = await generateCreativeCaption(context);
      setCaption(newCaption);
    } catch (err) { console.error("AI Assist Failed"); }
    setIsGenerating(false);
  };

  // --- SUBMIT LOGIC (SHADOW SENTINEL 1-10) ---
  const handleSubmit = async () => {
    if (files.length === 0 && !caption.trim()) return;
    setIsUploading(true);
    setStatusSteps(['>> UPLINK ESTABLISHED...']); 

    try {
      let uploadedUrl = '';
      if (files.length > 0) {
        setStatusSteps(prev => [...prev, `>> Digitizing: ${files[0].name}...`]);
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );
        const cloudData = await cloudRes.json();
        uploadedUrl = cloudData.secure_url;
      }

      // Publication Instantanée
      setStatusSteps(prev => [...prev, '>> Patching Zenith Core...']);
      const newPost = await DB.addPost(caption, uploadedUrl);

      // Sentinel en arrière-plan (Shadow Mode)
      if (caption.trim().length > 3) {
        moderateContent(caption).then(async (result) => {
          if (result.riskScore >= 6) {
             console.log("Sentinel: Adjusting Visibility Score", result.riskScore);
             await DB.updatePostStatus(newPost.id, {
               visibility: result.riskScore >= 8 ? 'private' : 'restricted',
               risk_score: result.riskScore,
               violation: result.reason
             });
          }
        });
      }

      setStatusSteps(prev => [...prev, '>> TRANSMISSION COMPLETE.']);
      setTimeout(() => {
        setFiles([]);
        setCaption('');
        setIsUploading(false);
        setStatusSteps([]);
      }, 1000);

    } catch (error: any) {
      setIsUploading(false);
      setStatusSteps(prev => [...prev, `!! ERROR: ${error.message}`]);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20 p-4">
      <div className="flex justify-between items-center mb-8 border-b border-zenith-greenDim pb-4">
        <div>
          <h2 className="text-3xl font-tech text-white">SECURE TRANSMISSION</h2>
          <p className="text-zenith-dim text-sm">AI Sentinel v7.0 | Stealth Mode Active</p>
        </div>
        <button 
          onClick={handleSubmit} disabled={isUploading}
          className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${isUploading ? 'bg-gray-600 text-gray-300' : 'bg-zenith-green text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]'}`}
        >
          {isUploading ? <i className="fas fa-satellite fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          {isUploading ? 'TRANSMITTING' : 'PUBLISH'}
        </button>
      </div>

      {statusSteps.length > 0 && (
        <div className="mb-6 bg-black border border-zenith-green font-mono text-xs p-4 rounded-xl">
           {statusSteps.map((step, i) => (
             <div key={i} className={i === statusSteps.length - 1 ? 'text-zenith-green animate-pulse' : 'text-gray-500'}>{step}</div>
           ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div 
            className={`relative min-h-[350px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden ${dragActive ? 'border-zenith-green bg-zenith-greenDim/20' : 'border-zenith-dim bg-black/40'}`}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          >
            {files.length === 0 ? (
              <div className="text-center p-10">
                <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && setFiles(prev => [...prev, ...Array.from(e.target.files!)])} />
                <div className="w-20 h-20 bg-zenith-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-zenith-greenDim cursor-pointer" onClick={() => inputRef.current?.click()}>
                   <i className="fas fa-cloud-upload-alt text-3xl text-zenith-green"></i>
                </div>
                <h3 className="font-bold text-xl text-white">Drag & Drop Media</h3>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col">
                <div className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px]">
                  {files.map((file, i) => (
                    <div key={i} draggable onDragStart={(e) => onDragStart(e, i)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropItem(e, i)}
                      className="relative group bg-zenith-surface rounded-xl overflow-hidden border border-zenith-greenDim"
                    >
                      {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} className="w-full aspect-video object-cover" style={FILTERS[currentFilter].style} alt="preview" />
                      ) : (
                        <div className="aspect-video flex items-center justify-center bg-black/40"><i className="fas fa-file-alt text-3xl"></i></div>
                      )}
                      <div className="p-2 flex justify-between items-center bg-black/60">
                        <span className="text-[10px] truncate w-24">{file.name}</span>
                        <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-400"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* FILTERS BAR */}
                <div className="p-3 bg-black/60 border-t border-zenith-greenDim flex items-center gap-3 overflow-x-auto">
                   <span className="text-xs font-bold text-zenith-dim uppercase whitespace-nowrap">Visual FX:</span>
                   {FILTERS.map((f, idx) => (
                     <button key={idx} onClick={() => setCurrentFilter(idx)} className={`px-3 py-1 rounded text-xs font-bold transition-all ${currentFilter === idx ? 'bg-zenith-green text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>{f.name}</button>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* TEXTAREA AREA */}
          <div className="relative">
            <textarea 
              value={caption} onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-black/30 border border-zenith-greenDim rounded-xl p-4 text-white focus:outline-none focus:border-zenith-green h-32 resize-none"
              placeholder="Enter encrypted caption..."
            />
            <div className="absolute bottom-4 right-4 flex gap-3">
              <button onClick={handleAICaption} disabled={isGenerating} className="bg-zenith-surface border border-zenith-green text-zenith-green px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-zenith-green hover:text-black transition-all">
                {isGenerating ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-robot mr-2"></i>}
                AI ASSIST
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <AIChat />
        </div>
      </div>
    </div>
  );
};

export default Publish;
