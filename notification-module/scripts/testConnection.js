// notification-module/scripts/testConnection.ts
import clientPromise from '@/lib/mongodb';
import { notificationHistoryService } from '../services/notificationHistoryService';

async function testConnection() {
  try {
    console.log('🔗 Probando conexión a MongoDB...');
    
    // Probar conexión básica
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'notification-test');
    
    // Listar colecciones
    const collections = await db.listCollections().toArray();
    console.log('📂 Colecciones en la base de datos:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    // Probar el servicio de historial
    console.log('🧪 Probando servicio de historial...');
    const testId = await notificationHistoryService.saveNotification({
      channel: 'email',
      to: ['test@example.com'],
      subject: 'Test desde script',
      content: 'Esta es una prueba desde el script de conexión',
      status: 'sent',
      createdAt: new Date(),
    });
    
    console.log('✅ Notificación guardada con ID:', testId);
    
    // Obtener historial
    const history = await notificationHistoryService.getNotificationHistory();
    console.log(`✅ Historial: ${history.length} notificaciones`);
    
    // Obtener estadísticas
    const stats = await notificationHistoryService.getNotificationStats();
    console.log('✅ Estadísticas:', stats);
    
    console.log('🎉 ¡Todas las pruebas pasaron correctamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testConnection();
}

export { testConnection };