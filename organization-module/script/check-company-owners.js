// organization-module/scripts/check-roles.js
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkRoles() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está definida en .env.local');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('🔍 Verificando roles en la base de datos...');
    console.log(`📊 Conectado a: ${db.databaseName}\n`);
    
    const roles = await db.collection('roles').find().sort({ hierarchy_level: -1 }).toArray();
    
    console.log(`📊 Total de roles encontrados: ${roles.length}\n`);
    
    if (roles.length === 0) {
      console.log('❌ No hay roles en la base de datos');
      console.log('💡 Ejecuta: node -r dotenv/config organization-module/scripts/init-organization.js');
      return;
    }
    
    // Roles requeridos del sistema
    const requiredRoles = ['toor', 'owner', 'admin', 'user', 'guest'];
    const existingRoleNames = roles.map(role => role.name);
    const missingRoles = requiredRoles.filter(role => !existingRoleNames.includes(role));
    
    console.log('🎯 ROLES DEL SISTEMA:');
    console.log('=' .repeat(80));
    
    roles.forEach(role => {
      const isRequired = requiredRoles.includes(role.name);
      const status = isRequired ? '✅ REQUERIDO' : '📌 PERSONALIZADO';
      
      console.log(`\n📋 ${role.name.toUpperCase()} - ${status}`);
      console.log(`   ID: ${role._id}`);
      console.log(`   Descripción: ${role.description}`);
      console.log(`   Nivel de jerarquía: ${role.hierarchy_level}`);
      console.log(`   Permisos: ${role.permissions?.join(', ') || 'Ninguno'}`);
      console.log(`   Creado: ${role.created_at ? new Date(role.created_at).toLocaleDateString() : 'No especificado'}`);
    });
    
    if (missingRoles.length > 0) {
      console.log(`\n❌ ROLES FALTANTES: ${missingRoles.join(', ')}`);
      console.log('💡 Ejecuta el script de inicialización para crearlos.');
    }
    
    // Verificar uso de roles
    console.log('\n📊 ESTADÍSTICAS DE USO:');
    console.log('=' .repeat(80));
    
    const employeesByRole = await db.collection('employees').aggregate([
      { $unwind: '$role_ids' },
      {
        $lookup: {
          from: 'roles',
          localField: 'role_ids',
          foreignField: '_id',
          as: 'role_info'
        }
      },
      { $unwind: '$role_info' },
      {
        $group: {
          _id: '$role_info.name',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    console.log('\n👥 EMPLEADOS POR ROL:');
    employeesByRole.forEach(item => {
      console.log(`   ${item._id}: ${item.count} empleados`);
    });
    
    const totalEmployees = await db.collection('employees').countDocuments();
    console.log(`   TOTAL: ${totalEmployees} empleados`);
    
    console.log('\n💡 RECOMENDACIONES:');
    if (missingRoles.length > 0) {
      console.log('   ❌ Ejecuta el script de inicialización para crear los roles faltantes');
    }
    if (totalEmployees === 0) {
      console.log('   ⚠️  No hay empleados registrados. Crea empresas para generar empleados automáticamente.');
    }
    
  } catch (error) {
    console.error('❌ Error verificando roles:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar solo si es el script principal
if (require.main === module) {
  checkRoles();
}

module.exports = { checkRoles };