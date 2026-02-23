import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as fabric from 'fabric';
import Toolbox from '../components/studio/Toolbox';
import PropertiesPanel from '../components/studio/PropertiesPanel';
import EditorView, { EditorViewRef } from '../components/studio/EditorView';
import Icon from '../components/Icon';
import { usePermissions } from '../hooks/usePermissions';

// CameraView and ImportView remain the same as before

const CameraView: React.FC<{ onCapture: (blob: Blob, type: 'image' | 'video') => void }> = ({ onCapture }) => {
  const { permissionState: cameraPermission, requestPermission: requestCamera } = usePermissions('camera');
  const { permissionState: microphonePermission, requestPermission: requestMicrophone } = usePermissions('microphone');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    try {
      if (stream) stream.getTracks().forEach(track => track.stop());
      const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode, width: 1920, height: 1080 }, audio: true });
      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
    } catch (error) { console.error("Error starting camera:", error); }
  }, [stream]);

  useEffect(() => {
    if (cameraPermission === 'granted' && microphonePermission === 'granted') startCamera(facingMode);
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [cameraPermission, microphonePermission, facingMode, startCamera]);

  const handlePermissions = async () => { await requestCamera(); await requestMicrophone(); };
  
  const handleTakePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => { if(blob) onCapture(blob, 'image'); }, 'image/jpeg');
      }
    }
  };

  if (cameraPermission !== 'granted' || microphonePermission !== 'granted') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 rounded-lg text-white p-4 text-center">
        <Icon icon="camera-retro" className="text-5xl text-white/30 mb-4" />
        <h3 className="text-xl font-bold mb-2">Camera & Mic Access</h3>
        <p className="text-white/40 mb-6 max-w-xs">Enable access to your camera and microphone to start creating.</p>
        <button onClick={handlePermissions} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">Allow Access</button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" muted />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
            <button onClick={handleTakePhoto} className="w-16 h-16 rounded-full border-4 border-white bg-white/20"></button>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6">
            <button onClick={() => setFacingMode(p => p === 'user' ? 'environment' : 'user')} className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white/80 hover:bg-black/60 transition-colors"><Icon icon="sync-alt" /></button>
        </div>
    </div>
  );
}

const ImportView: React.FC<{ onImport: (blob: Blob, type: 'image' | 'video') => void }> = ({ onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) onImport(file, file.type.startsWith('video') ? 'video' : 'image');
    };
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 rounded-lg text-white p-4 text-center">
            <Icon icon="upload" className="text-5xl text-white/30 mb-4" />
            <h3 className="text-xl font-bold mb-2">Import Media</h3>
            <p className="text-white/40 mb-6 max-w-xs">Select a photo or video from your device to start editing.</p>
            <button onClick={() => fileInputRef.current?.click()} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">Select File</button>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" className="hidden" />
        </div>
    );
}

const Studio: React.FC = () => {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('camera');
  const [media, setMedia] = useState<{url: string, type: 'image' | 'video'} | null>(null);
  const editorRef = useRef<EditorViewRef>(null);

  const handleMediaSelected = (blob: Blob, type: 'image' | 'video') => {
    setMedia({ url: URL.createObjectURL(blob), type });
  }

  const handleAddText = () => {
    const canvas = editorRef.current?.getCanvas();
    if (!canvas) return;

    const text = new fabric.IText('Hello World', {
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Rajdhani', // Assuming Rajdhani is loaded
        fill: '#FFFFFF',
        fontSize: 50,
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.8)', blur: 5, offsetX: 3, offsetY: 3 }),
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleToolSelect = (toolId: string) => {
      if (toolId === 'text') {
          handleAddText();
          // We don't set active tool to text to not show the properties panel yet
      } else {
          setActiveTool(toolId);
      }
  }
  
  const renderMainContent = () => {
    if (media) {
      return <EditorView ref={editorRef} media={media} />;
    }

    switch (activeTool) {
      case 'camera':
        return <CameraView onCapture={handleMediaSelected} />;
      case 'import':
        return <ImportView onImport={handleMediaSelected} />;
      default:
        return <div className="text-white">Select a tool to start</div>;
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0a0a] flex">
      <Toolbox activeTool={activeTool} onSelectTool={handleToolSelect} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-[#111111] border-b border-white/[0.04] flex-shrink-0 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
                <Icon icon="layout-template" className="text-white/40"/>
                <h1 className="text-lg font-bold text-white">Studio</h1>
            </div>
            <div className="flex items-center gap-2">
                 <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
                    <Icon icon="times" />
                </button>
                <button className="px-4 py-2 text-sm bg-emerald-500 rounded-lg text-white font-semibold hover:bg-emerald-600 transition-colors">
                    Export
                </button>
            </div>
        </header>

        <div className="flex-1 bg-black/30 flex items-center justify-center p-8">
            {renderMainContent()}
        </div>
      </main>

      <PropertiesPanel activeTool={activeTool} />
    </div>
  );
};

export default Studio;
