// payment-module/services/strategies/modo.strategy.ts

import { 
    PaymentStrategy, 
    CreatePaymentRequest, 
    PaymentResponse, 
    WebhookEvent,
    PaymentConfig
  } from '../../types/payment';
  
  export class ModoStrategy implements PaymentStrategy {
    private config: PaymentConfig;
  
    constructor(config: PaymentConfig) {
      this.config = config;
    }
  
    async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
      throw new Error('Modo strategy not implemented yet');
    }
  
    async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
      throw new Error('Modo strategy not implemented yet');
    }
  
    async processWebhook(payload: any): Promise<WebhookEvent> {
      throw new Error('Modo strategy not implemented yet');
    }
  }
  
  // payment-module/services/strategies/ripio.strategy.ts
  
  export class RipioStrategy implements PaymentStrategy {
    private config: PaymentConfig;
  
    constructor(config: PaymentConfig) {
      this.config = config;
    }
  
    async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
      throw new Error('Ripio strategy not implemented yet');
    }
  
    async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
      throw new Error('Ripio strategy not implemented yet');
    }
  
    async processWebhook(payload: any): Promise<WebhookEvent> {
      throw new Error('Ripio strategy not implemented yet');
    }
  }