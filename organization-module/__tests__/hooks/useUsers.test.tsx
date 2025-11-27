import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUsers } from '../../hooks/useUsers';

vi.mock('../../store/organizationStore', () => ({
  useOrganizationStore: vi.fn(() => ({
    users: [],
    loading: false,
    error: null,
    setUsers: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
    addUser: vi.fn(),
    updateUserStatus: vi.fn(),
    removeUser: vi.fn(),
    clearError: vi.fn()
  }))
}));

vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(() => ({
    user: { id: 'test-user' }
  }))
}));

describe('useUsers', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUsers('company123'));
    
    expect(result.current.users).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.fetchUsers).toBe('function');
    expect(typeof result.current.addUser).toBe('function');
  });
});