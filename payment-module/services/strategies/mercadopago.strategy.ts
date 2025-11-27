// // payment-module/strategies/mercadopago.strategy.ts
// import { 
//   PaymentStrategy, 
//   CreatePaymentRequest, 
//   PaymentResponse, 
//   WebhookEvent,
//   PaymentConfig,
//   PaymentStatus 
// } from '@/payment-module/types/payment';

// export class MercadoPagoStrategy implements PaymentStrategy {
//   private config: PaymentConfig;

//   constructor(config: PaymentConfig) {
//     this.config = config;
//   }

//   async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
//     const baseCallbackUrl = request.backUrl || `${baseUrl}/payment/callback`;
    
//     // Validar que tenemos access token
//     if (!this.config.accessToken) {
//       throw new Error('MercadoPago access token not configured');
//     }

//     // Calcular monto total
//     const totalAmount = request.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    
//     const preference: any = {
//       items: request.items.map(item => ({
//         id: item.id,
//         title: item.title.substring(0, 256), // MercadoPago limita a 256 chars
//         description: item.description ? item.description.substring(0, 256) : '',
//         quantity: Number(item.quantity),
//         currency_id: item.currency || 'ARS',
//         unit_price: Number(item.unit_price),
//         category_id: 'others',
//       })),
//       back_urls: {
//         success: `${baseCallbackUrl}?status=success`,
//         failure: `${baseCallbackUrl}?status=failure`, 
//         pending: `${baseCallbackUrl}?status=pending`,
//       },
//       external_reference: request.metadata?.orderId || `order-${Date.now()}`,
//       notification_url: `${baseUrl}/api/payment/webhook/mercadopago`,
//       auto_return: 'approved',
//       statement_descriptor: 'MIEMPRESA',
//     };

//     // Solo incluir metadata si existe
//     if (request.metadata && Object.keys(request.metadata).length > 0) {
//       preference.metadata = request.metadata;
//     }

//     console.log('Creating MercadoPago preference:', {
//       items: preference.items,
//       totalAmount,
//       callbackUrls: preference.back_urls
//     });

//     try {
//       const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.config.accessToken}`,
//         },
//         body: JSON.stringify(preference),
//       });

//       const responseText = await response.text();
//       let data;
      
//       try {
//         data = JSON.parse(responseText);
//       } catch (parseError) {
//         console.error('Failed to parse MercadoPago response:', responseText);
//         throw new Error('Invalid response from MercadoPago API');
//       }

//       if (!response.ok) {
//         console.error('MercadoPago API Error:', data);
        
//         // Manejar errores específicos
//         if (data.error === 'invalid_auto_return') {
//           delete preference.auto_return;
//           return this.retryCreatePayment(preference, totalAmount);
//         }
        
//         throw new Error(`MercadoPago API Error: ${data.message || JSON.stringify(data)}`);
//       }

//       // Validar que tenemos los datos necesarios
//       if (!data.id) {
//         throw new Error('Invalid response from MercadoPago: missing payment ID');
//       }

//       const initPoint = this.config.sandboxMode ? data.sandbox_init_point : data.init_point;
      
//       if (!initPoint) {
//         throw new Error('No payment URL received from MercadoPago');
//       }

//       console.log('MercadoPago payment created successfully:', {
//         id: data.id,
//         initPoint: initPoint.substring(0, 100) + '...',
//         externalReference: data.external_reference
//       });

//       return {
//         id: data.id,
//         status: 'pending',
//         initPoint: initPoint,
//         externalReference: data.external_reference,
//         provider: 'mercadopago',
//         amount: totalAmount,
//         currency: request.items[0]?.currency || 'ARS',
//         createdAt: new Date(data.date_created),
//       };
//     } catch (error) {
//       console.error('Error creating MercadoPago payment:', error);
//       throw error;
//     }
//   }

//   private async retryCreatePayment(preference: any, totalAmount: number): Promise<PaymentResponse> {
//     console.log('Retrying MercadoPago payment without auto_return...');
    
//     const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${this.config.accessToken}`,
//       },
//       body: JSON.stringify(preference),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(`MercadoPago API Error (retry): ${JSON.stringify(error)}`);
//     }

//     const data = await response.json();

//     const initPoint = this.config.sandboxMode ? data.sandbox_init_point : data.init_point;

