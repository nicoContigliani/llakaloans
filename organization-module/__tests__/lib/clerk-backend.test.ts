import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clerkBackendService } from '../../lib/clerk-backend';

// Mock que define todas las funciones dentro de la factory
vi.mock('@clerk/backend', () => {
  const mockClerkClient = {
    users: {
      getUserList: vi.fn(),
      getUser: vi.fn()
    }
  };

  return {
    createClerkClient: vi.fn((options: any) => {
      // Puedes verificar las opciones si es necesario
      console.log('Clerk client created with options:', options);
      return mockClerkClient;
    })
  };
});

// Importar el mock después de definirlo
import { createClerkClient } from '@clerk/backend';

describe('ClerkBackendService', () => {
  let mockClerkClient: any;

  beforeEach(() => {
    // Obtener la instancia mock del cliente pasando opciones vacías
    mockClerkClient = createClerkClient({});
    vi.clearAllMocks();
  });

  describe('emailExists', () => {
    it('should return false for non-existent email', async () => {
      // Mock para email que no existe - array vacío
      mockClerkClient.users.getUserList.mockResolvedValue({
        data: []
      });

      const exists = await clerkBackendService.emailExists('nonexistent@example.com');
      expect(exists).toBe(false);
      expect(mockClerkClient.users.getUserList).toHaveBeenCalledWith({
        emailAddress: ['nonexistent@example.com'],
        limit: 1
      });
    });

    it('should return true for existing email', async () => {
      // Mock para email que existe
      mockClerkClient.users.getUserList.mockResolvedValue({
        data: [{
          id: 'test-user',
          emailAddresses: [{ emailAddress: 'existing@example.com' }]
        }]
      });

      const exists = await clerkBackendService.emailExists('existing@example.com');
      expect(exists).toBe(true);
    });
  });

  describe('getUserInfo', () => {
    it('should return user info for existing user', async () => {
      const mockUser = {
        id: 'test-user',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        firstName: 'Test',
        lastName: 'User'
      };

      mockClerkClient.users.getUser.mockResolvedValue(mockUser);

      const userInfo = await clerkBackendService.getUserInfo('test-user');
      expect(userInfo).toEqual(mockUser);
      expect(mockClerkClient.users.getUser).toHaveBeenCalledWith('test-user');
    });

    it('should handle user not found', async () => {
      // Mock para cuando el usuario no existe
      mockClerkClient.users.getUser.mockRejectedValue(new Error('User not found'));

      await expect(clerkBackendService.getUserInfo('non-existent-user')).rejects.toThrow('User not found');
    });
  });
});