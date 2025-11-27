import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CompanyManager } from '../../components/CompanyManager';

// Mocks simples
vi.mock('../../hooks/useCompanies', () => ({
  useCompanies: vi.fn(() => ({
    companies: [],
    loading: false,
    error: null,
    fetchCompanies: vi.fn(),
    createCompany: vi.fn(),
    updateCompany: vi.fn(),
    deleteCompany: vi.fn(),
    clearError: vi.fn()
  }))
}));

vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(() => ({
    user: { id: 'test-user' }
  }))
}));

describe('CompanyManager', () => {
  it('should render with title', () => {
    render(<CompanyManager />);
    
    expect(screen.getByText('Gestión de Empresas')).toBeInTheDocument();
    expect(screen.getByText('Administra las empresas de tu organización')).toBeInTheDocument();
  });

  it('should show create button', () => {
    render(<CompanyManager />);
    
    // Buscar por texto parcial ya que el texto exacto puede variar
    expect(screen.getByText(/Crear Empresa/)).toBeInTheDocument();
  });

  it('should show empty state when no companies', () => {
    render(<CompanyManager />);
    
    expect(screen.getByText('No hay empresas')).toBeInTheDocument();
    expect(screen.getByText('Crea tu primera empresa para comenzar')).toBeInTheDocument();
  });
});