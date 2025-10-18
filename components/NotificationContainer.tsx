'use client';

import { useNotifications, NotificationData } from '@/hooks/useNotifications';
import Notification from './Notification';

interface NotificationContainerProps {
  notifications: NotificationData[];
  removeNotification: (id: string) => void;
}

export default function NotificationContainer({ 
  notifications, 
  removeNotification 
}: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index
          }}
        >
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
}