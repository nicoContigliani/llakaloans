'use client';

import React, { useState } from 'react';
import { PaymentItem, PaymentMetadata, PaymentProvider } from '../types/payment';

interface PaymentButtonProps {
  provider: PaymentProvider;
  items: PaymentItem[];
  metadata?: PaymentMetadata;
  onSuccess?: (payment: any) => void;
  onError?: (error: string) => void;
  onProcessing?: () => void;
  buttonText?: string;
  buttonStyle?: React.CSSProperties;
  disabled?: boolean;
  backUrl?: string;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  provider,
  items,
  metadata,
  onSuccess,
  onError,
  onProcessing,
  buttonText = 'Pagar',
  buttonStyle,
  disabled = false,
  backUrl,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    onProcessing?.();

    try {
      // Construir backUrl correctamente
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const paymentBackUrl = backUrl || `${currentOrigin}/payment/callback`;

      const paymentMetadata = {
        ...metadata,
        orderId: metadata?.orderId || `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };

      console.log('Initiating payment request:', {
        provider,
        itemsCount: items.length,
        totalAmount: items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
      });

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          items,
          metadata: paymentMetadata,
          backUrl: paymentBackUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error ${response.status}: ${response.statusText}`);
      }

      if (result.payment?.initPoint) {
        console.log('🎯 Redirecting to MercadoPago:', result.payment.initPoint);
        onSuccess?.(result.payment);

        // Redirigir después de un pequeño delay para mejor UX
        setTimeout(() => {
          window.location.href = result.payment.initPoint;
        }, 500);

      } else {
        throw new Error('No payment URL received from server');
      }
    } catch (error) {
      console.error('❌ Payment error:', error);
      onError?.(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      style={{
        backgroundColor: '#009ee3',
        color: 'white',
        border: 'none',
        padding: '16px 32px',
        fontSize: '18px',
        fontWeight: '600',
        borderRadius: '8px',
        cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
        width: '100%',
        maxWidth: '300px',
        transition: 'all 0.3s ease',
        opacity: (disabled || isLoading) ? 0.6 : 1,
        ...buttonStyle,
      }}
    >
      {isLoading ? (
        <span>
          <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>⏳</span>
          Procesando...
        </span>
      ) : (
        buttonText
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};