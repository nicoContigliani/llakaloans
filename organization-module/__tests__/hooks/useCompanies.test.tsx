import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCompanies } from '../../hooks/useCompanies';

// Mock simple
vi.mock('../../store/organizationStore', () => ({
  useOrganizationStore: vi.fn(() => ({
    companies: [],
    loading: false,
    error: null,
    setCompanies: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
    addCompany: vi.fn(),
    updateCompany: vi.fn(),
    removeCompany: vi.fn(),
    clearError: vi.fn()
  }))
}));

vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(() => ({
    user: { id: 'test-user' }
  }))
}));

describe('useCompanies', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCompanies());
    
    expect(result.current.companies).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.fetchCompanies).toBe('function');
    expect(typeof result.current.createCompany).toBe('function');
    expect(typeof result.current.deleteCompany).toBe('function');
  });
});