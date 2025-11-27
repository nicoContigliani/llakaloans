import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import UserManager from '../../components/UserManager';

// Mock de fetch global para evitar llamadas a API
global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ users: [], total: 0 })
  } as Response)
);

// Mocks simples
vi.mock('../../hooks/useUsers', () => ({
  useUsers: vi.fn(() => ({
    users: [],
    loading: false,
    error: null,
    fetchUsers: vi.fn(),
    addUser: vi.fn(),
    updateUserRoles: vi.fn(),
    updateUserStatus: vi.fn(),
    removeUserFromCompany: vi.fn(),
    getUserCompanies: vi.fn(),
    clearError: vi.fn()
  }))
}));

vi.mock('../../hooks/useRoles', () => ({
  useRoles: vi.fn(() => ({
    roles: [
      { _id: '1', name: 'admin', description: 'Administrator' },
      { _id: '2', name: 'user', description: 'User' }
    ],
    fetchRoles: vi.fn()
  }))
}));

vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(() => ({
    user: { id: 'current-user' }
  }))
}));

describe('UserManager', () => {
  it('should render with company name', async () => {
    render(<UserManager companyId="company123" companyName="Test Company" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Gestión de Usuarios/i)).toBeInTheDocument();
    });
  });

  it('should show search input', async () => {
    render(<UserManager companyId="company123" companyName="Test Company" />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Buscar usuarios/i)).toBeInTheDocument();
    });
  });
});