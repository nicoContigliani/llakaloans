'use client';

import React, { useState } from 'react';
import { useNotification } from '../hooks/useNotification';
import { NotificationMessage } from '../types/notification';
import styles from './NotificationButton.module.css';

interface NotificationButtonProps {
  message: Omit<NotificationMessage, 'channel'>;
  channel?: NotificationMessage['channel'];
  buttonText?: string;
  className?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  message,
  channel = 'email',
  buttonText = 'Send Notification',
  className = '',
  onSuccess,
  onError
}) => {
  const { sendNotification, loading, error } = useNotification();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleClick = async () => {
    setLocalError(null);
    
    const notificationMessage: NotificationMessage = {
      ...message,
      channel
    };

    const result = await sendNotification(notificationMessage);
    
    if (result.success) {
      onSuccess?.(result);
    } else {
      const errorMessage = result.error || 'Failed to send notification';
      setLocalError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const displayError = error || localError;

  return (
    <div className={`${styles.container} ${className}`}>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`${styles.button} ${loading ? styles.loading : ''}`}
      >
        {loading ? 'Sending...' : buttonText}
      </button>
      {displayError && (
        <div className={styles.error}>
          {displayError}
        </div>
      )}
    </div>
  );
};