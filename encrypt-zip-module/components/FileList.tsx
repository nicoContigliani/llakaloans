// components/FileList.tsx
'use client';
import { useFileList } from '../hooks/useFileList';
import { useDownload } from '../hooks/useDownload';
import { formatBytes } from '../utils/fileUtils';
import { useState } from 'react';
import type { FileFilter } from '../types/encrypt-zip';

interface Props {
  userId?: string;
}

export function FileList({ userId }: Props) {
  const {
    files,
    loading,
    error,
    filters,
    pagination,
    total,
    totalPages,
    updateFilters,
    goToPage,
    setPageSize,
    deleteFile,
    hasNextPage,
    hasPrevPage
  } = useFileList({
    userId,
    autoLoad: true,
    initialPagination: { page: 1, limit: 10 }
  });

  const { downloads, downloadFile } = useDownload();
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [localFilters, setLocalFilters] = useState<FileFilter>(filters);

  const handleDownload = async (fileId: string) => {
    try {
      await downloadFile(fileId);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleDelete = async (fileId: string) => {
    if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      setDeletingFileId(fileId);
      try {
        await deleteFile(fileId);
        alert('File deleted successfully!');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete file. Please try again.');
      } finally {
        setDeletingFileId(null);
      }
    }
  };

  const applyFilters = () => {
    updateFilters(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FileFilter = {
      search: '',
      fileType: 'all',
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    updateFilters(clearedFilters);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return { bg: '#d4edda', color: '#155724' };
      case 'error':
        return { bg: '#f8d7da', color: '#721c24' };
      case 'downloading':
        return { bg: '#cce7ff', color: '#004085' };
      case 'decrypting':
        return { bg: '#fff3cd', color: '#856404' };
      case 'extracting':
        return { bg: '#e2e3e5', color: '#383d41' };
      default:
        return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'error':
        return '#dc3545';
      case 'done':
        return '#28a745';
      default:
        return '#007bff';
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      {/* Header con filtros */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>Encrypted Files ({total})</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={pagination.limit}
              onChange={(e) => setPageSize(Number(e.target.value))}
              style={{
                padding: '6px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '12px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          {/* Búsqueda */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              Buscar
            </label>
            <input
              type="text"
              value={localFilters.search || ''}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Buscar por nombre..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Tipo de archivo */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              Tipo
            </label>
            <select
              value={localFilters.fileType || 'all'}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, fileType: e.target.value as any }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="all">Todos</option>
              <option value="folders">Carpetas</option>
              <option value="files">Archivos individuales</option>
            </select>
          </div>

          {/* Ordenamiento */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              Ordenar por
            </label>
            <select
              value={localFilters.sortBy || 'date'}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="date">Fecha</option>
              <option value="name">Nombre</option>
              <option value="size">Tamaño</option>
              <option value="fileCount">Número de archivos</option>
            </select>
          </div>

          {/* Dirección del ordenamiento */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              Orden
            </label>
            <select
              value={localFilters.sortOrder || 'desc'}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, sortOrder: e.target.value as any }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <button
              onClick={applyFilters}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Aplicar
            </button>
            <button
              onClick={clearFilters}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ 
          color: '#721c24', 
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          ❌ Error: {error}
        </div>
      )}

      {files.length === 0 && !loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#6c757d'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>No se encontraron archivos</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            {filters.search || filters.fileType !== 'all' ? 'Prueba con otros filtros' : 'Sube algunos archivos para comenzar'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6', fontWeight: '600', color: '#495057' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6', fontWeight: '600', color: '#495057' }}>Tamaño</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6', fontWeight: '600', color: '#495057' }}>Archivos</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6', fontWeight: '600', color: '#495057' }}>Fecha</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6', fontWeight: '600', color: '#495057' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file.fileId} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', fontWeight: '500' }}>
                      {file.isFolder ? '📂' : '📄'} {file.originalName}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', color: '#6c757d' }}>
                      {formatBytes(file.totalSize)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', color: '#6c757d', textAlign: 'center' }}>
                      {file.fileCount}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', color: '#6c757d', fontSize: '13px' }}>
                      {new Date(file.uploadedAt).toLocaleDateString()} {new Date(file.uploadedAt).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => handleDownload(file.fileId)} 
                          disabled={downloads.some(d => d.id.startsWith(file.fileId) && (d.status === 'downloading' || d.status === 'decrypting' || d.status === 'extracting'))}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: downloads.some(d => d.id.startsWith(file.fileId) && (d.status === 'downloading' || d.status === 'decrypting' || d.status === 'extracting')) ? '#6c757d' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: downloads.some(d => d.id.startsWith(file.fileId) && (d.status === 'downloading' || d.status === 'decrypting' || d.status === 'extracting')) ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            minWidth: '80px'
                          }}
                        >
                          {downloads.some(d => d.id.startsWith(file.fileId) && d.status === 'downloading') ? '⬇️...' :
                           downloads.some(d => d.id.startsWith(file.fileId) && d.status === 'decrypting') ? '🔓...' :
                           downloads.some(d => d.id.startsWith(file.fileId) && d.status === 'extracting') ? '📦...' : '⬇️ Descargar'}
                        </button>
                        <button 
                          onClick={() => handleDelete(file.fileId)}
                          disabled={deletingFileId === file.fileId}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: deletingFileId === file.fileId ? '#6c757d' : '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: deletingFileId === file.fileId ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            minWidth: '80px'
                          }}
                        >
                          {deletingFileId === file.fileId ? '🔄...' : '🗑️ Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, total)} de {total} archivos
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={!hasPrevPage}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: hasPrevPage ? '#007bff' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: hasPrevPage ? 'pointer' : 'not-allowed',
                    fontSize: '14px'
                  }}
                >
                  Anterior
                </button>
                
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: pagination.page === pageNum ? '#007bff' : 'transparent',
                          color: pagination.page === pageNum ? 'white' : '#007bff',
                          border: `1px solid ${pagination.page === pageNum ? '#007bff' : '#ddd'}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={!hasNextPage}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: hasNextPage ? '#007bff' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: hasNextPage ? 'pointer' : 'not-allowed',
                    fontSize: '14px'
                  }}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Download Progress */}
      {downloads.map(d => {
        const statusColors = getStatusColor(d.status);
        const progressColor = getProgressColor(d.status);
        
        return (
          <div key={d.id} style={{ 
            marginTop: '10px', 
            padding: '15px', 
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: d.status === 'error' ? '#fff5f5' : '#f8f9fa'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <strong style={{ fontSize: '14px' }}>Descarga: {d.name}</strong>
              <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold',
                backgroundColor: statusColors.bg,
                color: statusColors.color
              }}>
                {d.status.toUpperCase()}
              </span>
            </div>
            
            <div style={{ 
              width: '100%', 
              backgroundColor: '#e9ecef', 
              height: '20px',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{ 
                width: `${d.progress}%`, 
                backgroundColor: progressColor, 
                height: '100%',
                transition: 'width 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  fontSize: '11px',
                  color: d.progress > 50 ? 'white' : 'transparent',
                  fontWeight: 'bold',
                  textShadow: d.progress > 50 ? '0px 0px 2px rgba(0,0,0,0.5)' : 'none'
                }}>
                  {d.progress}%
                </span>
              </div>
            </div>
            
            {d.error && (
              <div style={{ 
                color: '#dc3545', 
                fontSize: '13px',
                marginTop: '8px',
                padding: '8px',
                backgroundColor: '#f8d7da',
                borderRadius: '4px',
                border: '1px solid #f5c6cb'
              }}>
                ❌ {d.error}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}