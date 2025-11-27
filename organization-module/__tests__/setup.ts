import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock global de fetch
global.fetch = vi.fn();

// Mock COMPLETO de MongoDB con toda la cadena de métodos
const createMockCursor = (data: any[] = []) => {
  return {
    toArray: vi.fn(() => Promise.resolve(data)),
    sort: vi.fn(function (this: any, sortObj: any) {
      return this; // Retorna this para permitir chaining
    }),
    skip: vi.fn(function (this: any, skip: number) {
      return this; // Retorna this para permitir chaining
    }),
    limit: vi.fn(function (this: any, limit: number) {
      return this; // Retorna this para permitir chaining
    }),
    project: vi.fn(function (this: any, projectObj: any) {
      return this; // Retorna this para permitir chaining
    }),
    unwind: vi.fn(function (this: any, field: string) {
      return this; // Retorna this para permitir chaining
    }),
    group: vi.fn(function (this: any, groupObj: any) {
      return this; // Retorna this para permitir chaining
    })
  };
};

const createMockAggregationCursor = (data: any[] = []) => {
  return {
    toArray: vi.fn(() => Promise.resolve(data))
  };
};

const mockCollection = {
  find: vi.fn(() => ({
    toArray: vi.fn(() => Promise.resolve([])),
    sort: vi.fn(function (this: any) { return this; }),
    skip: vi.fn(function (this: any) { return this; }),
    limit: vi.fn(function (this: any) { return this; })
  })),
  findOne: vi.fn(() => Promise.resolve(null)),
  insertOne: vi.fn(() => Promise.resolve({ insertedId: 'test-id' })),
  updateOne: vi.fn(() => Promise.resolve({ modifiedCount: 1 })),
  updateMany: vi.fn(() => Promise.resolve({ modifiedCount: 0, acknowledged: true })),
  deleteOne: vi.fn(() => Promise.resolve({ deletedCount: 1, acknowledged: true })),
  deleteMany: vi.fn(() => Promise.resolve({ deletedCount: 0, acknowledged: true })),
  countDocuments: vi.fn(() => Promise.resolve(0)),
  aggregate: vi.fn(() => createMockAggregationCursor()),
  createIndex: vi.fn(() => Promise.resolve('index_created')),
  listCollections: vi.fn(() => ({
    hasNext: vi.fn(() => false)
  })),
  createCollection: vi.fn(() => Promise.resolve())
};

const mockDb = {
  collection: vi.fn(() => mockCollection)
};

const mockClient = {
  db: vi.fn(() => mockDb),
  close: vi.fn()
};

// Mock completo de MongoDB client
vi.mock('../../lib/mongodb', () => {
  return {
    default: Promise.resolve(mockClient)
  };
});

// Mock de Clerk
vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(() => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com'
    }
  }))
}));

// Mock de Clerk Backend
vi.mock('@clerk/backend', () => ({
  createClerkClient: vi.fn(() => ({
    users: {
      getUserList: vi.fn(() => Promise.resolve({
        data: [{
          id: 'test-user',
          emailAddresses: [{ emailAddress: 'test@example.com' }],
          firstName: 'Test',
          lastName: 'User'
        }]
      })),
      getUser: vi.fn(() => Promise.resolve({
        id: 'test-user',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        firstName: 'Test',
        lastName: 'User'
      }))
    },
    invitations: {
      createInvitation: vi.fn(() => Promise.resolve({ id: 'invite-123', status: 'pending' }))
    }
  }))
}));

// Mock de Nodemailer
vi.mock('nodemailer', () => ({
  createTransport: vi.fn(() => ({
    sendMail: vi.fn(() => Promise.resolve({ messageId: 'test-message-id' }))
  }))
}));

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn()
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn()
  })),
  usePathname: vi.fn(() => '/')
}));

// Mock del store de organización
vi.mock('../store/organizationStore', () => ({
  useOrganizationStore: vi.fn(() => ({
    companies: [],
    users: [],
    roles: [],
    loading: false,
    error: null,
    setCompanies: vi.fn(),
    setUsers: vi.fn(),
    setRoles: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
    addCompany: vi.fn(),
    updateCompany: vi.fn(),
    removeCompany: vi.fn(),
    addUser: vi.fn(),
    updateUserStatus: vi.fn(),
    removeUser: vi.fn(),
    clearError: vi.fn()
  }))
}));