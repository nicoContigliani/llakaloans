// organization-module/services/permissionService.ts
import { RoleName, HIERARCHY_LEVELS } from '../types/organization';

export const permissionService = {
  // Obtener el nivel máximo de un usuario
  getMaxHierarchyLevel(userRoles: RoleName[]): number {
    if (!userRoles.length) return 0;
    return Math.max(...userRoles.map(role => HIERARCHY_LEVELS[role]));
  },

  // Toor puede ver todas las empresas
  canViewAllCompanies(userRoles: RoleName[]): boolean {
    return this.getMaxHierarchyLevel(userRoles) >= HIERARCHY_LEVELS.toor;
  },

  // Verificar si puede manejar una empresa específica
  canManageCompany(
    userRoles: RoleName[], 
    userCompanyId: string, 
    targetCompanyId: string
  ): boolean {
    const maxLevel = this.getMaxHierarchyLevel(userRoles);
    
    // Toor puede manejar cualquier empresa
    if (maxLevel >= HIERARCHY_LEVELS.toor) return true;
    
    // Owner/Admin solo puede manejar su propia empresa
    if (maxLevel >= HIERARCHY_LEVELS.owner) {
      return userCompanyId === targetCompanyId;
    }
    
    return false;
  },

  // Verificar si puede gestionar usuarios
  canManageUsers(userRoles: RoleName[]): boolean {
    const maxLevel = this.getMaxHierarchyLevel(userRoles);
    return maxLevel >= HIERARCHY_LEVELS.admin;
  },

  // Verificar si puede modificar roles de otro usuario
  canModifyRoles(
    userRoles: RoleName[], 
    targetUserRoles: RoleName[]
  ): boolean {
    const userLevel = this.getMaxHierarchyLevel(userRoles);
    const targetLevel = this.getMaxHierarchyLevel(targetUserRoles);
    
    // Solo puede modificar roles de usuarios con nivel inferior
    return userLevel > targetLevel;
  },

  // Verificar si puede asignar un rol específico
  canAssignRole(userRoles: RoleName[], targetRole: RoleName): boolean {
    const userLevel = this.getMaxHierarchyLevel(userRoles);
    const targetRoleLevel = HIERARCHY_LEVELS[targetRole];
    
    // Solo puede asignar roles de nivel inferior al suyo
    return userLevel > targetRoleLevel;
  },

  // Verificar permisos específicos
  hasPermission(userRoles: RoleName[], permission: string): boolean {
    // Toor tiene todos los permisos
    if (userRoles.includes('toor')) return true;
    
    const maxLevel = this.getMaxHierarchyLevel(userRoles);
    
    switch (permission) {
      case 'company:create':
        return maxLevel >= HIERARCHY_LEVELS.owner;
      case 'user:manage':
        return maxLevel >= HIERARCHY_LEVELS.admin;
      case 'user:view':
        return maxLevel >= HIERARCHY_LEVELS.user;
      case 'company:delete':
        return maxLevel >= HIERARCHY_LEVELS.owner;
      case 'company:edit':
        return maxLevel >= HIERARCHY_LEVELS.admin;
      default:
        return false;
    }
  },

  // Obtener roles que puede asignar
  getAssignableRoles(userRoles: RoleName[]): RoleName[] {
    const userLevel = this.getMaxHierarchyLevel(userRoles);
    const assignableRoles: RoleName[] = [];

    if (userLevel >= HIERARCHY_LEVELS.toor) {
      assignableRoles.push('toor', 'owner', 'admin', 'user', 'guest');
    } else if (userLevel >= HIERARCHY_LEVELS.owner) {
      assignableRoles.push('owner', 'admin', 'user', 'guest');
    } else if (userLevel >= HIERARCHY_LEVELS.admin) {
      assignableRoles.push('admin', 'user', 'guest');
    } else if (userLevel >= HIERARCHY_LEVELS.user) {
      assignableRoles.push('user', 'guest');
    } else {
      assignableRoles.push('guest');
    }

    return assignableRoles;
  }
};