// Ejecutar: node organization-module/script/assign-toor.js user_34hdQEfadxH5koWTct9nizAJtjdconst { MongoClient, ObjectId } = require('mongodb');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function assignToorRole(userId) {
  if (!userId) {
    console.error('❌ Error: Debes proporcionar un user ID de Clerk');
    console.log('💡 Uso: node scripts/assign-toor-role.js TU_USER_ID_CLERK');
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está definida');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log(`🔧 Asignando rol toor al usuario: ${userId}`);
    
    // Obtener el rol toor
    const toorRole = await db.collection('roles').findOne({ name: 'toor' });
    
    if (!toorRole) {
      console.error('❌ Error: Rol toor no encontrado');
      process.exit(1);
    }

    console.log('✅ Rol toor encontrado:', toorRole);

    // Obtener todas las empresas existentes
    const companies = await db.collection('companies').find().toArray();
    console.log(`🏢 Empresas encontradas: ${companies.length}`);

    // Asignar rol toor al usuario en TODAS las empresas
    for (const company of companies) {
      console.log(`🔗 Asignando toor a empresa: ${company.name}`);
      
      // Verificar si ya existe un employee record
      const existingEmployee = await db.collection('employees').findOne({
        user_id: userId,
        company_id: company._id
      });

      if (existingEmployee) {
        // Actualizar roles existentes para incluir toor
        const updatedRoleIds = [...new Set([...existingEmployee.role_ids, toorRole._id])];
        
        await db.collection('employees').updateOne(
          { _id: existingEmployee._id },
          { $set: { role_ids: updatedRoleIds } }
        );
        console.log(`✅ Roles actualizados para empresa: ${company.name}`);
      } else {
        // Crear nuevo employee record
        const employee = {
          user_id: userId,
          company_id: company._id,
          role_ids: [toorRole._id],
          status: 'active',
          created_at: new Date()
        };

        await db.collection('employees').insertOne(employee);
        console.log(`✅ Nuevo employee creado para empresa: ${company.name}`);
      }
    }

    console.log('🎉 Rol toor asignado correctamente en TODAS las empresas');
    console.log(`👤 Usuario ${userId} ahora tiene acceso total al sistema`);
    
  } catch (error) {
    console.error('❌ Error asignando rol toor:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Ejecutar solo si es el script principal
if (require.main === module) {
  // Obtener user ID de los argumentos
  const userId = process.argv[2];
  assignToorRole(userId);
}

module.exports = { assignToorRole };