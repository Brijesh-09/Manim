'use client';

import React, { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

export const AuthModalProvider = ({ children }) => {
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [user, setUser] = useState(null); // ✅ Add user state

  const triggerLoginModal = () => setShouldOpenModal(true);
  const resetModalTrigger = () => setShouldOpenModal(false);

  const updateUser = (data) => {
    console.log('Updating user in context:', data);
    setUser(data);
  };

  return (
    <AuthModalContext.Provider value={{
      shouldOpenModal,
      triggerLoginModal,
      resetModalTrigger,
      user,            // ✅ Expose user
      updateUser       // ✅ Expose updater
    }}>
      {children}
    </AuthModalContext.Provider>
  );
};
