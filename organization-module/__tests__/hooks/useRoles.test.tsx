import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRoles } from '../../hooks/useRoles';

vi.mock('../../store/organizationStore', () => ({
  useOrganizationStore: vi.fn(() => ({
    roles: [],
    setRoles: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn()
  }))
}));

describe('useRoles', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useRoles());
    
    expect(result.current.roles).toEqual([]);
    expect(typeof result.current.fetchRoles).toBe('function');
  });
});