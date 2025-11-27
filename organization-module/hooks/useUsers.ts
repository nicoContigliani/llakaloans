"use client";

import { useCallback } from 'react';
import { UserWithRoles, UserFilters } from '../types/organization';
import { useUser } from '@clerk/nextjs';
import { useOrganizationStore } from '../store/organizationStore';

export const useUsers = (companyId?: string, companyName?: string) => {
  const { 
    users, 
    loading, 
    error, 
    setUsers, 
    setLoading, 
    setError, 
    addUser, 
    updateUserStatus: updateUserStatusInStore, 
    removeUser, 
    clearError 
  } = useOrganizationStore();

  const { user: currentUser } = useUser();

  const fetchUsers = useCallback(async (filters: Omit<UserFilters, 'company_id'> = {}) => {
    if (!companyId) {
      setUsers([]);
      return { users: [], total: 0 };
    }

    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        company_id: companyId,
        search: filters.search || '',
        role: filters.role || '',
        status: filters.status || '',
        page: filters.page?.toString() || '1',
        limit: filters.limit?.toString() || '10',
        user_id: currentUser?.id || ''
      });

      const result = await fetch('/api/organization/users?' + queryParams);
      
      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.error || 'Error fetching users');
      }
      
      const data = await result.json();
      setUsers(data.users);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading users');
      return { users: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [companyId, currentUser, setUsers, setLoading, setError]);

  const addUserToStore = useCallback(async (userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📧 Enviando datos para agregar usuario:', { 
        ...userData, 
        company_id: companyId,
        company_name: companyName // ← Asegurar que companyName esté disponible
      });
      
      // Validar que companyName esté presente
      if (!companyName) {
        throw new Error('Nombre de la empresa no disponible');
      }

      const response = await fetch('/api/organization/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          company_id: companyId,
          company_name: companyName, // ← Enviar companyName explícitamente
          role_name: userData.role_name || 'user',
          invited_by: currentUser?.id
        })
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error response:', errorData);
        throw new Error(errorData.error || `Error ${response.status} enviando invitación`);
      }
      
      const result = await response.json();
      console.log('✅ Invitación enviada exitosamente:', result);
      
      // Recargar la lista de usuarios para mostrar el nuevo usuario invitado
      await fetchUsers();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error enviando invitación';
      console.error('❌ Error in addUser hook:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [companyId, companyName, currentUser, fetchUsers, setLoading, setError]);

  const updateUserRoles = useCallback(async (userId: string, roleIds: string[], currentRoles: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/organization/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          role_ids: roleIds,
          current_roles: currentRoles,
          current_user_id: currentUser?.id
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating user roles');
      }
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating user roles');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [companyId, currentUser, setLoading, setError]);

  const updateUserStatus = useCallback(async (userId: string, status: 'active' | 'suspended', currentRoles: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/organization/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          status: status,
          current_roles: currentRoles,
          current_user_id: currentUser?.id
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating user status');
      }
      
      const result = await response.json();
      
      // Actualizar el store si fue exitoso
      if (result.success && companyId) {
        updateUserStatusInStore(userId, companyId, status);
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating user status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [companyId, currentUser, setLoading, setError, updateUserStatusInStore]);

  const removeUserFromCompanyStore = useCallback(async (userId: string, currentRoles: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        company_id: companyId || '',
        current_user_id: currentUser?.id || ''
      });

      const response = await fetch(`/api/organization/users/${userId}?${queryParams}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error removing user');
      }
      
      const result = await response.json();
      
      if (result.success && companyId) {
        removeUser(userId, companyId);
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [companyId, currentUser, setLoading, setError, removeUser]);

  const getUserCompanies = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/organization/employees?user_id=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching user companies');
      }
      
      const data = await response.json();
      return data.companies || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching user companies');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const companyUsers = users.filter(user => 
    user.companies.some(comp => comp.company_id === companyId)
  );

  return {
    users: companyUsers,
    loading,
    error,
    fetchUsers,
    addUser: addUserToStore,
    updateUserRoles,
    updateUserStatus,
    removeUserFromCompany: removeUserFromCompanyStore,
    getUserCompanies,
    clearError
  };
};