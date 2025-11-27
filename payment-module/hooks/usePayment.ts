// import { useState } from 'react';
// import { 
//   PaymentProvider, 
//   CreatePaymentRequest, 
//   PaymentResponse 
// } from '../types/payment';

// interface UsePaymentReturn {
//   payment: PaymentResponse | null;
//   loading: boolean;
//   error: string | null;
//   createPayment: (provider: PaymentProvider, request: CreatePaymentRequest) => Promise<void>;
//   checkStatus: (provider: PaymentProvider, paymentId: string) => Promise<void>;
//   refund: (provider: PaymentProvider, paymentId: string, amount?: number) => Promise<void>;
//   reset: () => void;
// }

// export const usePayment = (): UsePaymentReturn => {
//   const [payment, setPayment] = useState<PaymentResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const createPayment = async (
//     provider: PaymentProvider, 
//     request: CreatePaymentRequest
//   ) => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Asegurar que siempre haya un backUrl definido
//       const baseUrl = getBaseUrl();
//       const paymentRequest: CreatePaymentRequest = {
//         ...request,
//         backUrl: request.backUrl || `${baseUrl}/payment/callback`,
//         // NO incluir autoReturn - causa problemas con MercadoPago
//       };

//       console.log('Creating payment with request:', { provider, ...paymentRequest });

//       const response = await fetch('/api/payment/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           provider, 
//           ...paymentRequest 
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create payment');
//       }

//       const data = await response.json();
//       setPayment(data.payment);

//       // Redirigir automáticamente si hay initPoint
//       if (data.payment.initPoint) {
//         console.log('Redirecting to payment page:', data.payment.initPoint);
//         window.location.href = data.payment.initPoint;
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(errorMessage);
//       console.error('Payment creation error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ... resto de los métodos permanecen igual
//   const checkStatus = async (provider: PaymentProvider, paymentId: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         `/api/payment/status?provider=${encodeURIComponent(provider)}&paymentId=${encodeURIComponent(paymentId)}`
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to check payment status');
//       }

//       const data = await response.json();
//       setPayment(data.payment);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(errorMessage);
//       console.error('Payment status check error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refund = async (
//     provider: PaymentProvider, 
//     paymentId: string, 
//     amount?: number
//   ) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('/api/payment/refund', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ provider, paymentId, amount }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to refund payment');
//       }

//       const data = await response.json();
//       setPayment(data.payment);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(errorMessage);
//       console.error('Payment refund error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = () => {
//     setPayment(null);
//     setError(null);
//     setLoading(false);
//   };

//   return {
//     payment,
//     loading,
//     error,
//     createPayment,
//     checkStatus,
//     refund,
//     reset,
//   };
// };

// // Función auxiliar para obtener la URL base
// const getBaseUrl = (): string => {
//   if (typeof window !== 'undefined') {
//     return window.location.origin;
//   }
//   return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
// };


import { useState } from 'react';
import { 
  PaymentProvider, 
  CreatePaymentRequest, 
  PaymentResponse 
} from '../types/payment';

interface UsePaymentReturn {
  payment: PaymentResponse | null;
  loading: boolean;
  error: string | null;
  createPayment: (provider: PaymentProvider, request: CreatePaymentRequest) => Promise<void>;
  checkStatus: (provider: PaymentProvider, paymentId: string) => Promise<void>;
  getDetails: (provider: PaymentProvider, paymentId: string) => Promise<void>;
  refund: (provider: PaymentProvider, paymentId: string, amount?: number) => Promise<void>;
  reset: () => void;
}

export const usePayment = (): UsePaymentReturn => {
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (
    provider: PaymentProvider, 
    request: CreatePaymentRequest
  ) => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = getBaseUrl();
      const paymentRequest: CreatePaymentRequest = {
        ...request,
        backUrl: request.backUrl || `${baseUrl}/payment/callback`,
      };

      console.log('Creating payment with request:', { provider, ...paymentRequest });

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          provider, 
          ...paymentRequest 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const data = await response.json();
      setPayment(data.payment);

      if (data.payment.initPoint) {
        console.log('Redirecting to payment page:', data.payment.initPoint);
        window.location.href = data.payment.initPoint;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Payment creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (provider: PaymentProvider, paymentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/payment/status?provider=${encodeURIComponent(provider)}&paymentId=${encodeURIComponent(paymentId)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check payment status');
      }

      const data = await response.json();
      setPayment(data.payment);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Payment status check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDetails = async (provider: PaymentProvider, paymentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/payment/details?provider=${encodeURIComponent(provider)}&paymentId=${encodeURIComponent(paymentId)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get payment details');
      }

      const data = await response.json();
      setPayment(data.payment);
      
      console.log('Payment details retrieved:', {
        id: data.payment.id,
        payer: data.payment.payer,
        paymentMethod: data.payment.paymentMethodInfo
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Payment details error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refund = async (
    provider: PaymentProvider, 
    paymentId: string, 
    amount?: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, paymentId, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to refund payment');
      }

      const data = await response.json();
      setPayment(data.payment);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Payment refund error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPayment(null);
    setError(null);
    setLoading(false);
  };

  return {
    payment,
    loading,
    error,
    createPayment,
    checkStatus,
    getDetails,
    refund,
    reset,
  };
};

const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};