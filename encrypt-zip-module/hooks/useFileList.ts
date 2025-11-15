// hooks/useFileList.ts
import { useState, useEffect, useCallback } from 'react';
import type { FileMetadata, FileFilter, PaginationOptions, FilesResponse } from '../types/encrypt-zip';

interface UseFileListOptions {
  userId?: string;
  autoLoad?: boolean;
  initialFilters?: FileFilter;
  initialPagination?: PaginationOptions;
}

export function useFileList({
  userId,
  autoLoad = true,
  initialFilters = {},
  initialPagination = { page: 1, limit: 10 }
}: UseFileListOptions = {}) {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FileFilter>(initialFilters);
  const [pagination, setPagination] = useState<PaginationOptions>(initialPagination);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadFiles = useCallback(async (
    newFilters?: FileFilter,
    newPagination?: PaginationOptions
  ) => {
    setLoading(true);
    setError(null);
    
    const currentFilters = newFilters || filters;
    const currentPagination = newPagination || pagination;
    
    try {
      const params = new URLSearchParams();
      
      // Agregar parámetros de filtro
      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.fileType && currentFilters.fileType !== 'all') {
        params.append('fileType', currentFilters.fileType);
      }
      if (currentFilters.sortBy) params.append('sortBy', currentFilters.sortBy);
      if (currentFilters.sortOrder) params.append('sortOrder', currentFilters.sortOrder);
      
      if (currentFilters.dateRange) {
        params.append('startDate', currentFilters.dateRange.start.toISOString());
        params.append('endDate', currentFilters.dateRange.end.toISOString());
      }
      
      if (currentFilters.minSize !== undefined) {
        params.append('minSize', currentFilters.minSize.toString());
      }
      
      if (currentFilters.maxSize !== undefined) {
        params.append('maxSize', currentFilters.maxSize.toString());
      }
      
      // Agregar parámetros de paginación
      params.append('page', currentPagination.page.toString());
      params.append('limit', currentPagination.limit.toString());
      
      if (userId) params.append('userId', userId);
      
      const response = await fetch(`/api/files?${params}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch files' }));
        throw new Error(errorData.error);
      }
      
      const data: FilesResponse = await response.json();
      setFiles(data.data);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
      
      // Actualizar estado local si se pasaron nuevos filtros/paginación
      if (newFilters) setFilters(newFilters);
      if (newPagination) setPagination(newPagination);
      
    } catch (error) {
      console.error('Error loading files:', error);
      setError(error instanceof Error ? error.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [userId, filters, pagination]);

  const updateFilters = useCallback((newFilters: FileFilter) => {
    loadFiles(newFilters, { ...pagination, page: 1 }); // Reset to page 1 when filters change
  }, [loadFiles, pagination]);

  const updatePagination = useCallback((newPagination: PaginationOptions) => {
    loadFiles(filters, newPagination);
  }, [loadFiles, filters]);

  const goToPage = useCallback((page: number) => {
    updatePagination({ ...pagination, page });
  }, [updatePagination, pagination]);

  const setPageSize = useCallback((limit: number) => {
    updatePagination({ ...pagination, page: 1, limit });
  }, [updatePagination, pagination]);

  const deleteFile = async (fileId: string) => {
    try {
      // Primero obtener la metadata para saber la ruta en Supabase
      const metadataResponse = await fetch(`/api/files/${fileId}`);
      if (!metadataResponse.ok) {
        throw new Error('Failed to fetch file metadata for deletion');
      }
      
      const metadata = await metadataResponse.json();
      if (!metadata) {
        throw new Error('File metadata not found');
      }

      // Llamar a la API para eliminar
      const deleteResponse = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encryptedPath: metadata.encryptedPath
        })
      });
      
      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json().catch(() => ({ error: 'Failed to delete file' }));
        throw new Error(errorData.error);
      }

      // Recargar la lista manteniendo los filtros actuales
      await loadFiles();
      
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadFiles();
    }
  }, [autoLoad, loadFiles]);

  return {
    files,
    loading,
    error,
    filters,
    pagination,
    total,
    totalPages,
    loadFiles,
    updateFilters,
    updatePagination,
    goToPage,
    setPageSize,
    deleteFile,
    hasNextPage: pagination.page < totalPages,
    hasPrevPage: pagination.page > 1
  };
}