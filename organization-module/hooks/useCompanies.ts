// organization-module/hooks/useCompanies.ts
"use client";

import { useCallback } from 'react';
import { Company, CompanyFilters, CompanyUpdateInput } from '../types/organization';
import { useUser } from '@clerk/nextjs';
import { useOrganizationStore } from '../store/organizationStore';

export const useCompanies = () => {
  const { user } = useUser();
  const { 
    companies, 
    loading, 
    error, 
    setCompanies, 
    setLoading, 
    setError, 
    addCompany, 
    updateCompany, 
    removeCompany,
    clearError 
  } = useOrganizationStore();

  const fetchCompanies = useCallback(async (filters: CompanyFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        search: filters.search || '',
        status: filters.status || '',
        page: filters.page?.toString() || '1',
        limit: filters.limit?.toString() || '10',
        user_id: user?.id || ''
      });

      console.log('🔍 Fetching companies with params:', Object.fromEntries(queryParams));

      const result = await fetch(`/api/organization/companies?${queryParams}`);
      
      if (!result.ok) {
        let errorData;
        try {
          errorData = await result.json();
        } catch {
          errorData = { error: `Error ${result.status}: ${result.statusText}` };
        }
        throw new Error(errorData.error || `Error ${result.status} fetching companies`);
      }
      
      const data = await result.json();
      console.log('✅ Companies fetched:', data.companies?.length || 0);
      setCompanies(data.companies || []);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading companies';
      console.error('❌ Error fetching companies:', errorMessage);
      setError(errorMessage);
      return { companies: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [user, setCompanies, setLoading, setError]);

  const createCompany = useCallback(async (companyData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🏢 Creating company:', companyData);
      const response = await fetch('/api/organization/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `Error ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || `Error ${response.status} creating company`);
      }
      
      const newCompany = await response.json();
      console.log('✅ Company created:', newCompany);
      addCompany(newCompany);
      return newCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating company';
      console.error('❌ Error creating company:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, addCompany]);

  const updateCompanyStore = useCallback(async (companyId: string, updateData: CompanyUpdateInput) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Updating company:', companyId, updateData);
      const response = await fetch(`/api/organization/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `Error ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || `Error ${response.status} updating company`);
      }
      
      const updatedCompany = await response.json();
      console.log('✅ Company updated:', updatedCompany);
      updateCompany(companyId, updatedCompany);
      return updatedCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating company';
      console.error('❌ Error updating company:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, updateCompany]);

  const deleteCompanyStore = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🗑️ [Hook] Deleting company:', companyId);
      
      if (!companyId || companyId === 'undefined' || companyId === 'null') {
        throw new Error('ID de empresa inválido');
      }

      const response = await fetch(`/api/organization/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📡 [Hook] Delete response status:', response.status);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error('❌ [Hook] Error parsing JSON response:', jsonError);
          errorData = { 
            error: `Error ${response.status}: No se pudo procesar la respuesta del servidor` 
          };
        }
        
        console.error('❌ [Hook] Delete API error:', errorData);
        throw new Error(errorData.error || errorData.message || `Error ${response.status} deleting company`);
      }
      
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('❌ [Hook] Error parsing success JSON:', jsonError);
        result = { success: true };
      }
      
      console.log('✅ [Hook] Delete API success:', result);
      removeCompany(companyId);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting company';
      console.error('❌ [Hook] Error in deleteCompany:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, removeCompany]);

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    createCompany,
    updateCompany: updateCompanyStore,
    deleteCompany: deleteCompanyStore,
    clearError
  };
};