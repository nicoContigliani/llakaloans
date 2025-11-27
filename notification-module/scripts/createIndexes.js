// notification-module/scripts/createIndexes.js
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno desde .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'notificationsdb';

async function createIndexes() {
  if (!uri) {
    console.error('❌ MONGODB_URI no está definida');
    console.log('💡 Verificando variables de entorno cargadas:');
    console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Definida' : '❌ No definida');
    console.log('   SMTP_USER:', process.env.SMTP_USER ? '✅ Definida' : '❌ No definida');
    console.log('💡 Asegúrate de tener un archivo .env.local en la raíz del proyecto');
    process.exit(1);
  }

  console.log('🔗 Conectando a MongoDB...');
  console.log('URI:', uri);
  console.log('Base de datos:', dbName);

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    
    // Crear la colección si no existe
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'notifications');
    
    if (!collectionExists) {
      await db.createCollection('notifications');
      console.log('✅ Colección "notifications" creada');
    }
    
    const collection = db.collection('notifications');
    
    console.log('🔄 Creando índices para MongoDB...');
    
    // Índices a crear
    const indexes = [
      { key: { channel: 1, createdAt: -1 }, name: 'channel_createdAt_desc' },
      { key: { status: 1 }, name: 'status' },
      { key: { createdAt: -1 }, name: 'createdAt_desc' },
      { key: { channel: 1, status: 1, createdAt: -1 }, name: 'channel_status_createdAt' },
    ];

    for (const index of indexes) {
      try {
        await collection.createIndex(index.key, { name: index.name });
        console.log(`✅ Índice creado: ${index.name} (${JSON.stringify(index.key)})`);
      } catch (error) {
        if (error.codeName === 'IndexKeySpecsConflict' || error.message.includes('already exists')) {
          console.log(`⚠️  Índice ya existe: ${index.name}`);
        } else {
          console.log(`❌ Error creando índice ${index.name}:`, error.message);
        }
      }
    }
    
    // Índice de texto (separado porque es especial)
    try {
      await collection.createIndex(
        { subject: 'text', content: 'text' },
        { name: 'text_search' }
      );
      console.log('✅ Índice de texto creado: text_search');
    } catch (error) {
      console.log('⚠️  Índice de texto ya existe o error:', error.message);
    }
    
    console.log('🎉 Proceso de índices completado');
    
    // Mostrar índices existentes
    const existingIndexes = await collection.indexes();
    console.log('\n📊 Índices existentes en la colección "notifications":');
    existingIndexes.forEach((index, i) => {
      console.log(`  ${i + 1}. ${index.name}:`, JSON.stringify(index.key));
    });
    
    console.log(`\n📈 Total: ${existingIndexes.length} índices`);
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 ¿Está MongoDB corriendo? Ejecuta: mongod');
      console.log('💡 O instala MongoDB con:');
      console.log('   - Ubuntu: sudo apt install mongodb');
      console.log('   - macOS: brew install mongodb-community');
      console.log('   - Windows: Descarga desde https://www.mongodb.com/try/download/community');
    } else if (error.message.includes('Authentication failed')) {
      console.log('💡 Error de autenticación. Verifica MONGODB_URI');
    }
    throw error;
  } finally {
    await client.close();
    console.log('🔒 Conexión cerrada');
  }
}

// Ejecutar
createIndexes()
  .then(() => {
    console.log('\n✨ Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error en el proceso');
    process.exit(1);
  });