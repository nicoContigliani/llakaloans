// notification-module/services/notificationService.ts - Versión corregida
import { NotificationMessage, NotificationResult, INotificationStrategy } from '../types/notification';
import { NodemailerStrategy } from './strategies/nodemailer.strategy';
import { notificationConfig } from '../config/notification.config';

export class NotificationService {
  private strategies: Map<string, INotificationStrategy>;

  constructor() {
    this.strategies = new Map();
    this.strategies.set('nodemailer', new NodemailerStrategy());
    // Comentar temporalmente los otros servicios
    // this.strategies.set('whatsapp', new WhatsAppStrategy());
    // this.strategies.set('telegram', new TelegramStrategy());
  }

  private getStrategy(channel: NotificationMessage['channel']): INotificationStrategy {
    const strategyName = notificationConfig.channels[channel].strategy;
    const strategy = this.strategies.get(strategyName);
    
    if (!strategy) {
      throw new Error(`No strategy found for channel: ${channel}`);
    }
    
    return strategy;
  }

  async sendNotification(message: NotificationMessage): Promise<NotificationResult> {
    try {
      const strategy = this.getStrategy(message.channel);
      
      if (!notificationConfig.channels[message.channel].enabled) {
        return {
          success: false,
          error: `Channel ${message.channel} is not enabled`,
        };
      }

      const result = await strategy.send(message);
      return result;
      
    } catch (error) {
      console.error('Notification service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async sendBulkNotifications(messages: NotificationMessage[]): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];
    
    for (const message of messages) {
      const result = await this.sendNotification(message);
      results.push(result);
    }
    
    return results;
  }
}

export const notificationService = new NotificationService();