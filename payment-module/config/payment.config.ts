// import { PaymentConfig } from '../types/payment';

// export const getPaymentConfig = (): Record<string, PaymentConfig> => {
//   const mercadopagoAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
//   const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
//   const modoAccessToken = process.env.MODO_ACCESS_TOKEN || '';

//   return {
//     mercadopago: {
//       provider: 'mercadopago',
//       accessToken: mercadopagoAccessToken,
//       publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || '',
//       sandboxMode: !mercadopagoAccessToken.startsWith('APP_USR'),
//     },
//     stripe: {
//       provider: 'stripe',
//       accessToken: stripeSecretKey,
//       publicKey: process.env.STRIPE_PUBLIC_KEY || '',
//       webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
//       sandboxMode: !stripeSecretKey.startsWith('sk_live'),
//     },
//     modo: {
//       provider: 'modo',
//       accessToken: modoAccessToken,
//       sandboxMode: !modoAccessToken.startsWith('live_'),
//       apiUrl: process.env.MODO_API_URL || 'https://api.mercadopago.com',
//     },
//     ripio: {
//       provider: 'ripio',
//       accessToken: process.env.RIPIO_ACCESS_TOKEN || '',
//       sandboxMode: process.env.NODE_ENV !== 'production',
//     },
//   };
// };
// export const DEFAULT_PROVIDER = process.env.DEFAULT_PAYMENT_PROVIDER || 'mercadopago';


import { PaymentConfig } from '../types/payment';

export const getPaymentConfig = (): Record<string, PaymentConfig> => {
  const mercadopagoAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
  const modoAccessToken = process.env.MODO_ACCESS_TOKEN || '';

  return {
    mercadopago: {
      provider: 'mercadopago',
      accessToken: mercadopagoAccessToken,
      publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || '',
      sandboxMode: !mercadopagoAccessToken.startsWith('APP_USR'),
    },
    stripe: {
      provider: 'stripe',
      accessToken: stripeSecretKey,
      publicKey: process.env.STRIPE_PUBLIC_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      sandboxMode: !stripeSecretKey.startsWith('sk_live'),
    },
    modo: {
      provider: 'modo',
      accessToken: modoAccessToken,
      sandboxMode: !modoAccessToken.startsWith('live_'),
      apiUrl: process.env.MODO_API_URL || 'https://api.mercadopago.com',
    },
    ripio: {
      provider: 'ripio',
      accessToken: process.env.RIPIO_ACCESS_TOKEN || '',
      sandboxMode: process.env.NODE_ENV !== 'production',
    },
  };
};

export const DEFAULT_PROVIDER = process.env.DEFAULT_PAYMENT_PROVIDER || 'mercadopago';