// export type PaymentProvider = 'mercadopago' | 'stripe' | 'modo' | 'ripio';

// export type PaymentStatus = 
//   | 'pending' 
//   | 'approved' 
//   | 'rejected' 
//   | 'cancelled' 
//   | 'in_process'
//   | 'refunded'
//   | 'charged_back'
//   | 'expired'
//   | 'authorized';

// export type PaymentMethodType = 
//   | 'credit_card'
//   | 'debit_card'
//   | 'bank_transfer'
//   | 'ticket'
//   | 'atm'
//   | 'digital_wallet'
//   | 'prepaid_card'
//   | 'other';

// export interface PaymentItem {
//   id: string;
//   title: string;
//   description?: string;
//   quantity: number;
//   unit_price: number;
//   currency?: string;
//   category_id?: string;
// }

// export interface PaymentMetadata {
//   userId?: string;
//   orderId?: string;
//   [key: string]: any;
// }

// export interface PayerInfo {
//   id?: string;
//   email?: string;
//   firstName?: string;
//   lastName?: string;
//   phone?: string;
//   identification?: {
//     type: string;
//     number: string;
//   };
//   address?: {
//     streetName?: string;
//     streetNumber?: string;
//     zipCode?: string;
//     city?: string;
//     state?: string;
//     country?: string;
//   };
// }

// export interface PaymentMethodInfo {
//   id: string;
//   type?: PaymentMethodType;
//   name: string;
//   issuer?: string;
//   installments?: number;
//   installmentRate?: number;
// }

// export interface FeeDetail {
//   type: string;
//   amount: number;
//   fee_payer: string;
// }

// export interface TransactionDetail {
//   netAmount?: number;
//   totalPaidAmount?: number;
//   installmentAmount?: number;
//   financingFeeAmount?: number;
//   shippingCost?: number;
//   taxesAmount?: number;
//   overpaidAmount?: number;
//   externalResourceUrl?: string;
// }

// export interface CreatePaymentRequest {
//   items: PaymentItem[];
//   metadata?: PaymentMetadata;
//   backUrl?: string;
//   autoReturn?: 'approved' | 'all';
//   notificationUrl?: string;
//   expiresIn?: number;
//   payer?: PayerInfo;
// }

// export interface PaymentResponse {
//   id: string;
//   status: PaymentStatus;
//   initPoint?: string;
//   qrCode?: string;
//   externalReference?: string;
//   provider: PaymentProvider;
//   amount: number;
//   currency: string;
//   createdAt: Date;
//   paymentMethod?: string;
//   paymentType?: string;
//   expiresAt?: Date;
  
//   // Nueva información extendida
//   payer?: PayerInfo;
//   paymentMethodInfo?: PaymentMethodInfo;
//   transactionDetails?: TransactionDetail;
//   feeDetails?: FeeDetail[];
//   description?: string;
//   captured?: boolean;
//   liveMode?: boolean;
//   statementDescriptor?: string;
//   authorizationCode?: string;
//   moneyReleaseStatus?: string;
//   moneyReleaseDate?: Date;
// }

// export interface PaymentConfig {
//   provider: PaymentProvider;
//   accessToken?: string;
//   publicKey?: string;
//   webhookSecret?: string;
//   sandboxMode?: boolean;
//   apiUrl?: string;
// }

// export interface WebhookEvent {
//   id: string;
//   type: string;
//   data: any;
//   provider: PaymentProvider;
//   timestamp: Date;
// }

// export interface PaymentStrategy {
//   createPayment(request: CreatePaymentRequest): Promise<PaymentResponse>;
//   getPaymentStatus(paymentId: string): Promise<PaymentResponse>;
//   processWebhook(payload: any, signature?: string): Promise<WebhookEvent>;
//   refundPayment?(paymentId: string, amount?: number): Promise<PaymentResponse>;
//   getPaymentDetails?(paymentId: string): Promise<PaymentResponse>;
// }

