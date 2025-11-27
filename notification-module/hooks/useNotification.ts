import { useState, useCallback } from 'react';
import { NotificationMessage, NotificationResult } from '../types/notification';

export const useNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendNotification = useCallback(async (message: NotificationMessage): Promise<NotificationResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/notification/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send notification');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const sendBulkNotifications = useCallback(async (messages: NotificationMessage[]): Promise<NotificationResult[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/notification/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bulk: true, messages }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send notifications');
      }

      return result.results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return messages.map(() => ({
        success: false,
        error: errorMessage,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendNotification,
    sendBulkNotifications,
    loading,
    error,
    clearError: () => setError(null),
  };
};