//     return {
//       id: data.id,
//       status: 'pending',
//       initPoint: initPoint,
//       externalReference: data.external_reference,
//       provider: 'mercadopago',
//       amount: totalAmount,
//       currency: 'ARS',
//       createdAt: new Date(data.date_created),
//     };
//   }

//   async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
//     if (!this.config.accessToken) {
//       throw new Error('MercadoPago access token not configured');
//     }

//     try {
//       const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
//         headers: {
//           'Authorization': `Bearer ${this.config.accessToken}`,
//         },
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(`MercadoPago API Error: ${JSON.stringify(error)}`);
//       }

//       const data = await response.json();

//       return {
//         id: data.id.toString(),
//         status: this.mapStatus(data.status),
//         externalReference: data.external_reference,
//         provider: 'mercadopago',
//         amount: data.transaction_amount || 0,
//         currency: data.currency_id || 'ARS',
//         createdAt: new Date(data.date_created),
//         paymentMethod: data.payment_method_id,
//         paymentType: data.payment_type_id,
//       };
//     } catch (error) {
//       console.error('Error getting payment status:', error);
//       throw error;
//     }
//   }

//   async processWebhook(payload: any, signature?: string): Promise<WebhookEvent> {
//     console.log('Processing MercadoPago webhook:', payload);
    
//     const paymentId = payload.data?.id || payload.id;
    
//     if (!paymentId) {
//       throw new Error('No payment ID in webhook payload');
//     }

//     return {
//       id: paymentId.toString(),
//       type: payload.type || payload.action || 'payment.updated',
//       data: payload,
//       provider: 'mercadopago',
//       timestamp: new Date(),
//     };
//   }

//   async refundPayment(paymentId: string, amount?: number): Promise<PaymentResponse> {
//     if (!this.config.accessToken) {
//       throw new Error('MercadoPago access token not configured');
//     }

//     const body: any = {};
//     if (amount) {
//       body.amount = amount;
//     }

//     try {
//       const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.config.accessToken}`,
//         },
//         body: JSON.stringify(body),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(`MercadoPago Refund Error: ${JSON.stringify(error)}`);
//       }

//       const data = await response.json();

//       return {
//         id: data.id?.toString() || paymentId,
//         status: 'refunded',
//         provider: 'mercadopago',
//         amount: data.amount || amount || 0,
//         currency: data.currency_id || 'ARS',
//         createdAt: new Date(data.date_created || new Date()),
//       };
//     } catch (error) {
//       console.error('Error refunding payment:', error);
//       throw error;
//     }
//   }

//   private mapStatus(mpStatus: string): PaymentStatus {
//     const statusMap: Record<string, PaymentStatus> = {
//       'pending': 'pending',
//       'approved': 'approved',
//       'authorized': 'approved',
//       'in_process': 'in_process',
//       'in_mediation': 'in_process',
//       'rejected': 'rejected',
//       'cancelled': 'cancelled',
//       'refunded': 'refunded',
//       'charged_back': 'charged_back',
//       'null': 'pending', // Manejar valores null
//     };

//     return statusMap[mpStatus] || 'pending';
//   }
// }



import { 
  PaymentStrategy, 
  CreatePaymentRequest, 
  PaymentResponse, 
  WebhookEvent,
  PaymentConfig,
  PaymentStatus,
  PayerInfo,
  PaymentMethodInfo,
  TransactionDetail,
  FeeDetail,
  PaymentMethodType
} from '@/payment-module/types/payment';

export class MercadoPagoStrategy implements PaymentStrategy {
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const baseCallbackUrl = request.backUrl || `${baseUrl}/payment/callback`;
    
    if (!this.config.accessToken) {
      throw new Error('MercadoPago access token not configured');
    }

    const totalAmount = request.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    
    const preference: any = {
      items: request.items.map(item => ({
        id: item.id,
        title: item.title.substring(0, 256),
        description: item.description ? item.description.substring(0, 256) : '',
        quantity: Number(item.quantity),
        currency_id: item.currency || 'ARS',
        unit_price: Number(item.unit_price),
        category_id: 'others',
      })),
      back_urls: {
        success: `${baseCallbackUrl}?status=success`,
        failure: `${baseCallbackUrl}?status=failure`, 
        pending: `${baseCallbackUrl}?status=pending`,
      },
      external_reference: request.metadata?.orderId || `order-${Date.now()}`,
      notification_url: `${baseUrl}/api/payment/webhook/mercadopago`,
      statement_descriptor: 'MIEMPRESA',
    };

