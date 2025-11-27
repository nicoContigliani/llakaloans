// organization-module/hooks/useRoles.ts
"use client";

import { useCallback } from 'react';
import { Role } from '../types/organization';
import { useOrganizationStore } from '../store/organizationStore';

export const useRoles = () => {
  const { roles, setRoles, setLoading, setError } = useOrganizationStore();

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/organization/roles');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching roles');
      }
      
      const data = await response.json();
      setRoles(data.roles || []);
      return data.roles as Role[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading roles');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setRoles, setLoading, setError]);

  return {
    roles,
    fetchRoles
  };
};