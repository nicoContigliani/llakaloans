import { NotificationMessage, NotificationResult, INotificationStrategy } from '../../types/notification';

export class TelegramStrategy implements INotificationStrategy {
  validate(message: NotificationMessage): boolean {
    const chats = Array.isArray(message.to) ? message.to : [message.to];
    // Validación básica para IDs de chat de Telegram
    return chats.every(chat => /^-?\d+$/.test(chat));
  }

  async send(message: NotificationMessage): Promise<NotificationResult> {
    // Placeholder para implementación futura
    console.log('Telegram message would be sent:', message);
    return {
      success: false,
      error: 'Telegram integration not yet implemented',
    };
  }
}