// export interface PaymentService {
//   createPayment(provider: PaymentProvider, request: CreatePaymentRequest): Promise<PaymentResponse>;
//   getPaymentStatus(provider: PaymentProvider, paymentId: string): Promise<PaymentResponse>;
//   processWebhook(provider: PaymentProvider, payload: any, signature?: string): Promise<WebhookEvent>;
//   refundPayment(provider: PaymentProvider, paymentId: string, amount?: number): Promise<PaymentResponse>;
//   getPaymentDetails?(provider: PaymentProvider, paymentId: string): Promise<PaymentResponse>;
// }



// export interface PaymentFilters {
//   status?: PaymentStatus[];
//   dateFrom?: string;
//   dateTo?: string;
//   minAmount?: number;
//   maxAmount?: number;
//   paymentMethod?: string[];
//   currency?: string;
// }

// export interface PaymentSort {
//   field: 'createdAt' | 'amount' | 'status' | 'payerEmail';
//   direction: 'asc' | 'desc';
// }

// export interface PaymentsQuery {
//   page: number;
//   limit: number;
//   filters?: PaymentFilters;
//   sort?: PaymentSort;
//   search?: string;
// }

// export interface PaymentsResponse {
//   payments: PaymentResponse[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//     hasNext: boolean;
//     hasPrev: boolean;
//   };
//   summary?: {
//     totalAmount: number;
//     approvedAmount: number;
//     pendingAmount: number;
//     refundedAmount: number;
//   };
// }

// export interface ReportingStrategy {
//   getPayments(query: PaymentsQuery): Promise<PaymentsResponse>;
//   getPaymentStats?(filters?: PaymentFilters): Promise<any>;
// }




export type PaymentProvider = 'mercadopago' | 'stripe' | 'modo' | 'ripio';

export type PaymentStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'cancelled' 
  | 'in_process'
  | 'refunded'
  | 'charged_back'
  | 'expired'
  | 'authorized';

export type PaymentMethodType = 
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'ticket'
  | 'atm'
  | 'digital_wallet'
  | 'prepaid_card'
  | 'other';

export type PaymentCategory = 
  | 'accommodation'    // Alojamiento
  | 'loan'            // Préstamo
  | 'subscription'    // Suscripción
  | 'service'         // Servicio
  | 'product'         // Producto
  | 'refund'          // Reembolso
  | 'fee'             // Comisión/Tarifa
  | 'other';          // Otro

export type PaymentFrequency =
  | 'one_time'        // Pago único
  | 'daily'           // Diario
  | 'weekly'          // Semanal
  | 'monthly'         // Mensual
  | 'quarterly'       // Trimestral
  | 'yearly';         // Anual

export interface PaymentItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
  currency?: string;
  category_id?: string;
}

export interface PaymentMetadata {
  userId?: string;
  orderId?: string;
  propertyId?: string;        // ID de propiedad (alojamiento)
  loanId?: string;           // ID de préstamo
  reservationId?: string;    // ID de reserva
  installmentNumber?: number; // Número de cuota
  totalInstallments?: number; // Total de cuotas
  category?: PaymentCategory; // Categoría del pago
  frequency?: PaymentFrequency; // Frecuencia del pago
  dueDate?: string;          // Fecha de vencimiento
  [key: string]: any;
}

