import { describe, it, expect, vi } from 'vitest';
import { userService } from '../../services/userService';
import { clerkBackendService } from '../../lib/clerk-backend';

vi.mock('../../lib/clerk-backend', () => ({
  clerkBackendService: {
    findUserByEmail: vi.fn(() => Promise.resolve(null)),
    getUserById: vi.fn(),
    getUserInfo: vi.fn(),
    createInvitation: vi.fn(),
    emailExists: vi.fn()
  }
}));

describe('UserService', () => {
  describe('addUserToCompanyByEmail', () => {
    it('should handle user not found in Clerk', async () => {
      const result = await userService.addUserToCompanyByEmail(
        'nonexistent@example.com',
        'company123',
        ['role1'],
        ['admin']
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain('no encontrado');
    });
  });

  describe('getCompanyUsers', () => {
    it('should handle empty company_id', async () => {
      const result = await userService.getCompanyUsers(
        { company_id: '' } as any,
        ['admin']
      );

      expect(result.users).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});