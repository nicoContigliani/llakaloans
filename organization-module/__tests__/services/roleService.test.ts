import { describe, it, expect, vi, beforeEach } from 'vitest';
import { roleService } from '../../services/roleService';
import { RoleName } from '../../types/organization';

// Mock completo dentro de la factory function
vi.mock('../../../lib/mongodb', () => {
  const mockCollection = {
    find: vi.fn(),
    findOne: vi.fn(),
    aggregate: vi.fn()
  };

  const mockDb = {
    collection: vi.fn(() => mockCollection)
  };

  const mockClient = {
    db: vi.fn(() => mockDb)
  };

  return {
    default: Promise.resolve(mockClient)
  };
});

// Importar después del mock
import clientPromise from '../../../lib/mongodb';

const mockRoles = [
  {
    _id: 'role1',
    name: 'admin' as RoleName,
    description: 'Administrator',
    permissions: ['user:manage'],
    hierarchy_level: 80
  },
  {
    _id: 'role2',
    name: 'user' as RoleName, 
    description: 'Regular User',
    permissions: ['dashboard:view'],
    hierarchy_level: 50
  }
];

describe('RoleService', () => {
  let mockCollection: any;
  let mockDb: any;
  let mockClient: any;

  beforeEach(async () => {
    // Obtener las instancias mock
    mockClient = await clientPromise;
    mockDb = mockClient.db();
    mockCollection = mockDb.collection('roles');
    
    vi.clearAllMocks();
    
    // Configurar comportamiento por defecto
    mockDb.collection.mockReturnValue(mockCollection);
  });

  describe('getRoles', () => {
    it('should return array of roles', async () => {
      const mockCursor = {
        toArray: vi.fn(() => Promise.resolve(mockRoles)),
        sort: vi.fn(() => mockCursor)
      };

      mockCollection.find.mockReturnValue(mockCursor);

      const roles = await roleService.getRoles();
      expect(Array.isArray(roles)).toBe(true);
      expect(roles).toHaveLength(2);
      expect(roles[0].name).toBe('admin');
      expect(roles[1].name).toBe('user');
    });
  });

  describe('getRoleByName', () => {
    it('should return role by name', async () => {
      mockCollection.findOne.mockResolvedValue(mockRoles[0]);

      const role = await roleService.getRoleByName('admin');
      expect(role).toBeDefined();
      expect(role?.name).toBe('admin');
      expect(mockCollection.findOne).toHaveBeenCalledWith({ name: 'admin' });
    });

    it('should return null for non-existent role', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const role = await roleService.getRoleByName('nonexistent' as RoleName);
      expect(role).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ name: 'nonexistent' });
    });
  });

  describe('getRolesByIds', () => {
    it('should handle empty array', async () => {
      const roles = await roleService.getRolesByIds([]);
      expect(roles).toEqual([]);
    });

    it('should return roles for valid IDs', async () => {
      // Mock específico para la consulta con $in
      const mockCursor = {
        toArray: vi.fn(() => Promise.resolve([mockRoles[0]]))
      };

      // Configurar el mock para que cuando se llame con { _id: { $in: ['role1'] } } devuelva el cursor mock
      mockCollection.find.mockImplementation((query: any) => {
        // Verificar que la consulta sea la correcta
        expect(query._id).toBeDefined();
        expect(query._id.$in).toEqual(['role1']);
        return mockCursor;
      });

      const roles = await roleService.getRolesByIds(['role1']);
      expect(roles).toHaveLength(1);
      expect(roles[0].name).toBe('admin');
      expect(mockCollection.find).toHaveBeenCalledWith({ _id: { $in: ['role1'] } });
    });

    it('should return multiple roles for multiple IDs', async () => {
      const mockCursor = {
        toArray: vi.fn(() => Promise.resolve(mockRoles))
      };

      mockCollection.find.mockImplementation((query: any) => {
        expect(query._id.$in).toEqual(['role1', 'role2']);
        return mockCursor;
      });

      const roles = await roleService.getRolesByIds(['role1', 'role2']);
      expect(roles).toHaveLength(2);
      expect(roles[0].name).toBe('admin');
      expect(roles[1].name).toBe('user');
    });

    it('should handle non-existent IDs by returning empty array', async () => {
      const mockCursor = {
        toArray: vi.fn(() => Promise.resolve([]))
      };

      mockCollection.find.mockReturnValue(mockCursor);

      const roles = await roleService.getRolesByIds(['nonexistent-id']);
      expect(roles).toEqual([]);
      expect(mockCollection.find).toHaveBeenCalledWith({ _id: { $in: ['nonexistent-id'] } });
    });
  });
});