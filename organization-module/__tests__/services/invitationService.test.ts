import { describe, it, expect, vi, beforeEach } from 'vitest';
import { invitationService } from '../../services/invitationService';
import clientPromise from '../../../lib/mongodb';

describe('InvitationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate unique tokens', () => {
      const token1 = invitationService.generateToken();
      const token2 = invitationService.generateToken();
      
      expect(typeof token1).toBe('string');
      expect(token1.length).toBeGreaterThan(10);
      expect(token1).not.toBe(token2);
    });
  });

  describe('acceptInvitation', () => {
    it('should fail for invalid token', async () => {
      const result = await invitationService.acceptInvitation('invalid-token', 'user123');
      expect(result.success).toBe(false);
    });
  });

  describe('createInvitation', () => {
    it('should create invitation successfully', async () => {
      const mockCollection = {
        insertOne: vi.fn(() => Promise.resolve({ insertedId: 'invite123' }))
      };

      const mockDb = {
        collection: vi.fn(() => mockCollection)
      };

      vi.mocked(clientPromise).then((client: any) => {
        client.db = vi.fn(() => mockDb);
      });

      const invitation = await invitationService.createInvitation({
        email: 'test@example.com',
        company_id: 'company123',
        company_name: 'Test Company',
        role_name: 'user',
        invited_by: 'user123'
      });

      expect(invitation).toHaveProperty('_id');
      expect(invitation).toHaveProperty('token');
      expect(invitation).toHaveProperty('expires_at');
    });
  });
});