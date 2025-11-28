// "use client";
// import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
// import { useCompanies } from '../hooks/useCompanies';
// import { Company, CompanyUpdateInput } from '../types/organization';
// import { useUser } from '@clerk/nextjs';

// interface CompanyManagerProps {
//   onCompanyDeleted?: () => void;
// }

// // Componentes memoizados para mejor performance
// const LoadingSpinner = memo<{ size?: 'sm' | 'md' | 'lg' }>(({ size = 'md' }) => {
//   const sizeClass = {
//     sm: 'w-4 h-4 border-2',
//     md: 'w-6 h-6 border-2',
//     lg: 'w-8 h-8 border-3'
//   }[size];

//   return (
//     <div className={`border-gray-300 border-t-blue-600 rounded-full animate-spin ${sizeClass}`} />
//   );
// });
// LoadingSpinner.displayName = 'LoadingSpinner';

// const Toast = memo<{
//   message: string;
//   type: 'success' | 'error' | 'warning';
//   onClose: () => void;
//   duration?: number;
// }>(({ message, type, onClose, duration = 5000 }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, duration);
//     return () => clearTimeout(timer);
//   }, [duration, onClose]);

//   const styles = {
//     success: 'bg-green-50 border-green-200 text-green-800',
//     error: 'bg-red-50 border-red-200 text-red-800',
//     warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
//   }[type];

//   const icons = {
//     success: '✅',
//     error: '❌',
//     warning: '⚠️'
//   }[type];

//   return (
//     <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${styles} shadow-lg max-w-sm animate-in slide-in-from-right-8`}>
//       <div className="flex items-center gap-3">
//         <span className="text-lg">{icons}</span>
//         <p className="text-sm font-medium flex-1">{message}</p>
//         <button
//           onClick={onClose}
//           className="text-gray-400 hover:text-gray-600 transition-colors text-lg font-bold"
//         >
//           ×
//         </button>
//       </div>
//     </div>
//   );
// });
// Toast.displayName = 'Toast';

// const CompanyForm = memo<{
//   isEditing: boolean;
//   formData: { name: string; slug: string; contact_email: string };
//   formErrors: Record<string, string>;
//   loading: boolean;
//   onInputChange: (field: string, value: string) => void;
//   onSubmit: (e: React.FormEvent) => void;
//   onCancel: () => void;
// }>(({ isEditing, formData, formErrors, loading, onInputChange, onSubmit, onCancel }) => {
//   const handleSubmit = useCallback((e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(e);
//   }, [onSubmit]);

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <div className="modal-header">
//           <h3>{isEditing ? 'Editar Empresa' : 'Crear Nueva Empresa'}</h3>
//           <button 
//             onClick={onCancel}
//             className="close-button"
//             disabled={loading}
//             title="Cerrar"
//             type="button"
//           >
//             ×
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="form">
//           <div className="form-group">
//             <label htmlFor="name">Nombre de la empresa *</label>
//             <input
//               id="name"
//               type="text"
//               placeholder="Ej: Mi Empresa S.A."
//               value={formData.name}
//               onChange={(e) => onInputChange('name', e.target.value)}
//               className={formErrors.name ? 'error' : ''}
//               disabled={loading}
//             />
//             {formErrors.name && <span className="error-text">{formErrors.name}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="slug">Slug único *</label>
//             <input
//               id="slug"
//               type="text"
//               placeholder="Ej: mi-empresa"
//               value={formData.slug}
//               onChange={(e) => onInputChange('slug', e.target.value.toLowerCase())}
//               className={formErrors.slug ? 'error' : ''}
//               disabled={isEditing || loading}
//             />
//             {formErrors.slug && <span className="error-text">{formErrors.slug}</span>}
//             <small>Usa solo letras minúsculas, números y guiones {isEditing && '(No editable)'}</small>
//           </div>

//           <div className="form-group">
//             <label htmlFor="email">Email de contacto *</label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Ej: contacto@empresa.com"
//               value={formData.contact_email}
//               onChange={(e) => onInputChange('contact_email', e.target.value)}
//               className={formErrors.contact_email ? 'error' : ''}
//               disabled={loading}
//             />
//             {formErrors.contact_email && <span className="error-text">{formErrors.contact_email}</span>}
//           </div>

