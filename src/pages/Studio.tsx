import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '../hooks/usePermissions';
import Icon from '../components/Icon';

const Studio: React.FC = () => {
  const { t } = useTranslation();
  const cameraPermission = usePermissions('camera');
  const micPermission = usePermissions('microphone');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getMedia = async () => {
    if (cameraPermission.permissionState !== 'granted' || micPermission.permissionState !== 'granted') {
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  useEffect(() => {
    if (cameraPermission.permissionState === 'granted' && micPermission.permissionState === 'granted') {
      getMedia();
    }
    return () => {
        mediaStream?.getTracks().forEach(track => track.stop());
    }
  }, [cameraPermission.permissionState, micPermission.permissionState]);

  const renderPermissions = () => (
    <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">{t('studio.grantAccess')}</h2>
        <p className="mb-6">{t('studio.grantAccessHint')}</p>
        {cameraPermission.permissionState !== 'granted' && 
            <button onClick={cameraPermission.requestPermission} className="bg-blue-500 text-white px-6 py-2 rounded-lg mb-4">{t('studio.enableCamera')}</button>}
        {micPermission.permissionState !== 'granted' && 
            <button onClick={micPermission.requestPermission} className="bg-blue-500 text-white px-6 py-2 rounded-lg">{t('studio.enableMicrophone')}</button>}
    </div>
  );

  const renderStudio = () => (
    <div className="w-full h-full relative text-white">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 flex flex-col gap-4">
            <button className="bg-black/50 p-3 rounded-full"><Icon icon="fas fa-sync-alt" /><span> {t('studio.flip')}</span></button>
            <button className="bg-black/50 p-3 rounded-full"><Icon icon="fas fa-bolt" /><span> {t('studio.flash')}</span></button>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-8">
            <button className="bg-black/50 p-3 rounded-full"><Icon icon="fas fa-photo-video" /><span> {t('studio.upload')}</span></button>
            <button className="w-20 h-20 border-4 border-white rounded-full bg-red-500"></button>
            <button className="bg-black/50 p-3 rounded-full"><Icon icon="fas fa-magic" /><span> {t('studio.effects')}</span></button>
        </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      {(cameraPermission.permissionState === 'granted' && micPermission.permissionState === 'granted') ? renderStudio() : renderPermissions()}
    </div>
  );
};

export default Studio;
