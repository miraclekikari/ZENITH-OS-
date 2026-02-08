import React from 'react';
import AccessDeniedModal from '../components/AccessDeniedModal';

export interface AuthGuardProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ isAuthenticated, onLogin, children }) => {
  const [showModal, setShowModal] = React.useState(false);

  const handleAction = () => {
    if (!isAuthenticated) {
      setShowModal(true);
      return false;
    }
    return true;
  };

  const handleProtectedAction = (callback: () => void) => {
    if (handleAction()) {
      callback();
    }
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement, { 
        onProtectedAction: handleProtectedAction 
      })}
      <AccessDeniedModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogin={onLogin}
      />
    </>
  );
};

export const useAuthGuard = () => {
  const [showModal, setShowModal] = React.useState(false);

  const requireAuth = (onLogin: () => void, callback: () => void) => {
    return () => {
      onLogin();
      callback();
    };
  };

  return { showModal, setShowModal, requireAuth };
};