//           <div className="form-actions">
//             <button 
//               type="button" 
//               onClick={onCancel}
//               className="secondary-button"
//               disabled={loading}
//             >
//               Cancelar
//             </button>
//             <button 
//               type="submit" 
//               className="primary-button"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <LoadingSpinner size="sm" />
//                   Procesando...
//                 </>
//               ) : (
//                 isEditing ? 'Actualizar Empresa' : 'Crear Empresa'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// });
// CompanyForm.displayName = 'CompanyForm';

// const CompanyCard = memo<{
//   company: Company;
//   loading: boolean;
//   actionLoading: boolean;
//   deleteLoading: string | null;
//   onEdit: (company: Company) => void;
//   onDelete: (companyId: string, companyName: string) => void;
// }>(({ company, loading, actionLoading, deleteLoading, onEdit, onDelete }) => {
//   const formatDate = useCallback((date: Date) => {
//     return new Date(date).toLocaleDateString('es-ES', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   }, []);

//   const handleEdit = useCallback(() => {
//     onEdit(company);
//   }, [company, onEdit]);

//   const handleDelete = useCallback(() => {
//     onDelete(company._id, company.name);
//   }, [company._id, company.name, onDelete]);

//   const isDeleteLoading = deleteLoading === company._id;

//   return (
//     <div className="company-card">
//       <div className="company-header">
//         <h3>{company.name}</h3>
//         <span className={`status-badge ${company.status}`}>
//           {company.status === 'active' ? 'Activa' : 'Inactiva'}
//         </span>
//       </div>
      
//       <div className="company-details">
//         <div className="detail-item">
//           <strong>Slug:</strong>
//           <code>{company.slug}</code>
//         </div>
//         <div className="detail-item">
//           <strong>Email:</strong>
//           <span>{company.contact_email}</span>
//         </div>
//         <div className="detail-item">
//           <strong>Creada:</strong>
//           <span>{formatDate(company.created_at)}</span>
//         </div>
//       </div>

//       <div className="company-actions">
//         <button 
//           className="action-button"
//           onClick={handleEdit}
//           disabled={loading || actionLoading}
//           title="Editar empresa"
//           type="button"
//         >
//           Editar
//         </button>
//         <button 
//           className="action-button danger"
//           onClick={handleDelete}
//           disabled={loading || actionLoading || isDeleteLoading}
//           title="Eliminar empresa"
//           type="button"
//         >
//           {isDeleteLoading ? (
//             <>
//               <LoadingSpinner size="sm" />
//               Eliminando...
//             </>
//           ) : (
//             'Eliminar'
//           )}
//         </button>
//       </div>
//     </div>
//   );
// });
// CompanyCard.displayName = 'CompanyCard';

// const EmptyState = memo<{
//   onCreateCompany: () => void;
// }>(({ onCreateCompany }) => (
//   <div className="empty-state">
//     <h3>No hay empresas</h3>
//     <p>Crea tu primera empresa para comenzar</p>
//     <button 
//       onClick={onCreateCompany}
//       className="primary-button"
//       type="button"
//     >
//       Crear Primera Empresa
//     </button>
//   </div>
// ));
// EmptyState.displayName = 'EmptyState';

// const ErrorState = memo<{
//   error: string;
//   onRetry: () => void;
//   onClearError: () => void;
// }>(({ error, onRetry, onClearError }) => (
//   <div className="error-container">
//     <h3>Error al cargar empresas</h3>
//     <p>{error}</p>
//     <div className="error-actions">
//       <button onClick={onRetry} className="retry-button" type="button">
//         Reintentar
//       </button>
//       <button onClick={onClearError} className="secondary-button" type="button">
//         Cerrar
//       </button>
//     </div>
//   </div>
// ));
// ErrorState.displayName = 'ErrorState';

// // Componente principal optimizado
// export const CompanyManager: React.FC<CompanyManagerProps> = memo(({ onCompanyDeleted }) => {
//   const { companies, loading, error, fetchCompanies, createCompany, updateCompany, deleteCompany, clearError } = useCompanies();
//   const { user } = useUser();
  
//   // Estados locales
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [editingCompany, setEditingCompany] = useState<Company | null>(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     slug: '',
//     contact_email: ''
//   });
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   // Mostrar toast
//   const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
//     setToast({ message, type });
//   }, []);

//   // Cargar empresas al montar
//   useEffect(() => {
//     fetchCompanies();
//   }, [fetchCompanies]);

//   // Validación del formulario memoizada
//   const validateForm = useCallback(() => {
//     const errors: Record<string, string> = {};

//     if (!formData.name.trim()) {
//       errors.name = 'El nombre es requerido';
//     } else if (formData.name.length < 3) {
//       errors.name = 'El nombre debe tener al menos 3 caracteres';
//     }

//     if (!formData.slug.trim()) {
//       errors.slug = 'El slug es requerido';
//     } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
//       errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
//     }

//     if (!formData.contact_email.trim()) {
//       errors.contact_email = 'El email es requerido';
//     } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
//       errors.contact_email = 'El email no es válido';
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   }, [formData]);

