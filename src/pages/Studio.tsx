
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '../hooks/usePermissions';
import Icon from '../components/Icon';

const Studio: React.FC = () => {
  const { t } = useTranslation();
  const { permissions, requestPermissions, checkPermissions } = usePermissions(['camera', 'microphone']);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: true,
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error("Error starting camera:", error);
      // Fallback to asking for permissions again if it fails
      await requestPermissions();
    }
  };

  useEffect(() => {
    if (permissions.camera === 'granted' && permissions.microphone === 'granted') {
      startCamera(facingMode);
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [permissions, facingMode]);


  const handleFlipCamera = () => {
    setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const handleToggleFlash = () => {
      if (!stream) return;
      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();
      // @ts-ignore
      if (capabilities.torch) {
          // @ts-ignore
          videoTrack.applyConstraints({ advanced: [{ torch: !flashOn }] });
          setFlashOn(!flashOn);
      } else {
          console.log("Flash/Torch not available on this device.");
      }
  }

  // If permissions are not determined yet
  if (permissions.camera === 'prompt' || permissions.microphone === 'prompt') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white p-4">
        <Icon icon="fa-camera-retro" className="text-6xl text-zenith-primary mb-6" />
        <h2 className="text-2xl font-bold mb-2">{t('studio.grantAccess')}</h2>
        <p className="text-center text-zenith-dim mb-8 max-w-sm">{t('studio.grantAccessHint')}</p>
        <div className="flex gap-4">
            <button
                onClick={async () => {
                    await requestPermissions();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
            >
                <i className="fas fa-check mr-2"></i>
                {t('studio.grantAccess')}
            </button>
        </div>
      </div>
    );
  }

  // If permissions are denied
  if (permissions.camera === 'denied' || permissions.microphone === 'denied') {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white p-4">
            <Icon icon="fa-exclamation-triangle" className="text-6xl text-red-500 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Accès refusé</h2>
            <p className="text-center text-zenith-dim mb-8 max-w-sm">
                Vous avez refusé l'accès à la caméra ou au microphone. Veuillez autoriser l'accès dans les paramètres de votre navigateur pour continuer.
            </p>
        </div>
    );
  }

  // If permissions are granted
  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" muted />

        {/* --- UI OVERLAYS --- */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
            <button className="text-white text-2xl"><i className="fas fa-times"></i></button>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full p-2">
                <i className="fas fa-music text-white"></i>
                <span className="text-white text-sm font-bold">Ajouter un son</span>
            </div>
            <div></div>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-6">
            <button onClick={handleFlipCamera} className="flex flex-col items-center text-white">
                <i className="fas fa-sync-alt text-2xl"></i>
                <span className="text-xs mt-1">Retourner</span>
            </button>
            <button className="flex flex-col items-center text-white">
                <i className="fas fa-tachometer-alt text-2xl"></i>
                <span className="text-xs mt-1">Vitesse</span>
            </button>
            <button onClick={handleToggleFlash} className={`flex flex-col items-center transition-colors ${flashOn ? 'text-yellow-400' : 'text-white'}`}>
                <i className="fas fa-bolt text-2xl"></i>
                <span className="text-xs mt-1">Flash</span>
            </button>
            <button className="flex flex-col items-center text-white">
                <i className="fas fa-magic text-2xl"></i>
                <span className="text-xs mt-1">{t('studio.effects')}</span>
            </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-center">
            <div className="flex items-center gap-8">
                <button className="text-white font-bold">Story</button>
                <button className="w-20 h-20 rounded-full bg-white/90 border-4 border-white shadow-lg ring-4 ring-red-500 ring-offset-4 ring-offset-black"></button>
                <button className="text-white font-bold">Reel</button>
            </div>
        </div>
    </div>
  );
};

export default Studio;
