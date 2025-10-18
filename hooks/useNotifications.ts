'use client';

import { useState, useCallback } from 'react';

export interface NotificationData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((
    message: string, 
    type: NotificationData['type'] = 'info', 
    duration = 5000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const notification: NotificationData = {
      id,
      message,
      type,
      duration
    };

    setNotifications(prev => [...prev, notification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const showError = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const showInfo = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  const showWarning = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};