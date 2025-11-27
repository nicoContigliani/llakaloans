// payment-module/services/strategies/stripe.strategy.ts

import { 
    PaymentStrategy, 
    CreatePaymentRequest, 
    PaymentResponse, 
    WebhookEvent,
    PaymentConfig
  } from '../../types/payment';
  
  export class StripeStrategy implements PaymentStrategy {
    private config: PaymentConfig;
  
    constructor(config: PaymentConfig) {
      this.config = config;
    }
  
    async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
      throw new Error('Stripe strategy not implemented yet');
    }
  
    async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
      throw new Error('Stripe strategy not implemented yet');
    }
  
    async processWebhook(payload: any, signature?: string): Promise<WebhookEvent> {
      throw new Error('Stripe strategy not implemented yet');
    }
  }