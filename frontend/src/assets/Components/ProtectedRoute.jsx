import React, { useState, useEffect } from 'react';
import AccountRequiredModal from './AccountRequiredModal';

const AuthGate = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      setShowModal(true);
    }
  }, [user, token]);

  if (user && token) {
    return children;
  }

  return <AccountRequiredModal isOpen={showModal} onClose={() => setShowModal(false)} />;
};

export default AuthGate;

