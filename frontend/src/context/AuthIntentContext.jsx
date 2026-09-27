import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthIntentContext = createContext(null);

export const AuthIntentProvider = ({ children }) => {
  const [intent, setIntent] = useState(() => {
    const saved = sessionStorage.getItem('authIntent');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (intent) {
      sessionStorage.setItem('authIntent', JSON.stringify(intent));
    } else {
      sessionStorage.removeItem('authIntent');
    }
  }, [intent]);

  const clearIntent = () => setIntent(null);

  return (
    <AuthIntentContext.Provider value={{ intent, setIntent, clearIntent }}>
      {children}
    </AuthIntentContext.Provider>
  );
};

export const useAuthIntent = () => useContext(AuthIntentContext);
