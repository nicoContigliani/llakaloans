// organization-module/index.ts
export { companyService } from './services/companyService';
export { userService } from './services/userService';
export { roleService } from './services/roleService';
export { permissionService } from './services/permissionService';
export { invitationService } from './services/invitationService';

export { useCompanies } from './hooks/useCompanies';
export { useUsers } from './hooks/useUsers';
export { useRoles } from './hooks/useRoles';
export { useOrganizationStore } from './store/organizationStore';

// Exportar componentes - UserManager es exportación por defecto
export { CompanyManager } from './components/CompanyManager';
export { default as UserManager } from './components/UserManager';

// Exportar tipos y funciones helper
export type { 
  Company, 
  Role, 
  Employee, 
  UserWithRoles,
  CompanyCreateInput,
  CompanyUpdateInput,
  RoleName,
  Invitation,
  InvitationData,
  AcceptInvitationResult,
  AddUserResponse,
  CompanyFilters,
  UserFilters,
  PermissionService
} from './types/organization';

// Exportar funciones helper
export { toRoleNames, isRoleName, ROLE_NAMES, HIERARCHY_LEVELS } from './types/organization';

// Exportar servicios de Clerk
export { clerkBackendService } from './lib/clerk-backend';