export interface PayerInfo {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  identification?: {
    type: string;
    number: string;
  };
  address?: {
    streetName?: string;
    streetNumber?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface PaymentMethodInfo {
  id: string;
  type?: PaymentMethodType;
  name: string;
  issuer?: string;
  installments?: number;
  installmentRate?: number;
}

export interface FeeDetail {
  type: string;
  amount: number;
  fee_payer: string;
}

export interface TransactionDetail {
  netAmount?: number;
  totalPaidAmount?: number;
  installmentAmount?: number;
  financingFeeAmount?: number;
  shippingCost?: number;
  taxesAmount?: number;
  overpaidAmount?: number;
  externalResourceUrl?: string;
}

export interface CreatePaymentRequest {
  items: PaymentItem[];
  metadata?: PaymentMetadata;
  backUrl?: string;
  autoReturn?: 'approved' | 'all';
  notificationUrl?: string;
  expiresIn?: number;
  payer?: PayerInfo;
}

export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  initPoint?: string;
  qrCode?: string;
  externalReference?: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  createdAt: Date;
  paymentMethod?: string;
  paymentType?: string;
  expiresAt?: Date;
  
  // Información extendida
  payer?: PayerInfo;
  paymentMethodInfo?: PaymentMethodInfo;
  transactionDetails?: TransactionDetail;
  feeDetails?: FeeDetail[];
  description?: string;
  captured?: boolean;
  liveMode?: boolean;
  statementDescriptor?: string;
  authorizationCode?: string;
  moneyReleaseStatus?: string;
  moneyReleaseDate?: Date;

  // Metadata extendida para filtros
  metadata?: PaymentMetadata;
}

export interface PaymentConfig {
  provider: PaymentProvider;
  accessToken?: string;
  publicKey?: string;
  webhookSecret?: string;
  sandboxMode?: boolean;
  apiUrl?: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  provider: PaymentProvider;
  timestamp: Date;
}

export interface PaymentStrategy {
  createPayment(request: CreatePaymentRequest): Promise<PaymentResponse>;
  getPaymentStatus(paymentId: string): Promise<PaymentResponse>;
  processWebhook(payload: any, signature?: string): Promise<WebhookEvent>;
  refundPayment?(paymentId: string, amount?: number): Promise<PaymentResponse>;
  getPaymentDetails?(paymentId: string): Promise<PaymentResponse>;
}

export interface PaymentService {
  createPayment(provider: PaymentProvider, request: CreatePaymentRequest): Promise<PaymentResponse>;
  getPaymentStatus(provider: PaymentProvider, paymentId: string): Promise<PaymentResponse>;
  processWebhook(provider: PaymentProvider, payload: any, signature?: string): Promise<WebhookEvent>;
  refundPayment(provider: PaymentProvider, paymentId: string, amount?: number): Promise<PaymentResponse>;
  getPaymentDetails?(provider: PaymentProvider, paymentId: string): Promise<PaymentResponse>;
}

// FILTROS MEJORADOS PARA ALOJAMIENTO Y PRÉSTAMOS
export interface PaymentFilters {
  // Filtros básicos
  status?: PaymentStatus[];
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: string[];
  currency?: string;
  
  // Filtros para alojamiento
  propertyId?: string;
  reservationId?: string;
  accommodationCategory?: string[];
  
  // Filtros para préstamos
  loanId?: string;
  installmentNumber?: number;
  totalInstallments?: number;
  dueDateFrom?: string;
  dueDateTo?: string;
  
  // Filtros por categoría y frecuencia
  category?: PaymentCategory[];
  frequency?: PaymentFrequency[];
  
  // Filtros por usuario
  userId?: string;
  payerEmail?: string;
  
  // Filtros adicionales
  liveMode?: boolean;
  hasInstallments?: boolean;
  minInstallments?: number;
  maxInstallments?: number;
}

export interface PaymentSort {
  field: 'createdAt' | 'amount' | 'status' | 'payerEmail' | 'dueDate' | 'installmentNumber';
  direction: 'asc' | 'desc';
}

export interface PaymentsQuery {
  page: number;
  limit: number;
  filters?: PaymentFilters;
  sort?: PaymentSort;
  search?: string;
}

export interface PaymentsResponse {
  payments: PaymentResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary?: {
    totalAmount: number;
    approvedAmount: number;
    pendingAmount: number;
    refundedAmount: number;
    accommodationAmount: number;
    loanAmount: number;
    subscriptionAmount: number;
  };
}

export interface ReportingStrategy {
  getPayments(query: PaymentsQuery): Promise<PaymentsResponse>;
  getPaymentStats?(filters?: PaymentFilters): Promise<any>;
}