// notification-module/services/notificationHistoryService.ts
import { MongoClient, ObjectId } from 'mongodb';
import { NotificationHistory, NotificationFilters } from '../types/notification';
import clientPromise from '@/lib/mongodb';

export class NotificationHistoryService {
  private collectionName = 'notifications';
  private dbName = process.env.MONGODB_DB || 'notification-test';

  async saveNotification(notification: Omit<NotificationHistory, 'id'>): Promise<string> {
    try {
      const client = await clientPromise;
      const db = client.db(this.dbName);
      
      const result = await db.collection(this.collectionName).insertOne({
        ...notification,
        createdAt: notification.createdAt || new Date(),
      });
      
      console.log('✅ Notificación guardada en MongoDB:', result.insertedId);
      return result.insertedId.toString();
    } catch (error) {
      console.error('❌ Error guardando en MongoDB:', error);
      // Fallback: generar ID temporal si falla la DB
      return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  async updateNotificationStatus(id: string, status: 'sent' | 'failed', sentAt?: Date): Promise<void> {
    try {
      const client = await clientPromise;
      const db = client.db(this.dbName);
      
      await db.collection(this.collectionName).updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            status,
            sentAt: sentAt || new Date(),
          } 
        }
      );
      console.log('✅ Estado actualizado en MongoDB para:', id);
    } catch (error) {
      console.error('❌ Error actualizando estado en MongoDB:', error);
    }
  }

  async getNotificationHistory(filters: NotificationFilters = {}, limit = 50, skip = 0): Promise<NotificationHistory[]> {
    try {
      const client = await clientPromise;
      const db = client.db(this.dbName);
      
      const query: any = {};
      
      if (filters.channel) {
        query.channel = filters.channel;
      }
      
      if (filters.status) {
        query.status = filters.status;
      }
      
      if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) {
          query.createdAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          query.createdAt.$lte = new Date(filters.dateTo);
        }
      }
      
      if (filters.search) {
        query.$or = [
          { content: { $regex: filters.search, $options: 'i' } },
          { subject: { $regex: filters.search, $options: 'i' } },
          { to: { $in: [new RegExp(filters.search, 'i')] } },
        ];
      }

      const notifications = await db
        .collection(this.collectionName)
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      console.log(`✅ Obtenidas ${notifications.length} notificaciones de MongoDB`);
      
      return notifications.map(notif => ({
        id: notif._id.toString(),
        channel: notif.channel,
        to: notif.to,
        subject: notif.subject,
        content: notif.content,
        status: notif.status,
        createdAt: notif.createdAt,
        sentAt: notif.sentAt,
        providerResponse: notif.providerResponse,
        error: notif.error,
      }));
    } catch (error) {
      console.error('❌ Error obteniendo historial de MongoDB:', error);
      return []; // Retornar array vacío en caso de error
    }
  }

  async getNotificationStats(): Promise<Array<{
    _id: string;
    total: number;
    sent: number;
    failed: number;
  }>> {
    try {
      const client = await clientPromise;
      const db = client.db(this.dbName);
      
      const stats = await db
        .collection(this.collectionName)
        .aggregate([
          {
            $group: {
              _id: '$channel',
              total: { $sum: 1 },
              sent: { 
                $sum: { 
                  $cond: [
                    { $eq: ['$status', 'sent'] }, 
                    1, 
                    0 
                  ] 
                } 
              },
              failed: { 
                $sum: { 
                  $cond: [
                    { $eq: ['$status', 'failed'] }, 
                    1, 
                    0 
                  ] 
                } 
              },
            },
          },
        ])
        .toArray();

      console.log('✅ Estadísticas obtenidas de MongoDB:', stats);
      
      return stats as Array<{
        _id: string;
        total: number;
        sent: number;
        failed: number;
      }>;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de MongoDB:', error);
      return [];
    }
  }

  // Método adicional: limpiar notificaciones antiguas
  async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
    try {
      const client = await clientPromise;
      const db = client.db(this.dbName);
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await db.collection(this.collectionName).deleteMany({
        createdAt: { $lt: cutoffDate }
      });
      
      console.log(`✅ Limpiadas ${result.deletedCount} notificaciones antiguas`);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Error limpiando notificaciones antiguas:', error);
      return 0;
    }
  }
}

export const notificationHistoryService = new NotificationHistoryService();