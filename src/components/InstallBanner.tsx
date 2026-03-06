import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide banner if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

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
      setIsInstallable(false);
    });
  };

  if (!isInstallable) {
    return null;
  }

  return (
    <div className="bg-white/[.03] backdrop-blur-md border-b border-white/10 py-1.5">
      <div className="flex justify-between items-center max-w-4xl mx-auto px-4">
        <p className="text-sm font-mono text-white/80">[ SYSTEM_UPDATE: APP_INSTALL_AVAILABLE ]</p>
        <button 
          onClick={handleInstallClick} 
          className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          [ INSTALL ]
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;