//   // Handlers memoizados
//   const handleCreateCompany = useCallback(async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setActionLoading(true);
//     try {
//       await createCompany({
//         ...formData,
//         user_id: user?.id || ''
//       });
      
//       setShowCreateForm(false);
//       setFormData({ name: '', slug: '', contact_email: '' });
//       showToast('Empresa creada exitosamente');
      
//       // Recargar la lista
//       await fetchCompanies();
      
//       // Notificar al componente padre para recargar las empresas del usuario
//       onCompanyDeleted?.();
//     } catch (err) {
//       // Error ya manejado en el hook
//     } finally {
//       setActionLoading(false);
//     }
//   }, [formData, validateForm, createCompany, user?.id, fetchCompanies, onCompanyDeleted, showToast]);

//   const handleEditCompany = useCallback((company: Company) => {
//     setEditingCompany(company);
//     setFormData({
//       name: company.name,
//       slug: company.slug,
//       contact_email: company.contact_email
//     });
//     clearError();
//   }, [clearError]);

//   const handleUpdateCompany = useCallback(async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm() || !editingCompany) return;

//     setActionLoading(true);
//     try {
//       const updateData: CompanyUpdateInput = {
//         name: formData.name,
//         slug: formData.slug,
//         contact_email: formData.contact_email
//       };

//       await updateCompany(editingCompany._id, updateData);
      
//       setEditingCompany(null);
//       setFormData({ name: '', slug: '', contact_email: '' });
//       showToast('Empresa actualizada exitosamente');
      
//       // Recargar la lista
//       await fetchCompanies();
      
//       // Notificar al componente padre para recargar las empresas del usuario
//       onCompanyDeleted?.();
//     } catch (err) {
//       // Error ya manejado en el hook
//     } finally {
//       setActionLoading(false);
//     }
//   }, [formData, validateForm, editingCompany, updateCompany, fetchCompanies, onCompanyDeleted, showToast]);

//   const handleDeleteCompany = useCallback(async (companyId: string, companyName: string) => {
//     if (!companyId) {
//       console.error('❌ [Component] Company ID is undefined');
//       showToast('ID de empresa inválido', 'error');
//       return;
//     }

//     if (!confirm(`¿Estás seguro de que quieres eliminar la empresa "${companyName}"?\n\nEsta acción no se puede deshacer y se eliminarán todos los usuarios asociados.`)) {
//       return;
//     }

//     setDeleteLoading(companyId);
//     clearError();
    
//     try {
//       console.log('🗑️ [Component] Starting delete for company:', companyId);
//       await deleteCompany(companyId);
//       showToast(`Empresa "${companyName}" eliminada exitosamente`);
      
//       // Notificar al componente padre para recargar las empresas del usuario
//       onCompanyDeleted?.();
//     } catch (err) {
//       console.error('❌ [Component] Error in handleDeleteCompany:', err);
//       // Error ya manejado en el hook
//     } finally {
//       setDeleteLoading(null);
//     }
//   }, [deleteCompany, clearError, onCompanyDeleted, showToast]);

//   const handleInputChange = useCallback((field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (formErrors[field]) {
//       setFormErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   }, [formErrors]);

//   const resetForm = useCallback(() => {
//     setShowCreateForm(false);
//     setEditingCompany(null);
//     setFormData({ name: '', slug: '', contact_email: '' });
//     setFormErrors({});
//     clearError();
//   }, [clearError]);

//   const handleRetry = useCallback(() => {
//     clearError();
//     fetchCompanies();
//   }, [clearError, fetchCompanies]);

//   const handleCreateClick = useCallback(() => {
//     setShowCreateForm(true);
//     clearError();
//   }, [clearError]);

//   // Valores memoizados
//   const isFormOpen = showCreateForm || editingCompany;
//   const isEditing = !!editingCompany;

//   // Renderizado condicional para estados de carga y error
//   if (loading && companies.length === 0) {
//     return (
//       <div className="loading-container">
//         <LoadingSpinner size="lg" />
//         <p>Cargando empresas...</p>
//       </div>
//     );
//   }

