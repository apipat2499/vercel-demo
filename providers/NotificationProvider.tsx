'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationContainer from '@/components/NotificationContainer';

interface NotificationContextType {
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  const {
    notifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeNotification,
    clearAll
  } = useNotifications();

  const contextValue: NotificationContextType = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer 
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
}