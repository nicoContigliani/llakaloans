// organization-module/components/UserManager.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useUser } from '@clerk/nextjs';
import { useRoles } from '../hooks/useRoles';
import { permissionService } from '../services/permissionService';
import { RoleName, UserWithRoles } from '../types/organization';

interface UserManagerProps {
  companyId: string;
  companyName: string;
}

// Función auxiliar para asegurar nombres de roles
const ensureRoleNames = (roles: any[]): RoleName[] => {
  if (!Array.isArray(roles)) return [];

  const validRoles: RoleName[] = ['toor', 'owner', 'admin', 'user', 'guest'];
  return roles.filter(role =>
    typeof role === 'string' && validRoles.includes(role as RoleName)
  ) as RoleName[];
};

// Componentes memoizados para mejor performance
const LoadingSpinner = memo<{ size?: 'sm' | 'md' | 'lg' }>(({ size = 'md' }) => {
  const sizeClass = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  }[size];

  return (
    <div className={`border-gray-300 border-t-blue-600 rounded-full animate-spin ${sizeClass}`} />
  );
});
LoadingSpinner.displayName = 'LoadingSpinner';

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

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }[type];

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${styles} shadow-lg max-w-sm animate-in slide-in-from-right-8`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">{icons}</span>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors text-lg font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
});
Toast.displayName = 'Toast';

const RoleBadge = memo<{
  role: RoleName;
  size?: 'sm' | 'md';
}>(({ role, size = 'md' }) => {
  const colors: Record<RoleName, string> = {
    'toor': 'bg-red-600',
    'owner': 'bg-purple-600',
    'admin': 'bg-orange-500',
    'user': 'bg-blue-500',
    'guest': 'bg-gray-500'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }[size];

  return (
    <span
      className={`
        ${colors[role]} 
        ${sizeClasses}
        rounded-full text-white font-semibold capitalize inline-block
      `}
    >
      {role}
    </span>
  );
});
RoleBadge.displayName = 'RoleBadge';

const UserAvatar = memo<{
  user: UserWithRoles;
  size?: 'sm' | 'md' | 'lg'
}>(({ user, size = 'md' }) => {
  const sizeClass = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }[size];

  const getInitials = useCallback((user: UserWithRoles) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.email[0].toUpperCase();
  }, []);

  const getName = useCallback((user: UserWithRoles) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.email.split('@')[0];
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClass} bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
        {getInitials(user)}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-gray-900 text-sm truncate">{getName(user)}</span>
        <span className="text-xs text-gray-500 truncate">{user.email}</span>
      </div>
    </div>
  );
});
UserAvatar.displayName = 'UserAvatar';

// Modal para agregar usuario
const AddUserModal = memo<{
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (email: string, roleIds: string[]) => Promise<void>;
  availableRoles: Array<{ _id: string; name: RoleName; description: string }>;
  loading: boolean;
}>(({ isOpen, onClose, onAddUser, availableRoles, loading }) => {
  const [email, setEmail] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setSelectedRoleIds([]);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El formato del email no es válido');
      return;
    }

    if (selectedRoleIds.length === 0) {
      setError('Debe seleccionar al menos un rol');
      return;
    }

    try {
      await onAddUser(email, selectedRoleIds);
      onClose();
    } catch (err) {
      // Error manejado en la función principal
    }
  }, [email, selectedRoleIds, onAddUser, onClose]);

  const toggleRole = useCallback((roleId: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
    setError('');
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h3>Agregar Usuario</h3>
            <p className="modal-subtitle">Invita a un usuario a unirse a la empresa</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="close-button"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="email">Email del usuario *</label>
            <input
              id="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              disabled={loading}
              className={error && !email ? 'error' : ''}
            />
          </div>

          <div className="roles-selection">
            <h4>Seleccionar Roles *</h4>
            <div className="roles-list">
              {availableRoles.map((role) => (
                <label key={role._id} className="role-option">
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(role._id)}
                    onChange={() => toggleRole(role._id)}
                    disabled={loading}
                    className="role-checkbox"
                  />
                  <div className="role-info">
                    <div className="role-name-container">
                      <span className="role-name">{role.name}</span>
                      <RoleBadge role={role.name} size="sm" />
                    </div>
                    <p className="role-description">{role.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {selectedRoleIds.length > 0 && (
            <div className="selected-preview">
              <h4>Roles a asignar:</h4>
              <div className="selected-roles">
                {availableRoles
                  .filter(role => selectedRoleIds.includes(role._id))
                  .map(role => (
                    <RoleBadge key={role._id} role={role.name} size="sm" />
                  ))
                }
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !email || selectedRoleIds.length === 0}
              className="btn-primary"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Enviar Invitación'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .modal-subtitle {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #6b7280;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          border-radius: 4px;
        }

        .close-button:hover:not(:disabled) {
          background: #f3f4f6;
          color: #374151;
        }

        .close-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form {
          padding: 20px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input:disabled {
          background: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .form-group input.error {
          border-color: #dc3545;
        }

        .roles-selection {
          margin-bottom: 20px;
        }

        .roles-selection h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .roles-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .role-option {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .role-option:hover {
          border-color: #3b82f6;
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .role-checkbox {
          margin-top: 2px;
          accent-color: #3b82f6;
        }

        .role-checkbox:disabled {
          cursor: not-allowed;
        }

        .role-info {
          flex: 1;
        }

        .role-name-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .role-name {
          font-weight: 600;
          text-transform: capitalize;
          color: #111827;
        }

        .role-description {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
          line-height: 1.4;
        }

        .selected-preview {
          padding: 15px;
          background: #f0f9ff;
          border-radius: 6px;
          border: 1px solid #bae6fd;
          margin-bottom: 15px;
        }

        .selected-preview h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          font-weight: 600;
          color: #0369a1;
        }

        .selected-roles {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #fecaca;
          font-size: 14px;
          margin-top: 10px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding: 20px 0 0 0;
        }

        .btn-primary,
        .btn-secondary {
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          min-width: 120px;
          justify-content: center;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
});
AddUserModal.displayName = 'AddUserModal';

// Modal de edición de roles memoizado
const EditUserRolesModal = memo<{
  user: UserWithRoles | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleIds: string[]) => Promise<void>;
  availableRoles: Array<{ _id: string; name: RoleName; description: string }>;
  loading: boolean;
}>(({ user, isOpen, onClose, onSave, availableRoles, loading }) => {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string>('');

  useEffect(() => {
    if (user && isOpen) {
      const currentRoleIds = availableRoles
        .filter(role => user.companies[0]?.roles?.includes(role.name))
        .map(role => role._id);
      setSelectedRoleIds(currentRoleIds);
      setSaveError('');
    }
  }, [user, isOpen, availableRoles]);

  const toggleRole = useCallback((roleId: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
    setSaveError('');
  }, []);

  const handleSave = useCallback(async () => {
    if (selectedRoleIds.length === 0) {
      setSaveError('Debe seleccionar al menos un rol');
      return;
    }

    try {
      await onSave(selectedRoleIds);
    } catch (error) {
      console.error('Error saving roles:', error);
      setSaveError('Error al guardar los cambios. Por favor, intente nuevamente.');
    }
  }, [selectedRoleIds, onSave]);

  const handleClose = useCallback(() => {
    setSaveError('');
    onClose();
  }, [onClose]);

  if (!isOpen || !user) return null;

  const currentRoles = user.companies[0]?.roles || [];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h3>Editar Roles de Usuario</h3>
            <p className="modal-subtitle">Modifica los permisos del usuario</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="close-button"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="user-info">
            <UserAvatar user={user} size="md" />
          </div>

          <div className="current-roles-section">
            <h4>Roles Actuales:</h4>
            <div className="current-roles-list">
              {currentRoles.map(role => (
                <RoleBadge key={role} role={role} size="sm" />
              ))}
              {currentRoles.length === 0 && (
                <span className="no-roles">Sin roles asignados</span>
              )}
            </div>
          </div>

          <div className="roles-selection">
            <h4>Seleccionar Roles:</h4>
            <div className="roles-list">
              {availableRoles.map((role) => (
                <label key={role._id} className="role-option">
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(role._id)}
                    onChange={() => toggleRole(role._id)}
                    disabled={loading}
                    className="role-checkbox"
                  />
                  <div className="role-info">
                    <div className="role-name-container">
                      <span className="role-name">{role.name}</span>
                      <RoleBadge role={role.name} size="sm" />
                    </div>
                    <p className="role-description">{role.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {selectedRoleIds.length > 0 && (
            <div className="selected-preview">
              <h4>Roles a asignar:</h4>
              <div className="selected-roles">
                {availableRoles
                  .filter(role => selectedRoleIds.includes(role._id))
                  .map(role => (
                    <RoleBadge key={role._id} role={role.name} size="sm" />
                  ))
                }
              </div>
            </div>
          )}

          {saveError && (
            <div className="error-message">
              {saveError}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || selectedRoleIds.length === 0}
            className="btn-primary"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .modal-subtitle {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #6b7280;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          border-radius: 4px;
        }

        .close-button:hover:not(:disabled) {
          background: #f3f4f6;
          color: #374151;
        }

        .close-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-content {
          padding: 20px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .user-info {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .current-roles-section,
        .roles-selection {
          margin-bottom: 20px;
        }

        .current-roles-section h4,
        .roles-selection h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .current-roles-list,
        .selected-roles {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }

        .no-roles {
          color: #6b7280;
          font-style: italic;
          font-size: 14px;
        }

        .roles-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .role-option {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .role-option:hover {
          border-color: #3b82f6;
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .role-checkbox {
          margin-top: 2px;
          accent-color: #3b82f6;
        }

        .role-checkbox:disabled {
          cursor: not-allowed;
        }

        .role-info {
          flex: 1;
        }

        .role-name-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .role-name {
          font-weight: 600;
          text-transform: capitalize;
          color: #111827;
        }

        .role-description {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
          line-height: 1.4;
        }

        .selected-preview {
          padding: 15px;
          background: #f0f9ff;
          border-radius: 6px;
          border: 1px solid #bae6fd;
          margin-bottom: 15px;
        }

        .selected-preview h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          font-weight: 600;
          color: #0369a1;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #fecaca;
          font-size: 14px;
          margin-top: 10px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .btn-primary,
        .btn-secondary {
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          min-width: 120px;
          justify-content: center;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
});
EditUserRolesModal.displayName = 'EditUserRolesModal';

// Componente de fila de usuario memoizado para mejor performance
const UserRow = memo<{
  user: UserWithRoles;
  companyId: string;
  currentUserId: string | undefined;
  currentUserRoles: RoleName[];
  canManageUsers: boolean;
  canModifyUser: (user: UserWithRoles) => boolean;
  onEditRoles: (user: UserWithRoles) => void;
  onStatusChange: (userId: string, status: 'active' | 'suspended') => void;
  onDeleteUser: (userId: string) => void;
  actionLoading: string | null;
}>(({ 
  user, 
  companyId, 
  currentUserId, 
  currentUserRoles, 
  canManageUsers, 
  canModifyUser, 
  onEditRoles, 
  onStatusChange, 
  onDeleteUser, 
  actionLoading 
}) => {
  const companyData = user.companies.find(c => c.company_id === companyId);
  const userStatus = companyData?.status || 'active';
  const userRoles = companyData?.roles || [];
  const canModify = canModifyUser(user);
  const isCurrentUser = currentUserId === user.user_id;

  return (
    <tr className="user-row">
      <td className="user-info-cell">
        <UserAvatar user={user} size="sm" />
        {isCurrentUser && <span className="current-user-badge">(Tú)</span>}
      </td>
      <td className="roles-cell">
        <div className="roles-container">
          {userRoles.map(role => (
            <RoleBadge key={role} role={role} size="sm" />
          ))}
          {canModify && (
            <button
              onClick={() => onEditRoles(user)}
              disabled={actionLoading?.startsWith('roles-')}
              className="edit-button"
              title="Editar roles"
            >
              {actionLoading === `roles-${user.user_id}` ? <LoadingSpinner size="sm" /> : '✏️'}
            </button>
          )}
        </div>
      </td>
      <td className="status-cell">
        <select
          value={userStatus}
          onChange={(e) => onStatusChange(user.user_id, e.target.value as 'active' | 'suspended')}
          disabled={!canModify || actionLoading?.startsWith('status-')}
          className={`status-select ${userStatus}`}
        >
          <option value="active">🟢 Activo</option>
          <option value="suspended">🔴 Suspendido</option>
        </select>
        {actionLoading === `status-${user.user_id}` && (
          <div className="action-loading">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </td>
      {canManageUsers && (
        <td className="actions-cell">
          <button
            onClick={() => onDeleteUser(user.user_id)}
            disabled={!canModify || actionLoading?.startsWith('delete-') || isCurrentUser}
            className="delete-button"
            title={isCurrentUser ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario'}
          >
            {actionLoading === `delete-${user.user_id}` ? <LoadingSpinner size="sm" /> : '🗑️'}
          </button>
        </td>
      )}
    </tr>
  );
});
UserRow.displayName = 'UserRow';

// Componente principal UserManager
const UserManager: React.FC<UserManagerProps> = ({ companyId, companyName }) => {
  const { users, loading, error, fetchUsers, removeUserFromCompany, updateUserStatus, updateUserRoles, addUser } = useUsers(companyId, companyName);
  const { user: currentUser } = useUser();
  const { roles, fetchRoles } = useRoles();

  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUserRoles, setCurrentUserRoles] = useState<RoleName[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  // Mostrar toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
  }, []);

  // Roles disponibles para asignar - MOVIDO ARRIBA de las funciones que lo usan
  const availableRoles = useMemo(() => {
    // Si no hay roles del usuario actual, mostrar todos los roles excepto toor
    const rolesToShow = currentUserRoles.length > 0
      ? roles.filter(role => permissionService.canAssignRole(currentUserRoles, role.name))
      : roles.filter(role => role.name !== 'toor'); // Por defecto, mostrar todos excepto toor

    console.log('🎯 Roles disponibles para asignar:', rolesToShow.map(r => r.name));
    return rolesToShow;
  }, [roles, currentUserRoles]);

  // Handler para agregar usuario - CORREGIDO: usa availableRoles que ahora está definido antes
  const handleAddUser = useCallback(async (email: string, roleIds: string[]) => {
    if (!companyId || !companyName) {
      showToast('Error: No se encontró la empresa o su nombre', 'error');
      return;
    }

    setActionLoading('add-user');

    try {
      console.log('👤 Agregando usuario:', { email, roleIds, companyId, companyName });

      // Obtener el primer rol seleccionado (para compatibilidad con la API actual)
      const selectedRole = availableRoles.find(role => roleIds.includes(role._id));
      const roleName = selectedRole?.name || 'user';

      const result = await addUser({
        email,
        role_ids: roleIds,
        role_name: roleName, // ← Enviar role_name también para compatibilidad
        company_name: companyName // ← Asegurar que se envíe
      });

      if (result.success) {
        showToast('Invitación enviada exitosamente', 'success');
        setShowAddUserModal(false);
        await fetchUsers(); // Recargar lista
      } else {
        throw new Error(result.message || 'Error al agregar usuario');
      }
    } catch (err: any) {
      console.error('❌ Error agregando usuario:', err);
      showToast(err.message || 'Error al enviar invitación', 'error');
    } finally {
      setActionLoading(null);
    }
  }, [companyId, companyName, addUser, fetchUsers, showToast, availableRoles]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      if (!companyId || !currentUser?.id) {
        console.log('❌ No hay companyId o usuario actual');
        return;
      }

      try {
        console.log('🔄 Cargando datos iniciales...', { companyId, userId: currentUser.id });
        setInitialLoad(true);

        // Cargar en paralelo
        await Promise.allSettled([
          fetchUsers(),
          fetchRoles(),
          loadCurrentUserRoles()
        ]);

        console.log('✅ Datos iniciales cargados');
      } catch (err) {
        console.error('❌ Error cargando datos iniciales:', err);
        showToast('Error al cargar los datos', 'error');
      } finally {
        setInitialLoad(false);
      }
    };

    loadInitialData();
  }, [companyId, currentUser?.id]);

  // Cargar roles del usuario actual
  const loadCurrentUserRoles = useCallback(async (): Promise<void> => {
    if (!currentUser?.id || !companyId) {
      console.log('❌ No hay usuario o companyId');
      return;
    }

    try {
      console.log('🔍 Cargando roles del usuario actual...', { userId: currentUser.id, companyId });

      // Intentar múltiples fuentes de datos
      const endpoints = [
        `/api/organization/employees?user_id=${currentUser.id}`,
        `/api/organization/companies/${companyId}/user-roles?user_id=${currentUser.id}`
      ];

      let roles: RoleName[] = [];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`📊 Datos recibidos de ${endpoint}:`, data);

            // Procesar diferentes estructuras de respuesta
            if (data.companies) {
              const currentCompany = data.companies.find((comp: any) => comp.company_id === companyId);
              if (currentCompany?.roles) {
                roles = ensureRoleNames(currentCompany.roles);
                break;
              }
            } else if (data.roles) {
              roles = ensureRoleNames(data.roles);
              break;
            }
          }
        } catch (err) {
          console.warn(`⚠️ Error en endpoint ${endpoint}:`, err);
          continue;
        }
      }

      // Si no se encontraron roles en las APIs, buscar en la lista local
      if (roles.length === 0 && users.length > 0) {
        console.log('🔄 Buscando roles en lista local de usuarios...');
        const currentUserInList = users.find(u => u.user_id === currentUser.id);
        if (currentUserInList) {
          const companyData = currentUserInList.companies.find(c => c.company_id === companyId);
          roles = ensureRoleNames(companyData?.roles || []);
        }
      }

      console.log('✅ Roles finales del usuario actual:', roles);
      setCurrentUserRoles(roles);

    } catch (error) {
      console.error('❌ Error cargando roles del usuario actual:', error);
      setCurrentUserRoles([]);
      showToast('Error al cargar tus permisos', 'warning');
    }
  }, [currentUser?.id, companyId, users]);

  // Verificar si puede gestionar usuarios
  const canManageUsers = useMemo(() => {
    console.log('🔐 Verificando permisos de gestión:', {
      currentUserRoles,
      userRoles: currentUserRoles
    });

    // Si no hay roles cargados, asumir que puede gestionar (fallback para desarrollo)
    if (currentUserRoles.length === 0) {
      console.log('⚠️ No hay roles cargados, usando fallback...');
      // En desarrollo, permitir gestión para testing
      if (process.env.NODE_ENV === 'development') {
        console.log('🔓 Modo desarrollo: permitiendo gestión');
        return true;
      }
      return false;
    }

    // Permitir gestión si tiene alguno de estos roles
    const canManage = currentUserRoles.some(role =>
      ['toor', 'owner', 'admin'].includes(role)
    );

    console.log('✅ ¿Puede gestionar usuarios?:', canManage);
    return canManage;
  }, [currentUserRoles]);

  // Verificar si puede modificar un usuario específico
  const canModifyUser = useCallback((targetUser: UserWithRoles) => {
    if (!currentUser?.id) {
      console.log('🚫 No hay usuario actual');
      return false;
    }

    if (currentUser.id === targetUser.user_id) {
      console.log('🚫 No puede modificarse a sí mismo');
      return false;
    }

    const canModify = canManageUsers && currentUser.id !== targetUser.user_id;

    console.log('✅ ¿Puede modificar usuario?', canModify);
    return canModify;
  }, [currentUser?.id, canManageUsers]);

  // Handler para actualizar roles
  const handleUpdateRoles = useCallback(async (userId: string, roleIds: string[]) => {
    if (!companyId) {
      showToast('Error: No se encontró la empresa', 'error');
      return;
    }

    setActionLoading(`roles-${userId}`);

    try {
      console.log('🔄 Actualizando roles:', { userId, roleIds, companyId });

      // Obtener roles actuales del usuario objetivo
      const targetUser = users.find(u => u.user_id === userId);
      const targetUserRoles = targetUser?.companies.find(c => c.company_id === companyId)?.roles || [];

      const result = await updateUserRoles(userId, roleIds, targetUserRoles);

      if (result.success) {
        setEditingUser(null);
        showToast('Roles actualizados exitosamente', 'success');
        await fetchUsers(); // Recargar lista
      } else {
        throw new Error(result.message || 'Error actualizando roles');
      }
    } catch (err: any) {
      console.error('❌ Error actualizando roles:', err);
      showToast(err.message || 'Error al actualizar roles', 'error');
    } finally {
      setActionLoading(null);
    }
  }, [companyId, updateUserRoles, fetchUsers, users, showToast]);

  // Handler para actualizar estado
  const handleStatusChange = useCallback(async (userId: string, newStatus: 'active' | 'suspended') => {
    if (!companyId) {
      showToast('Error: No se encontró la empresa', 'error');
      return;
    }

    setActionLoading(`status-${userId}`);

    try {
      console.log('🔄 Actualizando estado:', { userId, newStatus, companyId });

      // Obtener roles actuales del usuario objetivo
      const targetUser = users.find(u => u.user_id === userId);
      const targetUserRoles = targetUser?.companies.find(c => c.company_id === companyId)?.roles || [];

      const result = await updateUserStatus(userId, newStatus, targetUserRoles);

      if (result.success) {
        showToast(`Usuario ${newStatus === 'active' ? 'activado' : 'suspendido'} exitosamente`, 'success');
        await fetchUsers(); // Recargar lista
      } else {
        throw new Error(result.message || 'Error actualizando estado');
      }
    } catch (err: any) {
      console.error('❌ Error actualizando estado:', err);
      showToast(err.message || 'Error al actualizar estado', 'error');
    } finally {
      setActionLoading(null);
    }
  }, [companyId, updateUserStatus, fetchUsers, users, showToast]);

  // Handler para eliminar usuario
  const handleDeleteUser = useCallback(async (userId: string) => {
    if (!companyId) {
      showToast('Error: No se encontró la empresa', 'error');
      return;
    }

    const targetUser = users.find(u => u.user_id === userId);
    const userName = targetUser?.first_name && targetUser?.last_name 
      ? `${targetUser.first_name} ${targetUser.last_name}`
      : targetUser?.email || 'el usuario';

    if (!confirm(`¿Estás seguro de que quieres eliminar a ${userName} de la empresa?`)) {
      return;
    }

    setActionLoading(`delete-${userId}`);

    try {
      console.log('🗑️ Eliminando usuario:', { userId, companyId });

      // Obtener roles actuales del usuario objetivo
      const targetUserRoles = targetUser?.companies.find(c => c.company_id === companyId)?.roles || [];

      const result = await removeUserFromCompany(userId, targetUserRoles);

      if (result.success) {
        showToast('Usuario eliminado exitosamente', 'success');
        await fetchUsers(); // Recargar lista
      } else {
        throw new Error(result.message || 'Error eliminando usuario');
      }
    } catch (err: any) {
      console.error('❌ Error eliminando usuario:', err);
      showToast(err.message || 'Error al eliminar usuario', 'error');
    } finally {
      setActionLoading(null);
    }
  }, [companyId, removeUserFromCompany, fetchUsers, users, showToast]);

  // Filtrar usuarios por búsqueda
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    const searchLower = searchTerm.toLowerCase();
    return users.filter(user =>
      user.email.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower)
    );
  }, [users, searchTerm]);

  // Recargar datos
  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([
        fetchUsers(),
        fetchRoles(),
        loadCurrentUserRoles()
      ]);
      showToast('Datos actualizados', 'success');
    } catch (err) {
      console.error('Error recargando datos:', err);
      showToast('Error al actualizar datos', 'error');
    }
  }, [fetchUsers, fetchRoles, loadCurrentUserRoles, showToast]);

  // Handlers memoizados para las filas
  const handleEditRoles = useCallback((user: UserWithRoles) => {
    setEditingUser(user);
  }, []);

  const handleAddUserClick = useCallback(() => {
    setShowAddUserModal(true);
  }, []);

  if (initialLoad) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="lg" />
        <p>Cargando gestión de usuarios...</p>
      </div>
    );
  }

  return (
    <div className="user-manager">
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="header">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p>Administra los usuarios de <strong>{companyName}</strong></p>
          <div className="debug-info">
            <small>User ID: {currentUser?.id}</small>
            <small>Company ID: {companyId}</small>
            <small>Tus roles: {currentUserRoles.join(', ') || 'No asignados'}</small>
          </div>
        </div>
        <div className="user-info">
          <div className="permissions-info">
            <p><strong>Permisos de gestión:</strong> {canManageUsers ? '✅ Activos' : '❌ Limitados'}</p>
          </div>
          <div className="action-buttons">
            {canManageUsers && (
              <button 
                onClick={handleAddUserClick}
                className="primary-button"
                disabled={loading}
              >
                + Agregar Usuario
              </button>
            )}
            <button 
              onClick={handleRefresh} 
              disabled={loading}
              className="refresh-button"
            >
              {loading ? <LoadingSpinner size="sm" /> : '🔄 Actualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="search-section">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="clear-search"
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>
        <div className="user-count">
          {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="table-container">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios en la empresa'}
            {canManageUsers && !searchTerm && (
              <button 
                onClick={handleAddUserClick}
                className="primary-button"
                style={{ marginTop: '16px' }}
              >
                + Agregar Primer Usuario
              </button>
            )}
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Roles</th>
                <th>Estado</th>
                {canManageUsers && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <UserRow
                  key={user.user_id}
                  user={user}
                  companyId={companyId}
                  currentUserId={currentUser?.id}
                  currentUserRoles={currentUserRoles}
                  canManageUsers={canManageUsers}
                  canModifyUser={canModifyUser}
                  onEditRoles={handleEditRoles}
                  onStatusChange={handleStatusChange}
                  onDeleteUser={handleDeleteUser}
                  actionLoading={actionLoading}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para agregar usuario */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onAddUser={handleAddUser}
        availableRoles={availableRoles}
        loading={actionLoading === 'add-user'}
      />

      {/* Modal de edición de roles */}
      <EditUserRolesModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={(roleIds) => {
          if (editingUser) {
            return handleUpdateRoles(editingUser.user_id, roleIds);
          }
          return Promise.reject(new Error('No hay usuario seleccionado'));
        }}
        availableRoles={availableRoles}
        loading={actionLoading?.startsWith('roles-') || false}
      />

      <style jsx>{`
        .user-manager {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
        }

        .header h2 {
          margin: 0 0 8px 0;
          color: #111827;
          font-size: 24px;
          font-weight: 700;
        }

        .header p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .debug-info {
          margin-top: 12px;
          padding: 8px;
          background: #f3f4f6;
          border-radius: 6px;
          border-left: 3px solid #3b82f6;
        }

        .debug-info small {
          display: block;
          color: #4b5563;
          font-size: 11px;
          font-family: 'Monaco', 'Consolas', monospace;
          line-height: 1.4;
        }

        .user-info {
          text-align: right;
          font-size: 14px;
          min-width: 250px;
        }

        .permissions-info p {
          margin: 0 0 12px 0;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .primary-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 120px;
          justify-content: center;
        }

        .primary-button:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }

        .primary-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .refresh-button {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 100px;
          justify-content: center;
        }

        .refresh-button:hover:not(:disabled) {
          background: #e5e7eb;
          border-color: #9ca3af;
        }

        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .search-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 20px;
        }

        .search-input-container {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-input {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .clear-search:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .user-count {
          background: #f8fafc;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          color: #4b5563;
          border: 1px solid #e5e7eb;
          white-space: nowrap;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          background: #f9fafb;
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .users-table td {
          padding: 20px;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: middle;
        }

        .user-row:hover {
          background: #f9fafb;
        }

        .user-row:last-child td {
          border-bottom: none;
        }

        .user-info-cell {
          min-width: 250px;
          position: relative;
        }

        .current-user-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #3b82f6;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .roles-container {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .edit-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          opacity: 0.7;
          transition: all 0.2s;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
        }

        .edit-button:hover:not(:disabled) {
          opacity: 1;
          background: #f3f4f6;
          transform: scale(1.1);
        }

        .edit-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .status-cell {
          position: relative;
          min-width: 140px;
        }

        .status-select {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 120px;
          font-weight: 500;
          appearance: none;
          background: white;
        }

        .status-select.active {
          background: #d1fae5;
          color: #065f46;
          border-color: #a7f3d0;
        }

        .status-select.suspended {
          background: #fee2e2;
          color: #991b1b;
          border-color: #fecaca;
        }

        .status-select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .status-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f3f4f6;
        }

        .action-loading {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .actions-cell {
          text-align: center;
          width: 80px;
        }

        .delete-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          opacity: 0.7;
          transition: all 0.2s;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          margin: 0 auto;
        }

        .delete-button:hover:not(:disabled) {
          opacity: 1;
          background: #fee2e2;
          transform: scale(1.1);
        }

        .delete-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: #6b7280;
          font-size: 16px;
          background: #f9fafb;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 16px;
          color: #6b7280;
        }

        .loading-container p {
          margin: 0;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .user-manager {
            padding: 16px;
          }

          .header {
            flex-direction: column;
            gap: 16px;
            padding: 20px;
          }

          .user-info {
            text-align: left;
            min-width: auto;
            width: 100%;
          }

          .action-buttons {
            justify-content: flex-start;
          }

          .search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-input-container {
            max-width: none;
          }

          .users-table {
            display: block;
            overflow-x: auto;
          }

          .user-info-cell {
            min-width: 200px;
          }

          .status-cell {
            min-width: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserManager;