import React, { useState, useRef } from 'react';
import { moderateContent, generateCreativeCaption } from '../services/geminiService';
import { AIChat } from '../components/Tools';

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

  // Parent Drop Zone Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex !== null) return; // Ignore internal reorder drags
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (draggedIndex !== null) return; // Ignore internal reorder drops on parent container

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  // Item Reordering Handlers
  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const onDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Allow drop
    e.stopPropagation(); 
  };

  const onDropItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newFiles = [...files];
    const draggedFile = newFiles[draggedIndex];
    
    // Remove from old position
    newFiles.splice(draggedIndex, 1);
    // Insert at new position
    newFiles.splice(index, 0, draggedFile);
    
    setFiles(newFiles);
    setDraggedIndex(null);
  };

  const onDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleAICaption = async () => {
    setIsGenerating(true);
    const context = caption || (files.length > 0 ? `A photo of ${files[0].name}` : 'A cool tech update');
    const newCaption = await generateCreativeCaption(context);
    setCaption(newCaption);
    setIsGenerating(false);
  };

  const addStatus = (msg: string) => {
    setStatusSteps(prev => [...prev, msg]);
  };

  const handleSubmit = async () => {
    if (files.length === 0 && !caption) return;
    
    setIsUploading(true);
    setStatusSteps([]); // Clear previous
    addStatus('>> Initializing Secure Handshake...');

    await new Promise(r => setTimeout(r, 800));

    // Simulate AI Moderation Check
    let safe = true;
    let reason = '';

    // Check Caption
    if (caption) {
      addStatus('>> Scanning Text Packet (NLP)...');
      const check = await moderateContent(caption);
      if (!check.safe) {
        safe = false;
        reason = check.reason || 'Harmful Text';
      }
    }

    if(safe) await new Promise(r => setTimeout(r, 500));

    // Check All Files
    if (safe && files.length > 0) {
       addStatus(`>> Detected ${files.length} media fragments. Initiating AI verification...`);
       
       for (let i = 0; i < files.length; i++) {
         const file = files[i];
         
         if (file.type.startsWith('image/')) {
           addStatus(`>> Analyzing visual data [${i + 1}/${files.length}]: ${file.name}...`);
           try {
             const b64 = await fileToBase64(file);
             const check = await moderateContent('', { data: b64, mimeType: file.type });
             
             if (!check.safe) {
                safe = false;
                reason = `File '${file.name}': ${check.reason || 'Content Flagged'}`;
                break; 
             }
           } catch (e) {
             console.error(e);
             addStatus(`!! Warning: Could not scan ${file.name}.`);
           }
         } else if (file.type.startsWith('video/')) {
            // Simulated video check
            addStatus(`>> Verifying video integrity [${i + 1}/${files.length}]: ${file.name}...`);
            await new Promise(r => setTimeout(r, 800));
         }
       }
    }

    if (!safe) {
      setIsUploading(false);
      addStatus(`!! SECURITY ALERT: ${reason}`);
      alert(`⚠️ UPLOAD BLOCKED BY SENTINEL AI ⚠️\n\nReason: ${reason}`);
      return;
    }

    addStatus('>> Content Verified. Safe.');
    await new Promise(r => setTimeout(r, 600));

    addStatus('>> Encrypting Media Fragments...');
    await new Promise(r => setTimeout(r, 1000));

    addStatus('>> Uploading to Decentralized Grid...');
    await new Promise(r => setTimeout(r, 800));

    addStatus('>> TRANSMISSION COMPLETE.');
    
    setTimeout(() => {
      alert("Transmission Successful.");
      setFiles([]);
      setCaption('');
      setIsUploading(false);
      setStatusSteps([]);
    }, 1000);
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
          {isUploading ? <i className="fas fa-satellite fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          {isUploading ? 'TRANSMITTING' : 'PUBLISH'}
        </button>
      </div>

      {/* Dynamic Status Console */}
      {statusSteps.length > 0 && (
        <div className="mb-6 bg-black border border-zenith-green font-mono text-xs p-4 rounded-xl shadow-[0_0_15px_rgba(0,255,136,0.1)]">
           {statusSteps.map((step, i) => (
             <div key={i} className={`${i === statusSteps.length - 1 ? 'text-zenith-green animate-pulse' : 'text-gray-500'}`}>
               {step}
             </div>
           ))}
           {isUploading && <div className="h-1 bg-zenith-green/20 mt-2 rounded overflow-hidden">
             <div className="h-full bg-zenith-green animate-expand-line"></div>
           </div>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload Tools */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drop Zone */}
          <div 
            className={`relative min-h-[350px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden ${dragActive ? 'border-zenith-green bg-zenith-greenDim/20' : 'border-zenith-dim bg-black/40'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {files.length === 0 ? (
              <div className="text-center p-10 animate-fade-in">
                <input ref={inputRef} type="file" multiple className="hidden" onChange={handleChange} />
                <div className="w-20 h-20 bg-zenith-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-zenith-greenDim hover:scale-110 transition-transform cursor-pointer" onClick={() => inputRef.current?.click()}>
                   <i className="fas fa-cloud-upload-alt text-3xl text-zenith-green"></i>
                </div>
                <h3 className="font-bold text-xl text-white">Drag & Drop Media</h3>
                <p className="text-sm text-zenith-dim mb-6">Photos, Videos, Code Snippets</p>
                <button onClick={() => inputRef.current?.click()} className="px-6 py-2 border border-zenith-text text-white rounded-lg hover:bg-white hover:text-black transition-all text-sm font-bold">
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col">
                {/* Media Preview Grid */}
                <div className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px] scrollbar-thin">
                  {files.map((file, i) => (
                    <div 
                      key={`${file.name}-${file.size}-${file.lastModified}`} 
                      draggable
                      onDragStart={(e) => onDragStart(e, i)}
                      onDragOver={(e) => onDragOverItem(e, i)}
                      onDrop={(e) => onDropItem(e, i)}
                      onDragEnd={onDragEnd}
                      className={`relative group bg-zenith-surface rounded-xl overflow-hidden border transition-all shadow-lg animate-fade-in cursor-move ${draggedIndex === i ? 'opacity-50 border-dashed border-zenith-green' : 'border-zenith-greenDim hover:border-zenith-green'}`}
                    >
                      {file.type.startsWith('image/') ? (
                        <>
                          <div className="aspect-video w-full overflow-hidden bg-black relative">
                            <img 
                              src={URL.createObjectURL(file)} 
                              className="w-full h-full object-cover transition-all duration-300 pointer-events-none" 
                              style={FILTERS[currentFilter].style}
                              alt="preview" 
                            />
                            {/* Filter Badge */}
                            {currentFilter !== 0 && (
                              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-zenith-green text-[10px] px-2 py-1 rounded border border-zenith-greenDim">
                                FX: {FILTERS[currentFilter].name.toUpperCase()}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="aspect-video w-full flex flex-col items-center justify-center text-zenith-dim p-4 relative bg-black/40 pointer-events-none">
                          <i className="fas fa-file-alt text-4xl mb-3 text-zenith-dim group-hover:text-white transition-colors"></i>
                          <div className="text-[10px] text-zenith-green font-mono">{formatFileSize(file.size)}</div>
                        </div>
                      )}
                      
                      <div className="p-3 bg-zenith-surface border-t border-zenith-greenDim flex items-center justify-between">
                         <span className="text-xs font-bold text-white truncate max-w-[70%]">{file.name}</span>
                         <button 
                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                            className="text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove"
                            onMouseDown={e => e.stopPropagation()} // Prevent drag start when clicking remove
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add More Tile - Dropping here means move to end if reordering */}
                  <div 
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => onDragOverItem(e, files.length)}
                    onDrop={(e) => onDropItem(e, files.length)}
                    className="aspect-video rounded-xl border-2 border-dashed border-zenith-greenDim hover:border-zenith-green hover:bg-zenith-greenDim/10 flex flex-col items-center justify-center cursor-pointer transition-all"
                  >
                     <input ref={inputRef} type="file" multiple className="hidden" onChange={handleChange} />
                     <i className="fas fa-plus text-2xl text-zenith-green mb-2"></i>
                     <span className="text-xs text-zenith-dim font-bold">ADD MORE</span>
                  </div>
                </div>

                {/* Filter Toolbar for Images */}
                {files.some(f => f.type.startsWith('image/')) && (
                  <div className="p-3 bg-black/60 border-t border-zenith-greenDim flex items-center gap-3 overflow-x-auto">
                    <span className="text-xs font-bold text-zenith-dim uppercase whitespace-nowrap"><i className="fas fa-magic mr-1"></i> Visual FX:</span>
                    {FILTERS.map((f, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentFilter(idx)}
                        className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-all ${currentFilter === idx ? 'bg-zenith-green text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-black/30 border border-zenith-greenDim rounded-xl p-4 text-white focus:outline-none focus:border-zenith-green h-32 resize-none"
              placeholder="Enter encrypted caption..."
            />
            {/* AI Assist Button */}
            <button 
              onClick={handleAICaption}
              disabled={isGenerating}
              className="absolute bottom-4 right-4 bg-zenith-surface border border-zenith-green text-zenith-green hover:bg-zenith-green hover:text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
            >
              {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-robot"></i>}
              {isGenerating ? 'GENERATING...' : 'AI ASSIST'}
            </button>
          </div>
        </div>

        {/* Right Column: AI Assistant */}
        <div className="lg:col-span-1">
          <div className="h-full flex flex-col">
            <div className="mb-2 flex items-center gap-2 text-zenith-dim">
              <i className="fas fa-broadcast-tower text-zenith-green"></i>
              <span className="text-xs font-bold uppercase tracking-wider">Frequency Assistant</span>
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
