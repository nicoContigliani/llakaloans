// En notification-module/components/ReturnHomeButton.tsx
'use client';

import React from 'react';
import { useReturnHomeNotification } from '../hooks/useReturnHomeNotification';

interface ReturnHomeButtonProps {
  data: {
    id?: string;
    todo: string;
    todos: any;
  };
  buttonText?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export const ReturnHomeButton: React.FC<ReturnHomeButtonProps> = ({
  data,
  buttonText = 'Send Return Home',
  onSuccess,
  onError
}) => {
  const { sendReturnHomeNotification, loading, error } = useReturnHomeNotification();

  const handleClick = async () => {
    const result = await sendReturnHomeNotification(data);
    
    if (result.success) {
      onSuccess?.(result);
    } else {
      onError?.(result.error || 'Failed to send return home notification');
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Sending...' : buttonText}
      </button>
      {error && (
        <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '8px' }}>
          {error}
        </div>
      )}
    </div>
  );
};