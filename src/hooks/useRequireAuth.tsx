import React from 'react';
import AccessDeniedModal from '../components/AccessDeniedModal';

export const useRequireAuth = (isAuthenticated: boolean, onLogin: () => void) => {
  const [showModal, setShowModal] = React.useState(false);

  const requireAuth = (callback: () => void) => {
    return (e?: React.MouseEvent) => {
      e?.preventDefault();
      if (!isAuthenticated) {
        setShowModal(true);
        return;
      }
      callback();
    };
  };

  const showAuthModal = () => setShowModal(true);
  const hideAuthModal = () => setShowModal(false);

  const AuthModal = () => (
    <AccessDeniedModal
      isOpen={showModal}
      onClose={hideAuthModal}
      onLogin={onLogin}
    />
  );

  return { 
    requireAuth, 
    showModal, 
    showAuthModal, 
    hideAuthModal,
    AuthModal
  };
};

export default useRequireAuth;
