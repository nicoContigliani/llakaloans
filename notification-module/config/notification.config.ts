export const notificationConfig = {
  defaultChannel: 'email' as const,
  retryAttempts: 3,
  retryDelay: 1000,
  batchSize: 50,
  
  channels: {
    email: {
      enabled: true,
      strategy: 'nodemailer' as const,
    },
    whatsapp: {
      enabled: false,
      strategy: 'whatsapp' as const,
    },
    telegram: {
      enabled: false,
      strategy: 'telegram' as const,
    }
  }
} as const;

export type NotificationChannel = keyof typeof notificationConfig.channels;