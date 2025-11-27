// organization-module/services/companyService.ts
import { ObjectId, WithId, Document } from 'mongodb';
import { 
  Company, 
  CompanyFilters, 
  CompanyCreateInput, 
  CompanyUpdateInput, 
  RoleName,
  isRoleName
} from '../types/organization';
import { permissionService } from './permissionService';
import clientPromise from '@/lib/mongodb';

// Helper para convertir documentos MongoDB a nuestros tipos
function convertToCompany(doc: WithId<Document>): Company {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    contact_email: doc.contact_email,
    status: doc.status || 'active',
    created_by: doc.created_by,
    created_at: doc.created_at,
    updated_at: doc.updated_at
  };
}

export const companyService = {
  // Crear empresa
  async createCompany(companyData: CompanyCreateInput): Promise<string> {
    const client = await clientPromise;
    const db = client.db();
    
    const now = new Date();
    const company = {
      ...companyData,
      status: 'active',
      created_at: now,
      updated_at: now
    };

    console.log('🏢 Creando empresa:', company);

    const result = await db.collection('companies').insertOne(company);
    return result.insertedId.toString();
  },

  // Obtener empresas con filtros y permisos
  async getCompanies(filters: CompanyFilters = {}, userRoles: RoleName[] = []): Promise<{ companies: Company[]; total: number }> {
    const client = await clientPromise;
    const db = client.db();
    
    const { search, status, page = 1, limit = 10, user_id } = filters;
    const skip = (page - 1) * limit;

    let query: any = {};
    
    // Aplicar filtros de búsqueda
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }

    console.log('🔍 Buscando empresas con query:', { query, userRoles, user_id });

    // Toor ve todas las empresas, otros solo las suyas
    if (!permissionService.canViewAllCompanies(userRoles) && user_id) {
      // Obtener empresas del usuario
      const employees = await db.collection('employees')
        .find({ user_id, status: 'active' })
        .toArray();

      console.log('👥 Empleados encontrados para usuario:', employees.length);

      if (employees.length === 0) {
        console.log('❌ No hay empleados para este usuario');
        return { companies: [], total: 0 };
      }

      const companyIds = employees.map(emp => {
        try {
          // Asegurarnos de que company_id es un ObjectId válido
          if (emp.company_id instanceof ObjectId) {
            return emp.company_id;
          } else if (typeof emp.company_id === 'string') {
            return new ObjectId(emp.company_id);
          } else {
            console.error('❌ Tipo de company_id no válido:', typeof emp.company_id, emp.company_id);
            return null;
          }
        } catch (error) {
          console.error('❌ Error convirtiendo company_id:', emp.company_id, error);
          return null;
        }
      }).filter(id => id !== null) as ObjectId[];

      console.log('🏢 IDs de empresas a buscar:', companyIds);

      if (companyIds.length === 0) {
        console.log('❌ No hay IDs de empresas válidos');
        return { companies: [], total: 0 };
      }

      query._id = { $in: companyIds };
    }

    const [companiesDocs, total] = await Promise.all([
      db.collection('companies')
        .find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('companies').countDocuments(query)
    ]);

    console.log('✅ Empresas encontradas en DB:', companiesDocs.length);

    const companies = companiesDocs.map(convertToCompany);
    return { companies, total };
  },

  // Obtener empresa por ID con verificación de permisos
  async getCompanyById(companyId: string, userRoles: RoleName[] = [], userCompanyId?: string): Promise<Company | null> {
    const client = await clientPromise;
    const db = client.db();
    
    console.log('🔍 Buscando empresa por ID:', companyId);

    let companyDoc;
    try {
      companyDoc = await db.collection('companies').findOne({ 
        _id: new ObjectId(companyId) 
      });
    } catch (error) {
      console.error('❌ Error buscando empresa:', error);
      return null;
    }

    if (!companyDoc) {
      console.log('❌ Empresa no encontrada');
      return null;
    }

    // Verificar permisos si no es toor
    if (!permissionService.canViewAllCompanies(userRoles) && userCompanyId) {
      const canAccess = permissionService.canManageCompany(userRoles, userCompanyId, companyId);
      if (!canAccess) {
        console.log('❌ Usuario no tiene permisos para ver esta empresa');
        return null;
      }
    }

    return convertToCompany(companyDoc);
  },

  // Actualizar empresa con verificación de permisos
  async updateCompany(
    companyId: string, 
    updateData: CompanyUpdateInput, 
    userRoles: RoleName[] = [], 
    userCompanyId?: string
  ): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db();
    
    console.log('🔄 Actualizando empresa:', companyId, updateData);

    // Verificar permisos
    if (!permissionService.canViewAllCompanies(userRoles) && userCompanyId) {
      const canManage = permissionService.canManageCompany(userRoles, userCompanyId, companyId);
      if (!canManage) {
        console.log('❌ Usuario no tiene permisos para actualizar esta empresa');
        return false;
      }
    }

    const result = await db.collection('companies').updateOne(
      { _id: new ObjectId(companyId) },
      { 
        $set: { 
          ...updateData, 
          updated_at: new Date() 
        } 
      }
    );

    console.log('✅ Resultado de actualización:', result.modifiedCount > 0);

    return result.modifiedCount > 0;
  },

  // Eliminar empresa
  async deleteCompany(companyId: string): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db();
    
    console.log('🗑️ Eliminando empresa:', companyId);

    try {
      // Verificar que la empresa existe
      const company = await db.collection('companies').findOne({ 
        _id: new ObjectId(companyId) 
      });

      if (!company) {
        console.log('❌ Empresa no encontrada para eliminar');
        return false;
      }

      console.log('✅ Empresa encontrada en DB:', company.name);

      // Primero eliminar todos los empleados de esta empresa
      try {
        const deleteEmployeesResult = await db.collection('employees').deleteMany({
          company_id: new ObjectId(companyId)
        });
        console.log('✅ Empleados de la empresa eliminados:', deleteEmployeesResult.deletedCount);
      } catch (error) {
        console.error('❌ Error eliminando empleados:', error);
        // Continuar con la eliminación de la empresa aunque falle la de empleados
      }

      // Eliminar la empresa
      const deleteCompanyResult = await db.collection('companies').deleteOne({ 
        _id: new ObjectId(companyId) 
      });

      const success = deleteCompanyResult.deletedCount > 0;
      console.log('✅ Resultado eliminación empresa:', success);

      return success;
    } catch (error) {
      console.error('❌ Error en deleteCompany:', error);
      return false;
    }
  },

  // Obtener empresas de un usuario
  async getUserCompanies(userId: string): Promise<Company[]> {
    const client = await clientPromise;
    const db = client.db();
    
    console.log('🔍 Buscando empresas para usuario:', userId);
    
    const employees = await db.collection('employees')
      .find({ 
        user_id: userId, 
        status: 'active' 
      })
      .toArray();

    console.log('👥 Empleados encontrados:', employees.length);

    if (employees.length === 0) {
      console.log('❌ No se encontraron empleados para el usuario');
      return [];
    }

    const companyIds = employees.map(emp => {
      // Asegurarnos de que company_id es un ObjectId válido
      try {
        if (emp.company_id instanceof ObjectId) {
          return emp.company_id;
        } else if (typeof emp.company_id === 'string') {
          return new ObjectId(emp.company_id);
        } else {
          console.error('❌ Tipo de company_id no válido:', typeof emp.company_id, emp.company_id);
          return null;
        }
      } catch (error) {
        console.error('❌ Error convirtiendo company_id:', emp.company_id, error);
        return null;
      }
    }).filter(id => id !== null) as ObjectId[];

    console.log('🏢 IDs de empresas a buscar:', companyIds);

    if (companyIds.length === 0) {
      console.log('❌ No hay IDs de empresas válidos');
      return [];
    }

    const companyDocs = await db.collection('companies')
      .find({ 
        _id: { $in: companyIds },
        status: 'active'
      })
      .toArray();

    console.log('✅ Empresas encontradas en DB:', companyDocs.length);

    return companyDocs.map(convertToCompany);
  },

  // Obtener roles de un usuario en una empresa - CORREGIDO
  async getUserCompanyRoles(userId: string, companyId: string): Promise<RoleName[]> {
    const client = await clientPromise;
    const db = client.db();
    
    console.log('🔍 Buscando roles para usuario:', userId, 'en empresa:', companyId);

    const employee = await db.collection('employees').findOne({
      user_id: userId,
      company_id: new ObjectId(companyId),
      status: 'active'
    });

    if (!employee) {
      console.log('❌ Empleado no encontrado');
      return [];
    }

    // Obtener nombres de los roles
    const roleIds = (employee.role_ids || []).map((id: any) => {
      try {
        if (id instanceof ObjectId) {
          return id;
        } else if (typeof id === 'string') {
          return new ObjectId(id);
        } else {
          console.error('❌ Tipo de role_id no válido:', typeof id, id);
          return null;
        }
      } catch (error) {
        console.error('❌ Error convirtiendo role_id:', id, error);
        return null;
      }
    }).filter((id: any) => id !== null) as ObjectId[];

    console.log('🎯 IDs de roles a buscar:', roleIds);

    if (roleIds.length === 0) {
      console.log('❌ No hay IDs de roles válidos');
      return [];
    }

    const roles = await db.collection('roles')
      .find({ _id: { $in: roleIds } })
      .toArray();

    console.log('✅ Roles encontrados:', roles.length);

    // Convertir y filtrar solo los RoleName válidos
    const roleNames = roles
      .map((role: any) => role.name)
      .filter(isRoleName);

    console.log('✅ Nombres de roles válidos:', roleNames);

    return roleNames;
  },

  // Verificar si un usuario pertenece a una empresa
  async userBelongsToCompany(userId: string, companyId: string): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db();
    
    const employee = await db.collection('employees').findOne({
      user_id: userId,
      company_id: new ObjectId(companyId),
      status: 'active'
    });

    return employee !== null;
  },

  // Obtener todas las empresas (solo para toor)
  async getAllCompanies(): Promise<Company[]> {
    const client = await clientPromise;
    const db = client.db();
    
    const companyDocs = await db.collection('companies')
      .find({ status: 'active' })
      .sort({ created_at: -1 })
      .toArray();

    return companyDocs.map(convertToCompany);
  },

  // Buscar empresas por slug
  async getCompanyBySlug(slug: string): Promise<Company | null> {
    const client = await clientPromise;
    const db = client.db();
    
    const companyDoc = await db.collection('companies').findOne({ 
      slug: slug,
      status: 'active'
    });

    return companyDoc ? convertToCompany(companyDoc) : null;
  },

  // Contar empresas de un usuario
  async countUserCompanies(userId: string): Promise<number> {
    const client = await clientPromise;
    const db = client.db();
    
    const employees = await db.collection('employees')
      .find({ 
        user_id: userId, 
        status: 'active' 
      })
      .toArray();

    if (employees.length === 0) return 0;

    const companyIds = employees.map(emp => {
      try {
        if (emp.company_id instanceof ObjectId) {
          return emp.company_id;
        } else if (typeof emp.company_id === 'string') {
          return new ObjectId(emp.company_id);
        }
        return null;
      } catch (error) {
        return null;
      }
    }).filter(id => id !== null) as ObjectId[];

    if (companyIds.length === 0) return 0;

    return db.collection('companies')
      .countDocuments({ 
        _id: { $in: companyIds },
        status: 'active'
      });
  }
};