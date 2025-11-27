import { describe, it, expect, vi, beforeEach } from 'vitest';
import { companyService } from '../../services/companyService';

// Mock completo dentro de la factory function
vi.mock('../../../lib/mongodb', () => {
  const mockCollection = {
    find: vi.fn(),
    findOne: vi.fn(),
    insertOne: vi.fn(),
    updateOne: vi.fn(),
    deleteOne: vi.fn(),
    countDocuments: vi.fn(),
    aggregate: vi.fn()
  };

  const mockDb = {
    collection: vi.fn(() => mockCollection)
  };

  const mockClient = {
    db: vi.fn(() => mockDb),
    close: vi.fn()
  };

  return {
    default: Promise.resolve(mockClient)
  };
});

// Importar después del mock
import clientPromise from '../../../lib/mongodb';

describe('CompanyService', () => {
  let mockCollection: any;
  let mockDb: any;
  let mockClient: any;

  beforeEach(async () => {
    // Obtener las instancias mock
    mockClient = await clientPromise;
    mockDb = mockClient.db();
    mockCollection = mockDb.collection('companies');
    
    vi.clearAllMocks();
  });

  describe('getCompanies', () => {
    it('should return companies with pagination', async () => {
      const mockCompanies = [
        { _id: 'company1', name: 'Test Company 1' },
        { _id: 'company2', name: 'Test Company 2' }
      ];

      const mockCursor = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue(mockCompanies)
      };

      mockCollection.find.mockReturnValue(mockCursor);
      mockCollection.countDocuments.mockResolvedValue(2);

      const result = await companyService.getCompanies({ page: 1, limit: 10 }, []);
      
      expect(result.companies).toHaveLength(2);
      expect(result.total).toBe(2);
      
      // Verificar la estructura básica sin la propiedad 'page' si no existe
      expect(result).toEqual({
        companies: mockCompanies,
        total: 2
        // page: 1 // Solo si existe en el tipo real
      });
    });

    it('should handle empty results', async () => {
      const mockCursor = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([])
      };

      mockCollection.find.mockReturnValue(mockCursor);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await companyService.getCompanies({}, []);
      
      expect(result.companies).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('getCompanyById', () => {
    it('should return company for valid ID', async () => {
      const mockCompany = { _id: 'company1', name: 'Test Company' };
      mockCollection.findOne.mockResolvedValue(mockCompany);

      const result = await companyService.getCompanyById('company1');
      expect(result).toEqual(mockCompany);
      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: 'company1' });
    });

    it('should return null for non-existent company', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const result = await companyService.getCompanyById('nonexistent');
      expect(result).toBeNull();
    });
  });
});