//   if (error && companies.length === 0) {
//     return (
//       <ErrorState 
//         error={error} 
//         onRetry={handleRetry}
//         onClearError={clearError}
//       />
//     );
//   }

//   return (
//     <div className="company-manager">
//       {/* Toast Notifications */}
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}

//       {/* Header */}
//       <div className="header">
//         <div>
//           <h2>Gestión de Empresas</h2>
//           <p className="subtitle">Administra las empresas de tu organización</p>
//         </div>
//         <button 
//           onClick={handleCreateClick}
//           className="primary-button"
//           disabled={loading}
//           type="button"
//         >
//           + Crear Empresa
//         </button>
//       </div>

//       {error && (
//         <div className="error-message">
//           <span>❌</span> 
//           <div className="error-content">
//             <strong>Error:</strong> {error}
//           </div>
//           <button onClick={clearError} className="dismiss-button" title="Cerrar" type="button">×</button>
//         </div>
//       )}

//       {/* Formulario Modal */}
//       {isFormOpen && (
//         <CompanyForm
//           isEditing={isEditing}
//           formData={formData}
//           formErrors={formErrors}
//           loading={actionLoading}
//           onInputChange={handleInputChange}
//           onSubmit={isEditing ? handleUpdateCompany : handleCreateCompany}
//           onCancel={resetForm}
//         />
//       )}

//       {/* Grid de Empresas */}
//       <div className="companies-grid">
//         {companies.length === 0 && !loading ? (
//           <EmptyState onCreateCompany={handleCreateClick} />
//         ) : (
//           companies.map(company => (
//             <CompanyCard
//               key={company._id}
//               company={company}
//               loading={loading}
//               actionLoading={actionLoading}
//               deleteLoading={deleteLoading}
//               onEdit={handleEditCompany}
//               onDelete={handleDeleteCompany}
//             />
//           ))
//         )}
        
//         {loading && companies.length > 0 && (
//           <div className="loading-overlay">
//             <LoadingSpinner size="md" />
//             <p>Actualizando lista...</p>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .company-manager {
//           padding: 20px;
//           position: relative;
//         }

//         .header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 30px;
//         }

//         .header h2 {
//           margin: 0 0 4px 0;
//           color: #111827;
//           font-size: 24px;
//           font-weight: 700;
//         }

//         .subtitle {
//           color: #6b7280;
//           margin: 0;
//           font-size: 14px;
//         }

//         .primary-button {
//           background: #3b82f6;
//           color: white;
//           border: none;
//           padding: 12px 24px;
//           border-radius: 8px;
//           cursor: pointer;
//           font-weight: 600;
//           transition: all 0.2s;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .primary-button:hover:not(:disabled) {
//           background: #2563eb;
//           transform: translateY(-1px);
//           box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
//         }

//         .primary-button:disabled {
//           background: #9ca3af;
//           cursor: not-allowed;
//           transform: none;
//           box-shadow: none;
//         }

//         .secondary-button {
//           background: white;
//           color: #374151;
//           border: 1px solid #d1d5db;
//           padding: 12px 24px;
//           border-radius: 8px;
//           cursor: pointer;
//           font-weight: 600;
//           transition: all 0.2s;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .secondary-button:hover:not(:disabled) {
//           background: #f9fafb;
//           border-color: #9ca3af;
//         }

//         .secondary-button:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .error-message {
//           background: #fef2f2;
//           color: #dc2626;
//           padding: 12px 16px;
//           border-radius: 6px;
//           margin-bottom: 20px;
//           border: 1px solid #fecaca;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 12px;
//         }

//         .error-content {
//           flex: 1;
//         }

//         .dismiss-button {
//           background: none;
//           border: none;
//           font-size: 18px;
//           cursor: pointer;
//           color: #dc2626;
//           padding: 0;
//           width: 24px;
//           height: 24px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 50%;
//           transition: background 0.2s;
//         }

//         .dismiss-button:hover {
//           background: rgba(220, 38, 38, 0.1);
//         }

//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0, 0, 0, 0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//           padding: 20px;
//         }

//         .modal {
//           background: white;
//           border-radius: 12px;
//           padding: 0;
//           width: 100%;
//           max-width: 500px;
//           max-height: 90vh;
//           overflow-y: auto;
//           box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
//         }

//         .modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 20px;
//           border-bottom: 1px solid #e5e7eb;
//           background: #f8fafc;
//         }

//         .modal-header h3 {
//           margin: 0;
//           font-size: 18px;
//           font-weight: 600;
//           color: #111827;
//         }

