// import { 
//   PaymentService, 
//   PaymentProvider, 
//   CreatePaymentRequest, 
//   PaymentResponse, 
//   WebhookEvent 
// } from '../types/payment';
// import { getPaymentConfig } from '../config/payment.config';
// import { MercadoPagoStrategy } from '@/payment-module/services/strategies/mercadopago.strategy';
// // Importar otras estrategias cuando estén implementadas
// // import { StripeStrategy } from '../strategies/stripe.strategy';

// export class PaymentServiceImpl implements PaymentService {
//   private strategies: Map<PaymentProvider, any> = new Map();

//   constructor() {
//     const config = getPaymentConfig();
    
//     console.log('Initializing payment strategies...');
    
//     // Inicializar estrategias disponibles
//     if (config.mercadopago.accessToken) {
//       console.log('✅ MercadoPago strategy initialized');
//       this.strategies.set('mercadopago', new MercadoPagoStrategy(config.mercadopago));
//     } else {
//       console.warn('❌ MercadoPago access token not configured');
//     }
    
//     if (config.stripe.accessToken && config.stripe.accessToken !== 'your_stripe_secret_key_here') {
//       console.log('✅ Stripe strategy initialized');
//       // this.strategies.set('stripe', new StripeStrategy(config.stripe));
//     }
    
//     // Agregar otras estrategias cuando estén implementadas
//     console.log(`Payment service initialized with ${this.strategies.size} strategies`);
//   }

//   async createPayment(provider: PaymentProvider, request: CreatePaymentRequest): Promise<PaymentResponse> {
//     const strategy = this.strategies.get(provider);
//     if (!strategy) {
//       throw new Error(`Payment provider ${provider} not supported or not configured`);
//     }
    
//     console.log(`Creating payment with ${provider} for ${request.items.length} items`);
//     return strategy.createPayment(request);
//   }

//   async getPaymentStatus(provider: PaymentProvider, paymentId: string): Promise<PaymentResponse> {
//     const strategy = this.strategies.get(provider);
//     if (!strategy) {
//       throw new Error(`Payment provider ${provider} not supported or not configured`);
//     }
    
//     console.log(`Getting payment status for ${paymentId} with ${provider}`);
//     return strategy.getPaymentStatus(paymentId);
//   }

//   async processWebhook(provider: PaymentProvider, payload: any, signature?: string): Promise<WebhookEvent> {
//     const strategy = this.strategies.get(provider);
//     if (!strategy) {
//       throw new Error(`Payment provider ${provider} not supported or not configured`);
//     }
    
//     console.log(`Processing webhook for ${provider}`);
//     return strategy.processWebhook(payload, signature);
//   }

//   async refundPayment(provider: PaymentProvider, paymentId: string, amount?: number): Promise<PaymentResponse> {
//     const strategy = this.strategies.get(provider);
//     if (!strategy) {
//       throw new Error(`Payment provider ${provider} not supported or not configured`);
//     }

//     if (!strategy.refundPayment) {
//       throw new Error(`Refund not supported for provider ${provider}`);
//     }
    
//     console.log(`Processing refund for ${paymentId} with ${provider}`);
//     return strategy.refundPayment(paymentId, amount);
//   }

//   getAvailableProviders(): PaymentProvider[] {
//     return Array.from(this.strategies.keys());
//   }
// }

// // Singleton instance
// let paymentServiceInstance: PaymentServiceImpl;

// export const getPaymentService = (): PaymentServiceImpl => {
//   if (!paymentServiceInstance) {
//     paymentServiceInstance = new PaymentServiceImpl();
//   }
//   return paymentServiceInstance;
// };



import { 
  PaymentService, 
  PaymentProvider, 
  CreatePaymentRequest, 
  PaymentResponse, 
  WebhookEvent 
} from '../types/payment';
import { getPaymentConfig } from '../config/payment.config';
import { MercadoPagoStrategy } from '@/payment-module/services/strategies/mercadopago.strategy';

export class PaymentServiceImpl implements PaymentService {
  private strategies: Map<PaymentProvider, any> = new Map();

  constructor() {
    const config = getPaymentConfig();
    
    console.log('Initializing payment strategies...');
    
    if (config.mercadopago.accessToken) {
      console.log('✅ MercadoPago strategy initialized');
      this.strategies.set('mercadopago', new MercadoPagoStrategy(config.mercadopago));
    } else {
      console.warn('❌ MercadoPago access token not configured');
    }
    
    if (config.stripe.accessToken && config.stripe.accessToken !== 'your_stripe_secret_key_here') {
      console.log('✅ Stripe strategy initialized');
      // this.strategies.set('stripe', new StripeStrategy(config.stripe));
    }
    
    console.log(`Payment service initialized with ${this.strategies.size} strategies`);
  }

  async createPayment(provider: PaymentProvider, request: CreatePaymentRequest): Promise<PaymentResponse> {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      throw new Error(`Payment provider ${provider} not supported or not configured`);
    }
    
    console.log(`Creating payment with ${provider} for ${request.items.length} items`);
    return strategy.createPayment(request);
  }

  async getPaymentStatus(provider: PaymentProvider, paymentId: string): Promise<PaymentResponse> {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      throw new Error(`Payment provider ${provider} not supported or not configured`);
    }
    
    console.log(`Getting payment status for ${paymentId} with ${provider}`);
    return strategy.getPaymentStatus(paymentId);
  }

  async getPaymentDetails(provider: PaymentProvider, paymentId: string): Promise<PaymentResponse> {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      throw new Error(`Payment provider ${provider} not supported or not configured`);
    }

    // Usar getPaymentDetails si está disponible, sino getPaymentStatus
    if (strategy.getPaymentDetails) {
      console.log(`Getting detailed payment info for ${paymentId} with ${provider}`);
      return strategy.getPaymentDetails(paymentId);
    } else {
      console.log(`Getting basic payment status for ${paymentId} with ${provider}`);
      return strategy.getPaymentStatus(paymentId);
    }
  }

  async processWebhook(provider: PaymentProvider, payload: any, signature?: string): Promise<WebhookEvent> {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      throw new Error(`Payment provider ${provider} not supported or not configured`);
    }
    
    console.log(`Processing webhook for ${provider}`);
    return strategy.processWebhook(payload, signature);
  }

  async refundPayment(provider: PaymentProvider, paymentId: string, amount?: number): Promise<PaymentResponse> {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      throw new Error(`Payment provider ${provider} not supported or not configured`);
    }

    if (!strategy.refundPayment) {
      throw new Error(`Refund not supported for provider ${provider}`);
    }
    
    console.log(`Processing refund for ${paymentId} with ${provider}`);
    return strategy.refundPayment(paymentId, amount);
  }

  getAvailableProviders(): PaymentProvider[] {
    return Array.from(this.strategies.keys());
  }
}

// Singleton instance
let paymentServiceInstance: PaymentServiceImpl;

export const getPaymentService = (): PaymentServiceImpl => {
  if (!paymentServiceInstance) {
    paymentServiceInstance = new PaymentServiceImpl();
  }
  return paymentServiceInstance;
};