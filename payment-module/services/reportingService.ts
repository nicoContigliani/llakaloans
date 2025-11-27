import { 
  PaymentsQuery, 
  PaymentsResponse,
  PaymentProvider,
  PaymentFilters 
} from '../types/payment';
import { getPaymentConfig } from '../config/payment.config';
import { MercadoPagoReportingStrategy } from '@/payment-module/services/strategies/mercadopago-reporting.strategy';

export class ReportingServiceImpl {
  private strategies: Map<PaymentProvider, any> = new Map();

  constructor() {
    const config = getPaymentConfig();
    
    if (config.mercadopago.accessToken) {
      console.log('✅ MercadoPago reporting strategy initialized');
      this.strategies.set('mercadopago', new MercadoPagoReportingStrategy(config.mercadopago));
    }
    
    // Agregar otras estrategias cuando estén implementadas
    console.log(`Reporting service initialized with ${this.strategies.size} strategies`);
  }

  async getPayments(provider: PaymentProvider, query: PaymentsQuery): Promise<PaymentsResponse> {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      throw new Error(`Reporting for provider ${provider} not supported`);
    }
    
    console.log(`Fetching payments for ${provider}`, {
      page: query.page,
      limit: query.limit,
      filters: query.filters
    });
    
    return strategy.getPayments(query);
  }

  getAvailableProviders(): PaymentProvider[] {
    return Array.from(this.strategies.keys());
  }
}

// Singleton instance
let reportingServiceInstance: ReportingServiceImpl;

export const getReportingService = (): ReportingServiceImpl => {
  if (!reportingServiceInstance) {
    reportingServiceInstance = new ReportingServiceImpl();
  }
  return reportingServiceInstance;
};