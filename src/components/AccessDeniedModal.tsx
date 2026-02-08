import React from 'react';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="bg-zinc-950 border border-zenith-green rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_40px_rgba(0,255,136,0.3)]">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-lock text-red-500 text-2xl"></i>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            ACCÈS REFUSÉ
          </h2>
          
          <p className="text-zenith-dim mb-8">
            Cette fonctionnalité nécessite une connexion au réseau neural. Veuillez initialiser votre connexion pour continuer.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                onClose();
                onLogin();
              }}
              className="flex-1 px-6 py-3 bg-zenith-green text-black font-bold rounded-lg hover:shadow-[0_0_15px_var(--z-primary)] transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-link"></i>
              CONNECT NEURAL LINK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessDeniedModal;
