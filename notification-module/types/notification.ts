export interface NotificationMessage {
  id?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  content: string;
  htmlContent?: string;
  channel: 'email' | 'whatsapp' | 'telegram';
  metadata?: Record<string, any>;
  scheduledFor?: Date;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  providerResponse?: any;
  error?: string;
}

export interface NotificationHistory {
  id: string;
  channel: 'email' | 'whatsapp' | 'telegram';
  to: string[];
  subject?: string;
  content: string;
  status: 'sent' | 'failed' | 'pending';
  createdAt: Date;
  sentAt?: Date;
  providerResponse?: any;
  error?: string;
}

export interface NotificationFilters {
  channel?: 'email' | 'whatsapp' | 'telegram';
  status?: 'sent' | 'failed' | 'pending';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface INotificationStrategy {
  send(message: NotificationMessage): Promise<NotificationResult>;
  validate(message: NotificationMessage): boolean;
}

export interface BulkNotificationRequest {
  bulk: boolean;
  messages: NotificationMessage[];
}