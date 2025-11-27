// Ejecutar: node -r dotenv/config organization-module/scripts/init-organization.js
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' }); // Cargar variables de entorno

async function initOrganization() {
  // Verificar que MONGODB_URI existe
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está definida en .env.local');
    console.log('💡 Asegúrate de tener un archivo .env.local con:');
    console.log('MONGODB_URI=mongodb://localhost:27017/tu-base-de-datos');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('🚀 Inicializando módulo de organización...');
    console.log(`📊 Conectado a la base de datos: ${db.databaseName}`);
    
    // Crear colecciones si no existen
    const collections = ['companies', 'employees', 'roles'];
    
    for (const collectionName of collections) {
      const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
      if (!collectionExists) {
        await db.createCollection(collectionName);
        console.log(`✅ Colección ${collectionName} creada`);
      } else {
        console.log(`📁 Colección ${collectionName} ya existe`);
      }
    }
    
    // Crear índices para performance
    console.log('🔧 Creando índices para optimizar performance...');
    
    await db.collection('companies').createIndex({ slug: 1 }, { unique: true });
    console.log('✅ Índice único en companies.slug creado');
    
    await db.collection('companies').createIndex({ created_by: 1 });
    console.log('✅ Índice en companies.created_by creado');
    
    await db.collection('companies').createIndex({ status: 1 });
    console.log('✅ Índice en companies.status creado');
    
    await db.collection('employees').createIndex({ user_id: 1, company_id: 1 }, { unique: true });
    console.log('✅ Índice único compuesto en employees (user_id, company_id) creado');
    
    await db.collection('employees').createIndex({ company_id: 1 });
    console.log('✅ Índice en employees.company_id creado');
    
    await db.collection('employees').createIndex({ status: 1 });
    console.log('✅ Índice en employees.status creado');
    
    await db.collection('roles').createIndex({ name: 1 }, { unique: true });
    console.log('✅ Índice único en roles.name creado');
    
    await db.collection('roles').createIndex({ hierarchy_level: 1 });
    console.log('✅ Índice en roles.hierarchy_level creado');

    // Insertar roles del sistema (con toor como máximo nivel)
    console.log('👥 Insertando roles del sistema...');
    
    const systemRoles = [
      {
        name: 'toor',
        description: 'Super administrador del sistema - Acceso total a todo',
        permissions: ['*', 'system:*', 'company:*', 'user:*', 'settings:*'],
        hierarchy_level: 1000
      },
      {
        name: 'owner',
        description: 'Dueño de la empresa - Acceso total a su empresa',
        permissions: ['company:manage', 'user:manage', 'settings:manage'],
        hierarchy_level: 100
      },
      {
        name: 'admin',
        description: 'Administrador - Gestiona usuarios y configuraciones',
        permissions: ['company:manage', 'user:manage', 'settings:manage'],
        hierarchy_level: 80
      },
      {
        name: 'user',
        description: 'Usuario regular - Acceso básico a funcionalidades',
        permissions: ['dashboard:view', 'payments:create', 'notifications:view'],
        hierarchy_level: 50
      },
      {
        name: 'guest',
        description: 'Invitado - Acceso limitado de solo lectura',
        permissions: ['dashboard:view'],
        hierarchy_level: 10
      }
    ];

    for (const role of systemRoles) {
      const result = await db.collection('roles').updateOne(
        { name: role.name },
        { $setOnInsert: role },
        { upsert: true }
      );
      
      if (result.upsertedCount > 0) {
        console.log(`✅ Rol ${role.name} (nivel ${role.hierarchy_level}) creado`);
      } else {
        console.log(`📁 Rol ${role.name} ya existe`);
      }
    }
    
    console.log('🎉 Módulo de organización inicializado correctamente');
    console.log('📋 Colecciones creadas: companies, employees, roles');
    console.log('🔍 Índices optimizados para performance');
    console.log('👥 Roles del sistema configurados: toor, owner, admin, user, guest');
    console.log('🔝 Rol toor creado como super administrador del sistema');
    
  } catch (error) {
    console.error('❌ Error inicializando organización:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  }
}

// Ejecutar solo si es el script principal
if (require.main === module) {
  initOrganization();
}

module.exports = { initOrganization };