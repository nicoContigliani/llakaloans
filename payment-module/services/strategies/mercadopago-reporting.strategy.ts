import { 
  ReportingStrategy, 
  PaymentsQuery, 
  PaymentsResponse,
  PaymentResponse,
  PaymentFilters,
  PaymentStatus 
} from '@/payment-module/types/payment';
import { PaymentConfig } from '@/payment-module/types/payment';

export class MercadoPagoReportingStrategy implements ReportingStrategy {
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  async getPayments(query: PaymentsQuery): Promise<PaymentsResponse> {
    if (!this.config.accessToken) {
      throw new Error('MercadoPago access token not configured');
    }

    // VERSIÓN ULTRA SIMPLE - Solo parámetros básicos
    const params = new URLSearchParams();
    
    // Paginación básica
    const offset = query.page * query.limit;
    params.append('offset', offset.toString());
    params.append('limit', query.limit.toString());
    
    // Ordenamiento básico
    params.append('sort', 'date_created');
    params.append('criteria', 'desc');
    
    console.log('🔄 Fetching payments from MercadoPago with simple params:', Object.fromEntries(params));

    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ MercadoPago API Error:', error);
        throw new Error(`MercadoPago API Error: ${error.message || JSON.stringify(error)}`);
      }

      const data = await response.json();
      console.log('✅ MercadoPago response received, mapping data...');
      
      return this.mapPaymentsResponse(data, query);
    } catch (error) {
      console.error('❌ Error fetching payments from MercadoPago:', error);
      throw error;
    }
  }

  private mapPaymentsResponse(mpData: any, query: PaymentsQuery): PaymentsResponse {
    // Verificar que tenemos resultados
    if (!mpData.results || !Array.isArray(mpData.results)) {
      console.warn('⚠️ No results found in MercadoPago response');
      return {
        payments: [],
        pagination: {
          page: query.page,
          limit: query.limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        summary: {
          totalAmount: 0,
          approvedAmount: 0,
          pendingAmount: 0,
          refundedAmount: 0,
          accommodationAmount: 0,
          loanAmount: 0,
          subscriptionAmount: 0
        }
      };
    }

    const payments: PaymentResponse[] = mpData.results.map((payment: any) => ({
      id: payment.id.toString(),
      status: this.mapStatus(payment.status),
      externalReference: payment.external_reference,
      provider: 'mercadopago',
      amount: payment.transaction_amount || 0,
      currency: payment.currency_id || 'ARS',
      createdAt: new Date(payment.date_created),
      paymentMethod: payment.payment_method_id,
      paymentType: payment.payment_type_id,
      payer: {
        email: payment.payer?.email,
        firstName: payment.payer?.first_name,
        lastName: payment.payer?.last_name,
      },
      description: payment.description,
      liveMode: payment.live_mode,
    }));

    const total = mpData.paging?.total || payments.length;
    const totalPages = Math.ceil(total / query.limit);

    // Calcular resumen
    const summary = this.calculateSummary(payments);

    console.log(`✅ Mapped ${payments.length} payments, total: ${total}`);

    return {
      payments,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNext: query.page < totalPages - 1,
        hasPrev: query.page > 0,
      },
      summary,
    };
  }

  private calculateSummary(payments: PaymentResponse[]): any {
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const approvedAmount = payments
      .filter(p => p.status === 'approved')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = payments
      .filter(p => p.status === 'pending' || p.status === 'in_process')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const refundedAmount = payments
      .filter(p => p.status === 'refunded')
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      totalAmount,
      approvedAmount,
      pendingAmount,
      refundedAmount,
    };
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
    };

    return statusMap[mpStatus] || 'pending';
  }
}