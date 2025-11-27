import { describe, it, expect } from 'vitest';
import { isRoleName, toRoleNames, ROLE_NAMES } from '../../types/organization';

describe('Organization Utils', () => {
  describe('isRoleName', () => {
    it('should validate correct role names', () => {
      expect(isRoleName('admin')).toBe(true);
      expect(isRoleName('user')).toBe(true);
      expect(isRoleName('toor')).toBe(true);
      expect(isRoleName('owner')).toBe(true);
      expect(isRoleName('guest')).toBe(true);
    });

    it('should reject invalid role names', () => {
      expect(isRoleName('invalid')).toBe(false);
      expect(isRoleName('')).toBe(false);
      expect(isRoleName('superadmin')).toBe(false);
      expect(isRoleName('Admin')).toBe(false); // case sensitive
    });
  });

  describe('toRoleNames', () => {
    it('should filter valid role names', () => {
      const roles = ['admin', 'user', 'invalid', 'guest', 'another-invalid'];
      const result = toRoleNames(roles);
      
      expect(result).toEqual(['admin', 'user', 'guest']);
    });

    it('should return empty array for no valid roles', () => {
      const roles = ['invalid1', 'invalid2'];
      const result = toRoleNames(roles);
      
      expect(result).toEqual([]);
    });

    it('should handle empty array', () => {
      const result = toRoleNames([]);
      expect(result).toEqual([]);
    });
  });

  describe('ROLE_NAMES', () => {
    it('should contain all valid role names', () => {
      expect(ROLE_NAMES.TOOR).toBe('toor');
      expect(ROLE_NAMES.OWNER).toBe('owner');
      expect(ROLE_NAMES.ADMIN).toBe('admin');
      expect(ROLE_NAMES.USER).toBe('user');
      expect(ROLE_NAMES.GUEST).toBe('guest');
    });
  });
});