    // Incluir información del pagador si está disponible
    if (request.payer) {
      preference.payer = {
        email: request.payer.email,
        name: request.payer.firstName,
        surname: request.payer.lastName,
        phone: request.payer.phone ? { number: request.payer.phone } : undefined,
        identification: request.payer.identification,
        address: request.payer.address,
      };
    }

    // Solo incluir metadata si existe
    if (request.metadata && Object.keys(request.metadata).length > 0) {
      preference.metadata = request.metadata;
    }

    console.log('Creating MercadoPago preference:', {
      items: preference.items,
      totalAmount,
      hasPayer: !!request.payer
    });

    try {
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
        body: JSON.stringify(preference),
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse MercadoPago response:', responseText);
        throw new Error('Invalid response from MercadoPago API');
      }

      if (!response.ok) {
        console.error('MercadoPago API Error:', data);
        
        if (data.error === 'invalid_auto_return') {
          delete preference.auto_return;
          return this.retryCreatePayment(preference, totalAmount);
        }
        
        throw new Error(`MercadoPago API Error: ${data.message || JSON.stringify(data)}`);
      }

      if (!data.id) {
        throw new Error('Invalid response from MercadoPago: missing payment ID');
      }

      const initPoint = this.config.sandboxMode ? data.sandbox_init_point : data.init_point;
      
      if (!initPoint) {
        throw new Error('No payment URL received from MercadoPago');
      }

      console.log('MercadoPago payment created successfully:', {
        id: data.id,
        externalReference: data.external_reference
      });