//         .close-button {
//           background: none;
//           border: none;
//           font-size: 24px;
//           cursor: pointer;
//           color: #6b7280;
//           width: 32px;
//           height: 32px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 50%;
//           transition: all 0.2s;
//         }

//         .close-button:hover:not(:disabled) {
//           background: #f3f4f6;
//           color: #374151;
//         }

//         .close-button:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }

//         .form {
//           padding: 20px;
//         }

//         .form-group {
//           margin-bottom: 20px;
//         }

//         .form-group label {
//           display: block;
//           margin-bottom: 6px;
//           font-weight: 600;
//           color: #374151;
//           font-size: 14px;
//         }

//         .form-group input {
//           width: 100%;
//           padding: 10px 12px;
//           border: 1px solid #d1d5db;
//           border-radius: 6px;
//           font-size: 14px;
//           transition: all 0.2s;
//         }

//         .form-group input:focus {
//           outline: none;
//           border-color: #3b82f6;
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//         }

//         .form-group input:disabled {
//           background: #f9fafb;
//           color: #6b7280;
//           cursor: not-allowed;
//         }

//         .form-group input.error {
//           border-color: #dc3545;
//         }

//         .error-text {
//           color: #dc3545;
//           font-size: 12px;
//           display: block;
//           margin-top: 4px;
//         }

//         .form-group small {
//           color: #6b7280;
//           font-size: 12px;
//           display: block;
//           margin-top: 4px;
//         }

//         .form-actions {
//           display: flex;
//           gap: 12px;
//           justify-content: flex-end;
//           margin-top: 24px;
//         }

//         .companies-grid {
//           display: grid;
//           gap: 20px;
//           grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
//           position: relative;
//         }

//         .company-card {
//           border: 1px solid #e5e7eb;
//           border-radius: 12px;
//           padding: 20px;
//           transition: all 0.2s;
//           position: relative;
//           background: white;
//         }

//         .company-card:hover {
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//           transform: translateY(-2px);
//         }

//         .company-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 16px;
//         }

//         .company-header h3 {
//           margin: 0;
//           color: #111827;
//           flex: 1;
//           margin-right: 12px;
//           font-size: 18px;
//           font-weight: 600;
//           line-height: 1.4;
//         }

//         .status-badge {
//           padding: 4px 12px;
//           border-radius: 12px;
//           font-size: 12px;
//           font-weight: 600;
//           white-space: nowrap;
//         }

//         .status-badge.active {
//           background: #d1fae5;
//           color: #065f46;
//         }

//         .status-badge.inactive {
//           background: #fef2f2;
//           color: #991b1b;
//         }

//         .company-details {
//           margin-bottom: 20px;
//         }

//         .detail-item {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 8px;
//           font-size: 14px;
//           align-items: center;
//         }

//         .detail-item strong {
//           color: #374151;
//         }

//         .detail-item code {
//           background: #f3f4f6;
//           padding: 4px 8px;
//           border-radius: 4px;
//           font-family: 'Monaco', 'Consolas', monospace;
//           font-size: 12px;
//           color: #111827;
//         }

//         .detail-item span {
//           color: #6b7280;
//         }

//         .company-actions {
//           display: flex;
//           gap: 12px;
//         }

//         .action-button {
//           flex: 1;
//           padding: 8px 16px;
//           border: 1px solid #d1d5db;
//           background: white;
//           border-radius: 6px;
//           cursor: pointer;
//           transition: all 0.2s;
//           font-size: 14px;
//           font-weight: 500;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 6px;
//         }

//         .action-button:hover:not(:disabled) {
//           background: #f9fafb;
//           border-color: #9ca3af;
//         }

//         .action-button:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//           background: #f3f4f6;
//         }

//         .action-button.danger {
//           color: #dc2626;
//           border-color: #dc2626;
//         }

//         .action-button.danger:hover:not(:disabled) {
//           background: #fef2f2;
//           border-color: #dc2626;
//         }

//         .empty-state {
//           text-align: center;
//           padding: 60px 20px;
//           grid-column: 1 / -1;
//           background: #f9fafb;
//           border-radius: 12px;
//           border: 2px dashed #e5e7eb;
//         }

//         .empty-state h3 {
//           color: #374151;
//           margin-bottom: 8px;
//           font-size: 18px;
//         }

//         .empty-state p {
//           color: #6b7280;
//           margin-bottom: 20px;
//           font-size: 14px;
//         }

