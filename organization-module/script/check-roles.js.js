// organization-module/scripts/check-roles.js
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkRoles() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('🔍 Verificando roles en la base de datos...');
    
    const roles = await db.collection('roles').find().toArray();
    
    console.log(`📊 Total de roles encontrados: ${roles.length}`);
    
    roles.forEach(role => {
      console.log(`\n📋 Rol: ${role.name}`);
      console.log(`   ID: ${role._id}`);
      console.log(`   Descripción: ${role.description}`);
      console.log(`   Nivel: ${role.hierarchy_level}`);
      console.log(`   Permisos: ${role.permissions.join(', ')}`);
    });
    
    if (roles.length === 0) {
      console.log('\n❌ No hay roles en la base de datos');
      console.log('💡 Ejecuta: node -r dotenv/config organization-module/scripts/init-organization.js');
    }
    
  } catch (error) {
    console.error('❌ Error verificando roles:', error);
  } finally {
    await client.close();
  }
}

checkRoles();