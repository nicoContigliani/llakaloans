// organization-module/types/organization.ts
import { ObjectId } from 'mongodb';

// Tipo utilidad para IDs
export type EntityId = string;

// Nombres de roles - asegurar que sean const para el tipo
export const ROLE_NAMES = {
  TOOR: 'toor',
  OWNER: 'owner',
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const;

export type RoleName = typeof ROLE_NAMES[keyof typeof ROLE_NAMES];

// Función helper para verificar si un string es RoleName
export function isRoleName(role: string): role is RoleName {
  return Object.values(ROLE_NAMES).includes(role as RoleName);
}

// Función para convertir string[] a RoleName[]
export function toRoleNames(roles: string[]): RoleName[] {
  return roles.filter(isRoleName);
}

export interface Company {
  _id: EntityId;
  name: string;
  slug: string;
  contact_email: string;
  status: 'active' | 'inactive';
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  _id: EntityId;
  name: RoleName;
  description: string;
  permissions: string[];
  hierarchy_level: number;
}

export interface Employee {
  _id: EntityId;
  user_id: string;
  company_id: EntityId;
  role_ids: EntityId[];
  status: 'active' | 'invited' | 'suspended';
  created_at: Date;
}

export interface UserWithRoles {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  companies: {
    company_id: string;
    company_name: string;
    roles: RoleName[];
    status: string;
  }[];
}

// Filtros para queries
export interface CompanyFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  user_id?: string;
}

export interface UserFilters {
  company_id: string;
  search?: string;
  role?: any;
  status?: string;
  page?: number;
  limit?: number;
}

// Utility types para creación y actualización
export type CompanyCreateInput = Omit<Company, '_id' | 'created_at' | 'updated_at'>;
export type CompanyUpdateInput = Partial<Omit<Company, '_id' | 'created_at' | 'updated_at'>>;

// Servicio de permisos
export interface PermissionService {
  canViewAllCompanies(userRoles: RoleName[]): boolean;
  canManageCompany(userRoles: RoleName[], userCompanyId: string, targetCompanyId: string): boolean;
  canManageUsers(userRoles: RoleName[]): boolean;
  canModifyRoles(userRoles: RoleName[], targetUserRoles: RoleName[]): boolean;
  canAssignRole(userRoles: RoleName[], targetRole: RoleName): boolean; // <-- AÑADIDO
  getMaxHierarchyLevel(roles: RoleName[]): number;
  hasPermission(userRoles: RoleName[], permission: string): boolean;
  getAssignableRoles(userRoles: RoleName[]): RoleName[];
}

// Tipos para respuesta de agregar usuario
export interface AddUserResponse {
  success: boolean;
  employee_id?: string;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Niveles de jerarquía para referencia
export const HIERARCHY_LEVELS: Record<RoleName, number> = {
  'toor': 1000,
  'owner': 100,
  'admin': 80,
  'user': 50,
  'guest': 10
};

// Tipos para invitaciones
export interface InvitationData {
  email: string;
  company_id: string;
  company_name: string;
  role_name: string;
  invited_by: string;
  expires_at: Date;
}

export interface Invitation extends InvitationData {
  _id: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  created_at: Date;
  accepted_at?: Date;
  email_sent?: boolean;
  email_sent_at?: Date;
  email_attempts?: number;
  last_email_attempt?: Date;
  last_email_error?: string;
  email_message_id?: string;
}

// Interface para el resultado de aceptar invitación
export interface AcceptInvitationResult {
  success: boolean;
  message: string;
  company_id?: string;
  company_name?: string;
}


export interface PaginatedResponse<T> {
  data?: T[];
  total?: number;
  page?: number; // Opcional si existe
  limit?: number; // Opcional si existe
  totalPages?: number; // Opcional si existe
}