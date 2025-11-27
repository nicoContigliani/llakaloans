// organization-module/services/userService.ts
import { ObjectId, WithId, Document } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import { UserWithRoles, UserFilters, RoleName, toRoleNames, isRoleName } from '../types/organization';
import { permissionService } from './permissionService';
import { clerkBackendService } from '../lib/clerk-backend';

// Helper para convertir documentos MongoDB
function convertToUserWithRoles(doc: WithId<Document>): UserWithRoles {
  const companies = (doc.companies || []).map((company: any) => ({
    company_id: company.company_id?.toString?.(),
    company_name: company.company_name,
    roles: Array.isArray(company.roles) ? company.roles.filter(isRoleName) : [],
    status: company.status
  }));

  return {
    user_id: doc.user_id,
    email: doc.email,
    first_name: doc.first_name,
    last_name: doc.last_name,
    companies
  };
}

export const userService = {
  /**
   * Agregar usuario a empresa por email
   */
  async addUserToCompanyByEmail(
    email: string, 
    companyId: string, 
    roleIds: string[],
    currentUserRoles: RoleName[]
  ): Promise<{ 
    success: boolean; 
    employee_id?: string; 
    message: string;
    user?: { id: string; email: string; name: string };
  }> {
    const client = await clientPromise;
    const db = client.db();
    
    console.log('🔍 Buscando usuario por email:', email);

    try {
      // Buscar usuario en Clerk usando el servicio real
      const clerkUser = await clerkBackendService.findUserByEmail(email);
      
      if (!clerkUser) {
        return { 
          success: false, 
          message: 'Usuario no encontrado en Clerk. Asegúrate de que el usuario esté registrado con este email.' 
        };
      }

      const userId = clerkUser.id;
      const userEmail = clerkUser.emailAddresses[0]?.emailAddress || email;
      const userName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'Usuario';

      console.log('✅ Usuario encontrado en Clerk:', { userId, userEmail, userName });

      // Verificar permisos del usuario actual
      const canManage = permissionService.canManageUsers(currentUserRoles);
      if (!canManage) {
        throw new Error('No tienes permisos para gestionar usuarios');
      }

      // Verificar que no esté ya en la empresa
      const existingEmployee = await db.collection('employees').findOne({
        user_id: userId,
        company_id: new ObjectId(companyId)
      });

      if (existingEmployee) {
        return { 
          success: false, 
          message: 'El usuario ya pertenece a esta empresa' 
        };
      }

      // Verificar que los roles existen
      const objectRoleIds = roleIds.map(id => new ObjectId(id));
      const roles = await db.collection('roles').find({
        _id: { $in: objectRoleIds }
      }).toArray();

      if (roles.length !== roleIds.length) {
        return { 
          success: false, 
          message: 'Uno o más roles no existen' 
        };
      }

      // Crear employee record
      const employee = {
        user_id: userId,
        company_id: new ObjectId(companyId),
        role_ids: objectRoleIds,
        status: 'active',
        created_at: new Date()
      };

      const result = await db.collection('employees').insertOne(employee);
      
      console.log('✅ Usuario agregado a la empresa:', result.insertedId);

      return { 
        success: true, 
        employee_id: result.insertedId.toString(),
        message: 'Usuario agregado exitosamente',
        user: {
          id: userId,
          email: userEmail,
          name: userName
        }
      };
    } catch (error) {
      console.error('❌ Error adding user by email:', error);
      throw error;
    }
  },

  /**
   * Método original para compatibilidad (usando user_id)
   */
  async addUserToCompany(
    userId: string, 
    companyId: string, 
    roleIds: string[],
    currentUserRoles: RoleName[]
  ): Promise<string> {
    const client = await clientPromise;
    const db = client.db();

    // Verificar permisos
    const canManage = permissionService.canManageUsers(currentUserRoles);
    if (!canManage) {
      throw new Error('No tienes permisos para gestionar usuarios');
    }

    // Verificar que el usuario existe en Clerk
    const clerkUser = await clerkBackendService.getUserById(userId);
    if (!clerkUser) {
      throw new Error('Usuario no encontrado en Clerk');
    }

    // Verificar que no esté ya en la empresa
    const existingEmployee = await db.collection('employees').findOne({
      user_id: userId,
      company_id: new ObjectId(companyId)
    });

    if (existingEmployee) {
      throw new Error('El usuario ya pertenece a esta empresa');
    }

    // Crear employee record
    const employee = {
      user_id: userId,
      company_id: new ObjectId(companyId),
      role_ids: roleIds.map(id => new ObjectId(id)),
      status: 'active',
      created_at: new Date()
    };

    const result = await db.collection('employees').insertOne(employee);
    return result.insertedId.toString();
  },

  /**
   * Obtener usuarios de una empresa
   */
  async getCompanyUsers(filters: UserFilters, currentUserRoles: RoleName[]): Promise<{ users: UserWithRoles[]; total: number }> {
    const client = await clientPromise;
    const db = client.db();
    
    const { company_id, search, role, status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    // Validar que company_id existe
    if (!company_id) {
      console.error('❌ company_id es requerido');
      return { users: [], total: 0 };
    }

    console.log('🎯 Roles del usuario actual:', currentUserRoles);
    console.log('🔍 Filtros aplicados:', { company_id, search, role, status, page, limit });

    // Construir pipeline de agregación
    const pipeline: any[] = [
      {
        $match: {
          company_id: new ObjectId(company_id),
          status: status || { $in: ['active', 'suspended'] }
        }
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'role_ids',
          foreignField: '_id',
          as: 'user_roles'
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'company_id',
          foreignField: '_id',
          as: 'company_info'
        }
      },
      {
        $unwind: '$company_info'
      },
      {
        $group: {
          _id: '$user_id',
          companies: {
            $push: {
              company_id: '$company_id',
              company_name: '$company_info.name',
              roles: '$user_roles.name',
              status: '$status'
            }
          }
        }
      }
    ];

    // Aplicar filtro de rol si existe y es válido
    if (role && isRoleName(role)) {
      pipeline.splice(1, 0, {
        $match: {
          'user_roles.name': role
        }
      });
    }

    // Obtener usuarios de Clerk para completar la información
    const employees = await db.collection('employees').aggregate(pipeline).toArray();
    
    const usersWithDetails: UserWithRoles[] = [];

    // Enriquecer con información de Clerk
    for (const employee of employees) {
      try {
        const userInfo = await clerkBackendService.getUserInfo(employee._id);
        
        if (userInfo) {
          // Filtrar solo los roles válidos
          const validCompanies = employee.companies.map((company: any) => ({
            ...company,
            roles: Array.isArray(company.roles) ? company.roles.filter(isRoleName) : []
          }));

          usersWithDetails.push({
            user_id: employee._id,
            email: userInfo.email,
            first_name: userInfo.name.split(' ')[0],
            last_name: userInfo.name.split(' ').slice(1).join(' '),
            companies: validCompanies
          });
        }
      } catch (error) {
        console.error('Error obteniendo información de usuario:', employee._id, error);
        // Si falla, al menos mostrar el ID
        usersWithDetails.push({
          user_id: employee._id,
          email: 'usuario@desconocido.com',
          first_name: 'Usuario',
          last_name: 'No encontrado',
          companies: employee.companies.map((company: any) => ({
            ...company,
            roles: Array.isArray(company.roles) ? company.roles.filter(isRoleName) : []
          }))
        });
      }
    }

    // Aplicar filtro de búsqueda
    let filteredUsers = usersWithDetails;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = usersWithDetails.filter(user =>
        user.email.toLowerCase().includes(searchLower) ||
        user.first_name?.toLowerCase().includes(searchLower) ||
        user.last_name?.toLowerCase().includes(searchLower)
      );
    }

    // Paginación
    const paginatedUsers = filteredUsers.slice(skip, skip + limit);

    return {
      users: paginatedUsers,
      total: filteredUsers.length
    };
  },

  /**
   * Actualizar roles de usuario
   */
  async updateUserRoles(
    userId: string,
    companyId: string,
    roleIds: string[],
    currentUserRoles: RoleName[],
    targetUserRoles: RoleName[]
  ): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db();

    // Verificar permisos para modificar roles
    const canModify = permissionService.canModifyRoles(currentUserRoles, targetUserRoles);
    if (!canModify) {
      throw new Error('No tienes permisos para modificar los roles de este usuario');
    }

    const result = await db.collection('employees').updateOne(
      {
        user_id: userId,
        company_id: new ObjectId(companyId)
      },
      {
        $set: {
          role_ids: roleIds.map(id => new ObjectId(id)),
          updated_at: new Date()
        }
      }
    );

    return result.modifiedCount > 0;
  },

  /**
   * Eliminar usuario de empresa
   */
  async removeUserFromCompany(
    userId: string,
    companyId: string,
    currentUserRoles: RoleName[],
    targetUserRoles: RoleName[]
  ): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db();

    // Verificar permisos
    const canModify = permissionService.canModifyRoles(currentUserRoles, targetUserRoles);
    if (!canModify) {
      throw new Error('No tienes permisos para eliminar este usuario');
    }

    // No permitir eliminarse a sí mismo
    // (esto se verifica en el frontend también)

    const result = await db.collection('employees').deleteOne({
      user_id: userId,
      company_id: new ObjectId(companyId)
    });

    return result.deletedCount > 0;
  },

  /**
   * Actualizar estado de usuario en empresa
   */
  async updateUserStatus(
    userId: string,
    companyId: string,
    status: 'active' | 'suspended',
    currentUserRoles: RoleName[]
  ): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db();

    // Verificar permisos
    const canManage = permissionService.canManageUsers(currentUserRoles);
    if (!canManage) {
      throw new Error('No tienes permisos para gestionar usuarios');
    }

    const result = await db.collection('employees').updateOne(
      {
        user_id: userId,
        company_id: new ObjectId(companyId)
      },
      {
        $set: {
          status,
          updated_at: new Date()
        }
      }
    );

    return result.modifiedCount > 0;
  },

  /**
   * Verificar si usuario puede gestionar otros usuarios
   */
  async canUserManageCompanyUsers(userId: string, companyId: string): Promise<boolean> {
    try {
      const userRoles = await this.getUserCompanyRoles(userId, companyId);
      const validUserRoles = toRoleNames(userRoles);
      return permissionService.canManageUsers(validUserRoles);
    } catch (error) {
      console.error('Error verificando permisos de usuario:', error);
      return false;
    }
  },

  /**
   * Obtener roles de usuario en una empresa
   */
  async getUserCompanyRoles(userId: string, companyId: string): Promise<string[]> {
    const client = await clientPromise;
    const db = client.db();

    const employee = await db.collection('employees').findOne({
      user_id: userId,
      company_id: new ObjectId(companyId),
      status: { $in: ['active', 'suspended'] }
    });

    if (!employee) {
      return [];
    }

    const roles = await db.collection('roles').find({
      _id: { $in: employee.role_ids }
    }).toArray();

    return roles.map(role => role.name);
  },

  /**
   * Obtener información básica del empleado
   */
  async getEmployeeInfo(userId: string, companyId: string): Promise<{
    user_id: string;
    roles: RoleName[];
    status: string;
    created_at: Date;
  } | null> {
    const client = await clientPromise;
    const db = client.db();

    const employee = await db.collection('employees').findOne({
      user_id: userId,
      company_id: new ObjectId(companyId)
    });

    if (!employee) {
      return null;
    }

    // Obtener nombres de roles
    const roles = await db.collection('roles').find({
      _id: { $in: employee.role_ids }
    }).toArray();

    const roleNames = roles
      .map(role => role.name)
      .filter(isRoleName);

    return {
      user_id: employee.user_id,
      roles: roleNames,
      status: employee.status,
      created_at: employee.created_at
    };
  },

  /**
   * Obtener todas las empresas de un usuario
   */
  async getUserCompanies(userId: string): Promise<Array<{
    company_id: string;
    company_name: string;
    roles: RoleName[];
    status: string;
  }>> {
    const client = await clientPromise;
    const db = client.db();

    const employees = await db.collection('employees')
      .aggregate([
        {
          $match: {
            user_id: userId,
            status: { $in: ['active', 'suspended'] }
          }
        },
        {
          $lookup: {
            from: 'companies',
            localField: 'company_id',
            foreignField: '_id',
            as: 'company_info'
          }
        },
        {
          $unwind: '$company_info'
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role_ids',
            foreignField: '_id',
            as: 'user_roles'
          }
        },
        {
          $project: {
            company_id: '$company_id',
            company_name: '$company_info.name',
            roles: '$user_roles.name',
            status: '$status'
          }
        }
      ])
      .toArray();

    return employees.map(emp => ({
      company_id: emp.company_id.toString(),
      company_name: emp.company_name,
      roles: Array.isArray(emp.roles) ? emp.roles.filter(isRoleName) : [],
      status: emp.status
    }));
  }
};