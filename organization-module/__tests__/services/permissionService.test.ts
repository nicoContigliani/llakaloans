import { describe, it, expect } from 'vitest';
import { permissionService } from '../../services/permissionService';

describe('PermissionService', () => {
  describe('Basic Permissions', () => {
    it('should calculate max hierarchy level correctly', () => {
      expect(permissionService.getMaxHierarchyLevel(['user', 'admin'])).toBe(80);
      expect(permissionService.getMaxHierarchyLevel(['user'])).toBe(50);
      expect(permissionService.getMaxHierarchyLevel([])).toBe(0);
    });

    it('should allow toor to view all companies', () => {
      expect(permissionService.canViewAllCompanies(['toor'])).toBe(true);
      expect(permissionService.canViewAllCompanies(['user'])).toBe(false);
    });

    it('should allow admin+ to manage users', () => {
      expect(permissionService.canManageUsers(['admin'])).toBe(true);
      expect(permissionService.canManageUsers(['owner'])).toBe(true);
      expect(permissionService.canManageUsers(['user'])).toBe(false);
    });
  });

  describe('Role Assignment', () => {
    it('should determine assignable roles correctly', () => {
      expect(permissionService.canAssignRole(['admin'], 'user')).toBe(true);
      expect(permissionService.canAssignRole(['user'], 'admin')).toBe(false);
      expect(permissionService.canAssignRole(['toor'], 'owner')).toBe(true);
    });

    it('should return correct assignable roles list', () => {
      expect(permissionService.getAssignableRoles(['admin']))
        .toEqual(['admin', 'user', 'guest']);
      
      expect(permissionService.getAssignableRoles(['toor']))
        .toEqual(['toor', 'owner', 'admin', 'user', 'guest']);
      
      expect(permissionService.getAssignableRoles(['user']))
        .toEqual(['user', 'guest']);
    });
  });

  describe('Permission Checks', () => {
    it('should check specific permissions', () => {
      expect(permissionService.hasPermission(['admin'], 'user:manage')).toBe(true);
      expect(permissionService.hasPermission(['user'], 'user:manage')).toBe(false);
      expect(permissionService.hasPermission(['toor'], 'company:delete')).toBe(true);
    });

    it('should allow toor all permissions', () => {
      expect(permissionService.hasPermission(['toor'], 'any:permission')).toBe(true);
    });
  });
});