      return {
        id: data.id,
        status: 'pending',
        initPoint: initPoint,
        externalReference: data.external_reference,
        provider: 'mercadopago',
        amount: totalAmount,
        currency: request.items[0]?.currency || 'ARS',
        createdAt: new Date(data.date_created),
      };
    } catch (error) {
      console.error('Error creating MercadoPago payment:', error);
      throw error;
    }
  }

  private async retryCreatePayment(preference: any, totalAmount: number): Promise<PaymentResponse> {
    console.log('Retrying MercadoPago payment without auto_return...');
    
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MercadoPago API Error (retry): ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const initPoint = this.config.sandboxMode ? data.sandbox_init_point : data.init_point;

    return {
      id: data.id,
      status: 'pending',
      initPoint: initPoint,
      externalReference: data.external_reference,
      provider: 'mercadopago',
      amount: totalAmount,
      currency: 'ARS',
      createdAt: new Date(data.date_created),
    };
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    return this.getPaymentDetails(paymentId);
  }

  async getPaymentDetails(paymentId: string): Promise<PaymentResponse> {
    if (!this.config.accessToken) {
      throw new Error('MercadoPago access token not configured');
    }

    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`MercadoPago API Error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      
      // Mapear información extendida del pago
      const paymentResponse = this.mapPaymentDetails(data);
      
      console.log('Payment details retrieved:', {
        id: paymentResponse.id,
        status: paymentResponse.status,
        amount: paymentResponse.amount,
        payerEmail: paymentResponse.payer?.email,
        paymentMethod: paymentResponse.paymentMethodInfo?.name
      });

      return paymentResponse;
    } catch (error) {
      console.error('Error getting payment details:', error);
      throw error;
    }
  }

  private mapPaymentDetails(mpData: any): PaymentResponse {
    // Mapear información del pagador
    const payer: PayerInfo = {
      id: mpData.payer?.id?.toString(),
      email: mpData.payer?.email,
      firstName: mpData.payer?.first_name,
      lastName: mpData.payer?.last_name,
      phone: mpData.payer?.phone?.number,
      identification: mpData.payer?.identification ? {
        type: mpData.payer.identification.type,
        number: mpData.payer.identification.number,
      } : undefined,
      address: mpData.payer?.address ? {
        streetName: mpData.payer.address.street_name,
        streetNumber: mpData.payer.address.street_number,
        zipCode: mpData.payer.address.zip_code,
        city: mpData.payer.address.city_name,
        state: mpData.payer.address.state_name,
        country: mpData.payer.address.country_name,
      } : undefined,
    };

    // Mapear información del método de pago
    const paymentMethodInfo: PaymentMethodInfo = {
      id: mpData.payment_method_id,
      type: this.mapPaymentMethodType(mpData.payment_type_id),
      name: mpData.payment_method?.name || mpData.payment_method_id,
      issuer: mpData.payment_method?.issuer?.name,
      installments: mpData.installments,
      installmentRate: mpData.installment_rate,
    };

    // Mapear detalles de la transacción
    const transactionDetails: TransactionDetail = {
      netAmount: mpData.transaction_details?.net_received_amount,
      totalPaidAmount: mpData.transaction_details?.total_paid_amount,
      installmentAmount: mpData.transaction_details?.installment_amount,
      financingFeeAmount: mpData.financing_fee_amount,
      shippingCost: mpData.shipping_cost,
      taxesAmount: mpData.taxes_amount,
      overpaidAmount: mpData.transaction_details?.overpaid_amount,
      externalResourceUrl: mpData.external_resource_url,
    };

    // Mapear detalles de comisiones
    const feeDetails: FeeDetail[] = mpData.fee_details?.map((fee: any) => ({
      type: fee.type,
      amount: fee.amount,
      fee_payer: fee.fee_payer,
    })) || [];

    return {
      id: mpData.id.toString(),
      status: this.mapStatus(mpData.status),
      externalReference: mpData.external_reference,
      provider: 'mercadopago',
      amount: mpData.transaction_amount || 0,
      currency: mpData.currency_id || 'ARS',
      createdAt: new Date(mpData.date_created),
      paymentMethod: mpData.payment_method_id,
      paymentType: mpData.payment_type_id,
      
      // Nueva información extendida
      payer,
      paymentMethodInfo,
      transactionDetails,
      feeDetails,
      description: mpData.description,
      captured: mpData.captured,
      liveMode: mpData.live_mode,
      statementDescriptor: mpData.statement_descriptor,
      authorizationCode: mpData.authorization_code,
      moneyReleaseStatus: mpData.money_release_status,
      moneyReleaseDate: mpData.money_release_date ? new Date(mpData.money_release_date) : undefined,
    };
  }

  // private mapPaymentMethodType(paymentType: string): string {
  //   const typeMap: Record<string, string> = {
  //     'credit_card': 'credit_card',
  //     'debit_card': 'debit_card',
  //     'bank_transfer': 'bank_transfer',
  //     'ticket': 'ticket',
  //     'atm': 'atm',
  //     'digital_wallet': 'digital_wallet',
  //     'prepaid_card': 'prepaid_card',
  //   };
    
  //   return typeMap[paymentType] || 'other';
  // }

private mapPaymentMethodType(paymentType: string | null | undefined): PaymentMethodType {
    if (!paymentType) return 'other';

    const typeMap: Record<string, PaymentMethodType> = {
      'credit_card': 'credit_card',
      'debit_card': 'debit_card',
      'bank_transfer': 'bank_transfer',
      'ticket': 'ticket',
      'atm': 'atm',
      'digital_wallet': 'digital_wallet',
      'prepaid_card': 'prepaid_card',
    };
    
    // El "as PaymentMethodType" final fuerza a TS a confiar en que devolvemos el tipo correcto
    return (typeMap[paymentType] || 'other') as PaymentMethodType;
  }



  async processWebhook(payload: any, signature?: string): Promise<WebhookEvent> {
    console.log('Processing MercadoPago webhook:', payload);
    
    const paymentId = payload.data?.id || payload.id;
    
    if (!paymentId) {
      throw new Error('No payment ID in webhook payload');
    }

    return {
      id: paymentId.toString(),
      type: payload.type || payload.action || 'payment.updated',
      data: payload,
      provider: 'mercadopago',
      timestamp: new Date(),
    };
  }

  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResponse> {
    if (!this.config.accessToken) {
      throw new Error('MercadoPago access token not configured');
    }

    const body: any = {};
    if (amount) {
      body.amount = amount;
    }

    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`MercadoPago Refund Error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();

      return {
        id: data.id?.toString() || paymentId,
        status: 'refunded',
        provider: 'mercadopago',
        amount: data.amount || amount || 0,
        currency: data.currency_id || 'ARS',
        createdAt: new Date(data.date_created || new Date()),
      };
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }

  private mapStatus(mpStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'pending': 'pending',
      'approved': 'approved',
      'authorized': 'authorized',
      'in_process': 'in_process',
      'in_mediation': 'in_process',
      'rejected': 'rejected',
      'cancelled': 'cancelled',
      'refunded': 'refunded',
      'charged_back': 'charged_back',
      'null': 'pending',
    };

    return statusMap[mpStatus] || 'pending';
  }
}