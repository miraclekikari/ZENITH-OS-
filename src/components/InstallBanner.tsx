import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Vérifie si l'application est déjà en mode standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
      return;
    }

    // Détecte si l'utilisateur est sur iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
      setIsAppInstalled(true); // On suppose que l'installation réussit
    });
  };

  const handleCloseBanner = () => {
    setDeferredPrompt(null); // Cache la bannière pour la session
  }

  if (isAppInstalled) {
    return null;
  }

  if (isIos && !isAppInstalled) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-500/10 p-2 text-center font-mono text-[10px] text-emerald-500">
        <span>Pour installer ZENITH, appuyez sur 'Partager' puis 'Sur l'écran d'accueil'.</span>
      </div>
    );
  }

  if (!deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-emerald-500/10 p-2 text-center font-mono text-[10px] text-emerald-500 animate-pulse">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <span /> 
        <button onClick={handleInstallClick} className="flex-grow text-center">
          [ SYSTEM_READY: CLICK TO INSTALL ZENITH_OS ]
        </button>
        <button onClick={handleCloseBanner} className="text-xs font-bold">X</button>
      </div>
    </div>
  );
};

export default InstallBanner;
