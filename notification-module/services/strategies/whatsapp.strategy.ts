import { NotificationMessage, NotificationResult, INotificationStrategy } from '../../types/notification';

export class WhatsAppStrategy implements INotificationStrategy {
  validate(message: NotificationMessage): boolean {
    const phones = Array.isArray(message.to) ? message.to : [message.to];
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    
    return phones.every(phone => phoneRegex.test(phone) && phone.length >= 10);
  }

  async send(message: NotificationMessage): Promise<NotificationResult> {
    // Placeholder para implementación futura
    console.log('WhatsApp message would be sent:', message);
    return {
      success: false,
      error: 'WhatsApp integration not yet implemented',
    };
  }
}