// Ejecutar: node scripts/init-permissions.js
const { MongoClient } = require('mongodb');

async function init() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Crear índices para mejor performance
    await db.collection('empresa_permissions').createIndex(
      { user_id: 1, empresa_id: 1 }, 
      { unique: true }
    );
    
    console.log('✅ Colecciones de permisos inicializadas correctamente');
  } catch (error) {
    console.error('❌ Error inicializando permisos:', error);
  } finally {
    await client.close();
  }
}

init();// Ejecutar: node scripts/init-permissions.js
const { MongoClient } = require('mongodb');

async function init() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Crear índices para mejor performance
    await db.collection('empresa_permissions').createIndex(
      { user_id: 1, empresa_id: 1 }, 
      { unique: true }
    );
    
    console.log('✅ Colecciones de permisos inicializadas correctamente');
  } catch (error) {
    console.error('❌ Error inicializando permisos:', error);
  } finally {
    await client.close();
  }
}

init();