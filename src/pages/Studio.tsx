import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '../hooks/usePermissions';
import Icon from '../components/Icon';
import { useNavigate } from 'react-router-dom';

const Studio: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { permissionState: cameraPermission, requestPermission: requestCamera } = usePermissions('camera');
  const { permissionState: microphonePermission, requestPermission: requestMicrophone } = usePermissions('microphone');

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [flashOn, setFlashOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: 1920, height: 1080 },
        audio: true,
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  }, [stream]);

  useEffect(() => {
    if (cameraPermission === 'granted' && microphonePermission === 'granted') {
      startCamera(facingMode);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraPermission, microphonePermission, facingMode, startCamera, stream]);

  const handlePermissions = async () => {
    await requestCamera();
    await requestMicrophone();
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleToggleFlash = async () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities() as any;
    if (capabilities.torch) {
      try {
        await videoTrack.applyConstraints({ advanced: [{ torch: !flashOn }] } as any);
        setFlashOn(!flashOn);
      } catch (error) {
        console.error("Error toggling flash:", error);
      }
    } else {
      console.log("Flash/Torch not available on this device.");
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
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };
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

  const handleCapture = () => {
    if (mediaType === 'photo') {
      handleTakePhoto();
    } else {
      if (isRecording) {
        handleStopRecording();
      } else {
        handleStartRecording();
      }
    }
  };
  
  const handleGalleryImport = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

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
    startCamera(facingMode);
  };
  
  const handlePost = () => {
    console.log("Posting media:", capturedMedia);
    // Here you would typically upload the media to a server
    // For now, we'll just reset
    handleDiscard();
  };

  if (cameraPermission === 'prompt' || microphonePermission === 'prompt') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white p-4 text-center">
        <Icon icon="camera-retro" className="text-6xl text-cyan-400 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Accès à la Caméra et au Micro</h2>
        <p className="text-gray-400 mb-8 max-w-sm">Nous avons besoin de votre autorisation pour capturer des photos et des vidéos.</p>
        <button onClick={handlePermissions} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105">
          Autoriser
        </button>
      </div>
    );
  }

  if (cameraPermission === 'denied' || microphonePermission === 'denied') {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white p-4 text-center">
            <Icon icon="exclamation-triangle" className="text-6xl text-red-500 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Accès Refusé</h2>
            <p className="text-gray-400 mb-8 max-w-sm">
                L'accès à la caméra ou au microphone a été refusé. Veuillez l'activer dans les paramètres de votre navigateur pour utiliser le Studio.
            </p>
        </div>
    );
  }

  if (isPreviewing && capturedMedia) {
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
        {mediaType === 'photo' ? (
          <img src={capturedMedia} alt="Preview" className="max-w-full max-h-full object-contain" />
        ) : (
          <video src={capturedMedia} controls autoPlay loop className="max-w-full max-h-full object-contain" />
        )}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <button onClick={handleDiscard} className="text-white text-2xl"><i className="fas fa-times"></i></button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent flex justify-center">
          <button onClick={handlePost} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-12 rounded-full transition-transform transform hover:scale-105">
            Publier
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" muted />
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <button onClick={() => navigate(-1)} className="text-white text-2xl"><i className="fas fa-times"></i></button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-10">
        <button onClick={handleFlipCamera} className="flex flex-col items-center text-white text-shadow"><i className="fas fa-sync-alt text-2xl"></i></button>
        <button onClick={handleToggleFlash} className={`flex flex-col items-center transition-colors text-shadow ${flashOn ? 'text-yellow-400' : 'text-white'}`}><i className="fas fa-bolt text-2xl"></i></button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center z-10">
        <div className="flex items-center justify-center gap-8">
          <button onClick={handleGalleryImport} className="text-white text-2xl"><i className="fas fa-images"></i></button>
          <button onClick={handleCapture} className={`w-20 h-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-white/30'}`}>
            {isRecording && <div className="w-8 h-8 bg-white rounded-md"></div>}
          </button>
          <div className="w-10"></div>
        </div>
        <div className="flex gap-6 mt-4">
          <button onClick={() => setMediaType('photo')} className={`font-bold ${mediaType === 'photo' ? 'text-white' : 'text-gray-500'}`}>PHOTO</button>
          <button onClick={() => setMediaType('video')} className={`font-bold ${mediaType === 'video' ? 'text-white' : 'text-gray-500'}`}>VIDEO</button>
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" className="hidden" />
    </div>
  );
};

export default Studio;
