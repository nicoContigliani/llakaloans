// organization-module/services/roleService.ts
import { ObjectId, WithId, Document } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import { Role, RoleName } from '../types/organization';

// Helper para convertir documentos de roles
function convertToRole(doc: WithId<Document>): Role {
  return {
    _id: doc._id.toString(), // Convertir ObjectId a string
    name: doc.name as RoleName,
    description: doc.description,
    permissions: doc.permissions,
    hierarchy_level: doc.hierarchy_level
  };
}

// Roles predefinidos del sistema (actualizado con toor)
const SYSTEM_ROLES: Omit<Role, '_id'>[] = [
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

export const roleService = {
  // Inicializar roles del sistema
  async initializeRoles(): Promise<void> {
    const client = await clientPromise;
    const db = client.db();
    
    console.log('🔄 Inicializando roles del sistema...');
    
    for (const roleData of SYSTEM_ROLES) {
      const result = await db.collection('roles').updateOne(
        { name: roleData.name },
        { $setOnInsert: roleData },
        { upsert: true }
      );
      
      if (result.upsertedCount > 0) {
        console.log(`✅ Rol ${roleData.name} creado`);
      } else if (result.modifiedCount > 0) {
        console.log(`📝 Rol ${roleData.name} actualizado`);
      } else {
        console.log(`📁 Rol ${roleData.name} ya existe`);
      }
    }
    
    console.log('✅ Roles del sistema inicializados correctamente');
  },

  // Obtener todos los roles
  async getRoles(): Promise<Role[]> {
    const client = await clientPromise;
    const db = client.db();
    
    console.log('🔍 Obteniendo todos los roles...');
    
    const roleDocs = await db.collection('roles')
      .find()
      .sort({ hierarchy_level: -1 })
      .toArray();

    console.log(`✅ ${roleDocs.length} roles encontrados:`, roleDocs.map(r => r.name));
    
    return roleDocs.map(convertToRole);
  },

  // Obtener rol por nombre
  async getRoleByName(name: RoleName): Promise<Role | null> {
    const client = await clientPromise;
    const db = client.db();
    
    const roleDoc = await db.collection('roles').findOne({ name });
    return roleDoc ? convertToRole(roleDoc) : null;
  },

  // Obtener roles por IDs - MEJORADO con validación
  async getRolesByIds(roleIds: string[]): Promise<Role[]> {
    const client = await clientPromise;
    const db = client.db();
    
    try {
      // Filtrar solo los IDs válidos
      const validRoleIds = roleIds.filter(id => {
        const isValid = ObjectId.isValid(id);
        if (!isValid) {
          console.error('❌ ID de rol inválido:', id);
        }
        return isValid;
      });

      if (validRoleIds.length === 0) {
        console.log('⚠️ No hay IDs de roles válidos');
        return [];
      }

      const objectIds = validRoleIds.map(id => new ObjectId(id));
      
      const roleDocs = await db.collection('roles')
        .find({ _id: { $in: objectIds } })
        .toArray();

      console.log(`✅ Roles encontrados: ${roleDocs.length} de ${validRoleIds.length} solicitados`);
      
      return roleDocs.map(convertToRole);
    } catch (error) {
      console.error('❌ Error obteniendo roles por IDs:', error);
      return [];
    }
  },

  // Obtener el rol toor (para asignaciones especiales)
  async getToorRole(): Promise<Role | null> {
    return this.getRoleByName('toor');
  },

  // Obtener roles por nombres
  async getRolesByNames(names: RoleName[]): Promise<Role[]> {
    const client = await clientPromise;
    const db = client.db();
    
    const roleDocs = await db.collection('roles')
      .find({ name: { $in: names } })
      .toArray();

    return roleDocs.map(convertToRole);
  }
};