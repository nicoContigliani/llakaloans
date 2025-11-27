'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface NotificationContextType {
  // Puedes agregar estado global aquí si es necesario
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  // Aquí puedes agregar estado global para notificaciones si lo necesitas
  
  const value: NotificationContextType = {
    // Valores del contexto
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};