//         .loading-container {
//           text-align: center;
//           padding: 80px 20px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 16px;
//         }

//         .loading-container p {
//           margin: 0;
//           color: #6b7280;
//           font-size: 16px;
//         }

//         .loading-overlay {
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(255, 255, 255, 0.9);
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           z-index: 10;
//           border-radius: 12px;
//           gap: 12px;
//         }

//         .loading-overlay p {
//           margin: 0;
//           color: #6b7280;
//           font-size: 14px;
//         }

//         .error-container {
//           text-align: center;
//           padding: 40px 20px;
//           background: #fef2f2;
//           color: #991b1b;
//           border-radius: 12px;
//           border: 1px solid #fecaca;
//         }

//         .error-container h3 {
//           margin: 0 0 12px 0;
//           font-size: 18px;
//         }

//         .error-container p {
//           margin: 0 0 20px 0;
//           font-size: 14px;
//         }

//         .error-actions {
//           display: flex;
//           gap: 12px;
//           justify-content: center;
//         }

//         .retry-button {
//           padding: 10px 20px;
//           background: #dc2626;
//           color: white;
//           border: none;
//           border-radius: 6px;
//           cursor: pointer;
//           font-weight: 600;
//           transition: all 0.2s;
//         }

//         .retry-button:hover {
//           background: #b91c1c;
//           transform: translateY(-1px);
//         }

//         @media (max-width: 768px) {
//           .company-manager {
//             padding: 16px;
//           }

//           .header {
//             flex-direction: column;
//             gap: 16px;
//             align-items: stretch;
//           }

//           .companies-grid {
//             grid-template-columns: 1fr;
//           }

//           .form-actions {
//             flex-direction: column;
//           }

//           .company-actions {
//             flex-direction: column;
//           }

//           .error-actions {
//             flex-direction: column;
//           }
//         }
//       `}</style>
//     </div>
//   );
// });

// CompanyManager.displayName = 'CompanyManager';

// export default CompanyManager;




'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useCompanies } from '../hooks/useCompanies';
import { Company, CompanyUpdateInput } from '../types/organization';
import { useUser } from '@clerk/nextjs';
import styles from './CompanyManager.module.css';

interface CompanyManagerProps {
  onCompanyDeleted?: () => void;
}

// Componente Spinner
const Spinner = memo<{ size?: 'sm' | 'md' | 'lg' }>(({ size = 'md' }) => (
  <div className={`${styles.spinner} ${styles[`spinner${size.charAt(0).toUpperCase() + size.slice(1)}`]}`} />
));
Spinner.displayName = 'Spinner';

