// notification-module/hooks/useReturnHomeNotification.ts
import { useState, useCallback } from 'react';

export const useReturnHomeNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendReturnHomeNotification = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/notification/return-home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send return home notification');
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

  return {
    sendReturnHomeNotification,
    loading,
    error,
    clearError: () => setError(null),
  };
};