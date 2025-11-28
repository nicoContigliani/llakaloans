'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { UserWithRoles } from '@/organization-module';

export const useUserRoles = () => {
  const { userRoles, isLoading, setUserRoles, setIsLoading } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  const fetchUserRoles = async (): Promise<UserWithRoles | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching user roles...');
      const response = await fetch('/api/user/roles');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: UserWithRoles = await response.json();
      console.log('User roles fetched:', data);
      
      setUserRoles(data);
      return data;
    } catch (error) {
      console.error('Error fetching user roles:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userRoles && !isLoading) {
      fetchUserRoles();
    }
  }, [userRoles, isLoading]);

  const refetch = () => {
    fetchUserRoles();
  };

  const getUserRolesText = () => {
    if (!userRoles || userRoles.companies.length === 0) {
      return "Usted no tiene roles asignados en ninguna empresa";
    }

    return userRoles.companies.map(company => 
      `En ${company.company_name}: ${company.roles.join(', ')}`
    ).join(' | ');
  };

  const getPrimaryRole = () => {
    if (!userRoles || userRoles.companies.length === 0) {
      return null;
    }

    // Tomar la primera empresa y el primer rol como principal
    const firstCompany = userRoles.companies[0];
    return {
      company: firstCompany.company_name,
      role: firstCompany.roles[0] || 'Sin rol específico'
    };
  };

  return {
    userRoles,
    isLoading,
    error,
    refetch,
    getUserRolesText,
    getPrimaryRole,
    hasRoles: userRoles ? userRoles.companies.length > 0 : false
  };
};