// Componente Toast
const Toast = memo<{
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
  duration?: number;
}>(({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }[type];

  return (
    <div className={`${styles.toast} ${styles[`toast${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}>
      <div className={styles.toastContent}>
        <span>{icons}</span>
        <p className={styles.toastMessage}>{message}</p>
        <button
          onClick={onClose}
          className={styles.toastClose}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
});
Toast.displayName = 'Toast';

// Componente Formulario
const CompanyForm = memo<{
  isEditing: boolean;
  formData: { name: string; slug: string; contact_email: string };
  formErrors: Record<string, string>;
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}>(({ isEditing, formData, formErrors, loading, onInputChange, onSubmit, onCancel }) => {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  }, [onSubmit]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {isEditing ? 'Editar Empresa' : 'Crear Nueva Empresa'}
          </h3>
          <button 
            onClick={onCancel}
            className={styles.closeButton}
            disabled={loading}
            type="button"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Nombre de la empresa *
            </label>
            <input
              type="text"
              placeholder="Ej: Mi Empresa S.A."
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className={`${styles.formInput} ${formErrors.name ? styles.error : ''}`}
              disabled={loading}
            />
            {formErrors.name && (
              <span className={styles.formError}>{formErrors.name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Slug único *
            </label>
            <input
              type="text"
              placeholder="Ej: mi-empresa"
              value={formData.slug}
              onChange={(e) => onInputChange('slug', e.target.value.toLowerCase())}
              className={`${styles.formInput} ${formErrors.slug ? styles.error : ''}`}
              disabled={isEditing || loading}
            />
            {formErrors.slug && (
              <span className={styles.formError}>{formErrors.slug}</span>
            )}
            <span className={styles.formHelp}>
              Usa solo letras minúsculas, números y guiones {isEditing && '(No editable)'}
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Email de contacto *
            </label>
            <input
              type="email"
              placeholder="Ej: contacto@empresa.com"
              value={formData.contact_email}
              onChange={(e) => onInputChange('contact_email', e.target.value)}
              className={`${styles.formInput} ${formErrors.contact_email ? styles.error : ''}`}
              disabled={loading}
            />
            {formErrors.contact_email && (
              <span className={styles.formError}>{formErrors.contact_email}</span>
            )}
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={onCancel}
              className={styles.secondaryButton}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.primaryButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Procesando...
                </>
              ) : (
                isEditing ? 'Actualizar Empresa' : 'Crear Empresa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
CompanyForm.displayName = 'CompanyForm';

// Componente Tarjeta de Empresa
const CompanyCard = memo<{
  company: Company;
  loading: boolean;
  actionLoading: boolean;
  deleteLoading: string | null;
  onEdit: (company: Company) => void;
  onDelete: (companyId: string, companyName: string) => void;
}>(({ company, loading, actionLoading, deleteLoading, onEdit, onDelete }) => {
  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const handleEdit = useCallback(() => {
    onEdit(company);
  }, [company, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(company._id, company.name);
  }, [company._id, company.name, onDelete]);

  const isDeleteLoading = deleteLoading === company._id;

  return (
    <div className={styles.companyCard}>
      <div className={styles.companyHeader}>
        <h3 className={styles.companyName}>{company.name}</h3>
        <span className={`${styles.statusBadge} ${company.status === 'active' ? styles.statusActive : styles.statusInactive}`}>
          {company.status === 'active' ? 'Activa' : 'Inactiva'}
        </span>
      </div>
      
      <div className={styles.companyDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Slug:</span>
          <code className={styles.detailSlug}>{company.slug}</code>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Email:</span>
          <span className={styles.detailValue}>{company.contact_email}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Creada:</span>
          <span className={styles.detailValue}>{formatDate(company.created_at)}</span>
        </div>
      </div>

      <div className={styles.companyActions}>
        <button 
          className={styles.actionButton}
          onClick={handleEdit}
          disabled={loading || actionLoading}
          type="button"
        >
          Editar
        </button>
        <button 
          className={`${styles.actionButton} ${styles.actionButtonDanger}`}
          onClick={handleDelete}
          disabled={loading || actionLoading || isDeleteLoading}
          type="button"
        >
          {isDeleteLoading ? (
            <>
              <Spinner size="sm" />
              Eliminando...
            </>
          ) : (
            'Eliminar'
          )}
        </button>
      </div>
    </div>
  );
});
CompanyCard.displayName = 'CompanyCard';

// Estados vacío y error
const EmptyState = memo<{
  onCreateCompany: () => void;
}>(({ onCreateCompany }) => (
  <div className={styles.emptyState}>
    <h3 className={styles.emptyStateTitle}>No hay empresas</h3>
    <p className={styles.emptyStateText}>Crea tu primera empresa para comenzar</p>
    <button 
      onClick={onCreateCompany}
      className={styles.primaryButton}
      type="button"
    >
      Crear Primera Empresa
    </button>
  </div>
));
EmptyState.displayName = 'EmptyState';

const ErrorState = memo<{
  error: string;
  onRetry: () => void;
  onClearError: () => void;
}>(({ error, onRetry, onClearError }) => (
  <div className={styles.errorContainer}>
    <h3 className={styles.errorTitle}>Error al cargar empresas</h3>
    <p className={styles.errorDescription}>{error}</p>
    <div className={styles.errorActions}>
      <button onClick={onRetry} className={styles.retryButton} type="button">
        Reintentar
      </button>
      <button onClick={onClearError} className={styles.secondaryButton} type="button">
        Cerrar
      </button>
    </div>
  </div>
));
ErrorState.displayName = 'ErrorState';

// Componente principal
export const CompanyManager: React.FC<CompanyManagerProps> = memo(({ onCompanyDeleted }) => {
  const { companies, loading, error, fetchCompanies, createCompany, updateCompany, deleteCompany, clearError } = useCompanies();
  const { user } = useUser();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    contact_email: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Mostrar toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
  }, []);

  // Cargar empresas al montar
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Validación del formulario
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.slug.trim()) {
      errors.slug = 'El slug es requerido';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
    }

    if (!formData.contact_email.trim()) {
      errors.contact_email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      errors.contact_email = 'El email no es válido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Handlers
  const handleCreateCompany = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setActionLoading(true);
    try {
      await createCompany({
        ...formData,
        user_id: user?.id || ''
      });
      
      setShowCreateForm(false);
      setFormData({ name: '', slug: '', contact_email: '' });
      showToast('Empresa creada exitosamente');
      
      await fetchCompanies();
      onCompanyDeleted?.();
    } catch (err) {
      // Error manejado en el hook
    } finally {
      setActionLoading(false);
    }
  }, [formData, validateForm, createCompany, user?.id, fetchCompanies, onCompanyDeleted, showToast]);

  const handleEditCompany = useCallback((company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      slug: company.slug,
      contact_email: company.contact_email
    });
    clearError();
  }, [clearError]);

  const handleUpdateCompany = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !editingCompany) return;

    setActionLoading(true);
    try {
      const updateData: CompanyUpdateInput = {
        name: formData.name,
        contact_email: formData.contact_email
      };

      await updateCompany(editingCompany._id, updateData);
      
      setEditingCompany(null);
      setFormData({ name: '', slug: '', contact_email: '' });
      showToast('Empresa actualizada exitosamente');
      
      await fetchCompanies();
      onCompanyDeleted?.();
    } catch (err) {
      // Error manejado en el hook
    } finally {
      setActionLoading(false);
    }
  }, [formData, validateForm, editingCompany, updateCompany, fetchCompanies, onCompanyDeleted, showToast]);

  const handleDeleteCompany = useCallback(async (companyId: string, companyName: string) => {
    if (!companyId) {
      showToast('ID de empresa inválido', 'error');
      return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar la empresa "${companyName}"?\n\nEsta acción no se puede deshacer y se eliminarán todos los usuarios asociados.`)) {
      return;
    }

    setDeleteLoading(companyId);
    clearError();
    
    try {
      await deleteCompany(companyId);
      showToast(`Empresa "${companyName}" eliminada exitosamente`);
      onCompanyDeleted?.();
    } catch (err) {
      // Error manejado en el hook
    } finally {
      setDeleteLoading(null);
    }
  }, [deleteCompany, clearError, onCompanyDeleted, showToast]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  const resetForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingCompany(null);
    setFormData({ name: '', slug: '', contact_email: '' });
    setFormErrors({});
    clearError();
  }, [clearError]);

  const handleRetry = useCallback(() => {
    clearError();
    fetchCompanies();
  }, [clearError, fetchCompanies]);

  const handleCreateClick = useCallback(() => {
    setShowCreateForm(true);
    clearError();
  }, [clearError]);

  const isFormOpen = showCreateForm || editingCompany;
  const isEditing = !!editingCompany;

  // Estados de carga
  if (loading && companies.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="lg" />
        <p className={styles.loadingText}>Cargando empresas...</p>
      </div>
    );
  }

  if (error && companies.length === 0) {
    return (
      <ErrorState 
        error={error} 
        onRetry={handleRetry}
        onClearError={clearError}
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Gestión de Empresas</h2>
          <p className={styles.subtitle}>Administra las empresas de tu organización</p>
        </div>
        <button 
          onClick={handleCreateClick}
          className={styles.createButton}
          disabled={loading}
          type="button"
        >
          + Crear Empresa
        </button>
      </div>

      {/* Error Global */}
      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>❌</span>
          <div className={styles.errorContent}>
            <strong>Error:</strong> {error}
          </div>
          <button onClick={clearError} className={styles.dismissButton} type="button">×</button>
        </div>
      )}

      {/* Formulario */}
      {isFormOpen && (
        <CompanyForm
          isEditing={isEditing}
          formData={formData}
          formErrors={formErrors}
          loading={actionLoading}
          onInputChange={handleInputChange}
          onSubmit={isEditing ? handleUpdateCompany : handleCreateCompany}
          onCancel={resetForm}
        />
      )}

      {/* Grid de Empresas */}
      <div className={styles.companiesGrid}>
        {companies.length === 0 && !loading ? (
          <EmptyState onCreateCompany={handleCreateClick} />
        ) : (
          companies.map(company => (
            <CompanyCard
              key={company._id}
              company={company}
              loading={loading}
              actionLoading={actionLoading}
              deleteLoading={deleteLoading}
              onEdit={handleEditCompany}
              onDelete={handleDeleteCompany}
            />
          ))
        )}
        
        {loading && companies.length > 0 && (
          <div className={styles.loadingOverlay}>
            <Spinner size="md" />
            <p className={styles.loadingOverlayText}>Actualizando lista...</p>
          </div>
        )}
      </div>
    </div>
  );
});

CompanyManager.displayName = 'CompanyManager';

export default CompanyManager;