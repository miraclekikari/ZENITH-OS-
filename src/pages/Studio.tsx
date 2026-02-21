import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import Icon from '../components/Icon';
import { useNavigate } from 'react-router-dom';
import { fabric } from 'fabric';

// Toolbar for the editor
const EditorToolbar: React.FC<{ onAddText: () => void }> = ({ onAddText }) => (
  <div className="absolute top-16 right-4 flex flex-col gap-6 p-2 rounded-lg bg-black/30 z-20">
    <button onClick={onAddText} className="text-white"><Icon icon="font" className="text-2xl" /></button>
    <button className="text-white"><Icon icon="smile" className="text-2xl" /></button>
    <button className="text-white"><Icon icon="magic" className="text-2xl" /></button>
  </div>
);

const Studio: React.FC = () => {
  const navigate = useNavigate();
  const { permissionState: cameraPermission, requestPermission: requestCamera } = usePermissions('camera');
  const { permissionState: microphonePermission, requestPermission: requestMicrophone } = usePermissions('microphone');

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'live'>('photo');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [flashOn, setFlashOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    try {
      if (stream) stream.getTracks().forEach(track => track.stop());
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: 1920, height: 1080 },
        audio: true,
      });
      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  }, [stream]);

  useEffect(() => {
    if (cameraPermission === 'granted' && microphonePermission === 'granted') {
      startCamera(facingMode);
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [cameraPermission, microphonePermission, facingMode, startCamera, stream]);

  const handlePermissions = async () => {
    await requestCamera();
    await requestMicrophone();
  };

  const handleFlipCamera = () => setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));

  const handleToggleFlash = async () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities() as any;
    if (capabilities.torch) {
      try {
        await videoTrack.applyConstraints({ advanced: [{ torch: !flashOn }] } as any);
        setFlashOn(!flashOn);
      } catch (err) { console.error("Error toggling flash:", err); }
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedMedia(dataUrl);
        setIsPreviewing(true);
      }
    }
  };

  const handleStartRecording = () => {
    if (stream) {
      setIsRecording(true);
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = event => chunks.push(event.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setCapturedMedia(url);
        setIsPreviewing(true);
      };
      mediaRecorderRef.current.start();
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStartLive = () => setIsLive(true);
  const handleStopLive = () => setIsLive(false);

  const handleCapture = () => {
    switch (mediaType) {
      case 'photo': handleTakePhoto(); break;
      case 'video': isRecording ? handleStopRecording() : handleStartRecording(); break;
      case 'live': isLive ? handleStopLive() : handleStartLive(); break;
    }
  };

  const handleGalleryImport = () => fileInputRef.current?.click();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedMedia(url);
      setMediaType(file.type.startsWith('video') ? 'video' : 'photo');
      setIsPreviewing(true);
    }
  };

  const handleDiscard = () => {
    setCapturedMedia(null);
    setIsPreviewing(false);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }
    startCamera(facingMode);
  };

  const handlePost = () => {
    // Here you would get the canvas data with fabricCanvasRef.current.toDataURL()
    // and upload it along with the media.
    console.log("Posting media:", capturedMedia);
    handleDiscard();
  };

  const handleAddText = () => {
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      const text = new fabric.IText('Tapez ici', {
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Rajdhani', // Use a font from the project
        fill: '#FFFFFF',
        fontSize: 40,
        shadow: 'rgba(0,0,0,0.7) 2px 2px 4px',
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    }
  };

  // Initialize Fabric.js canvas when previewing
  useEffect(() => {
    if (isPreviewing && canvasRef.current && capturedMedia) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: false,
      });
      fabricCanvasRef.current = canvas;

      const setCanvasSize = () => {
        if (canvasRef.current) {
          const parent = canvasRef.current.parentElement;
          if (parent) {
            canvas.setWidth(parent.clientWidth);
            canvas.setHeight(parent.clientHeight);
            canvas.renderAll();
          }
        }
      };

      if (mediaType === 'photo') {
        fabric.Image.fromURL(capturedMedia, (img) => {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width! / (img.width || 1),
            scaleY: canvas.height! / (img.height || 1),
          });
        });
      }
      setCanvasSize();
      window.addEventListener('resize', setCanvasSize);

      return () => window.removeEventListener('resize', setCanvasSize);
    }
  }, [isPreviewing, capturedMedia, mediaType]);

  const renderPermissionsPrompt = () => (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white p-4 text-center">
      <Icon icon="camera-retro" className="text-6xl text-cyan-400 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Accès Caméra & Micro</h2>
      <p className="text-gray-400 mb-8 max-w-sm">Autorisez l'accès pour capturer des photos et vidéos.</p>
      <button onClick={handlePermissions} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105">Autoriser</button>
    </div>
  );

  const renderPermissionsDenied = () => (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white p-4 text-center">
      <Icon icon="exclamation-triangle" className="text-6xl text-red-500 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Accès Refusé</h2>
      <p className="text-gray-400 mb-8 max-w-sm">Activez l'accès à la caméra et au micro dans les paramètres de votre navigateur.</p>
    </div>
  );

  const renderPreview = () => (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
      <div className="absolute inset-0"> 
        {mediaType === 'video' && <video src={capturedMedia!} controls autoPlay loop className="w-full h-full object-contain" />}
      </div>
      <canvas ref={canvasRef} />
      <EditorToolbar onAddText={handleAddText} />

      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-10">
        <button onClick={handleDiscard} className="text-white text-2xl"><Icon icon="times" /></button>
      </div>

      {/* Bottom Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent flex justify-center z-10">
        <button onClick={handlePost} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-12 rounded-full transition-transform transform hover:scale-105">Publier</button>
      </div>
    </div>
  );

  const renderStudio = () => (
    <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" muted />
      {isLive && <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">LIVE</div>}

      {/* Overlays */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <button onClick={() => navigate(-1)} className="text-white text-2xl"><Icon icon="times" /></button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-10">
        <button onClick={handleFlipCamera} className="text-white"><Icon icon="sync-alt" className="text-2xl" /></button>
        <button onClick={handleToggleFlash} className={`transition-colors ${flashOn ? 'text-yellow-400' : 'text-white'}`}><Icon icon="bolt" className="text-2xl" /></button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center z-10">
        <div className="flex items-center justify-center gap-8 w-full">
          <button onClick={handleGalleryImport} className="text-white"><Icon icon="images" className="text-3xl" /></button>
          <button onClick={handleCapture} className={`w-20 h-20 rounded-full border-4 shadow-lg flex items-center justify-center transition-colors ${isRecording ? 'bg-red-500' : isLive ? 'bg-red-600 ring-4 ring-red-400' : 'bg-white/30'} border-white`}>
            {isRecording && <div className="w-8 h-8 bg-white rounded-md"></div>}
            {mediaType === 'live' && !isLive && <span className='text-white font-bold'>GO</span>}
          </button>
          <div className="w-10 h-10"></div> { /* Spacer */}
        </div>
        <div className="flex gap-6 mt-4">
          <button onClick={() => setMediaType('photo')} className={`font-bold transition-colors ${mediaType === 'photo' ? 'text-white' : 'text-gray-500'}`}>PHOTO</button>
          <button onClick={() => setMediaType('video')} className={`font-bold transition-colors ${mediaType === 'video' ? 'text-white' : 'text-gray-500'}`}>VIDEO</button>
          <button onClick={() => setMediaType('live')} className={`font-bold transition-colors ${mediaType === 'live' ? 'text-white' : 'text-gray-500'}`}>LIVE</button>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" className="hidden" />
    </div>
  );

  if (cameraPermission !== 'granted' || microphonePermission !== 'granted') {
    if (cameraPermission === 'prompt' || microphonePermission === 'prompt') return renderPermissionsPrompt();
    return renderPermissionsDenied();
  }

  return isPreviewing && capturedMedia ? renderPreview() : renderStudio();
};

export default Studio;
