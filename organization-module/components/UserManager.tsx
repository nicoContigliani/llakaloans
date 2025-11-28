// organization-module/components/UserManager.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useUser } from '@clerk/nextjs';
import { useRoles } from '../hooks/useRoles';
import { permissionService } from '../services/permissionService';
import { RoleName, UserWithRoles } from '../types/organization';
import styles from './UserManager.module.css';

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
    sm: styles.spinnerSm,
    md: styles.spinnerMd,
    lg: styles.spinnerLg
  }[size];

  return (
    <div className={`${styles.spinner} ${sizeClass}`} />
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

  const toastClass = {
    success: styles.toastSuccess,
    error: styles.toastError,
    warning: styles.toastWarning
  }[type];

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }[type];

  return (
    <div className={`${styles.toast} ${toastClass}`}>
      <div className={styles.toastContent}>
        <span>{icons}</span>
        <p className={styles.toastMessage}>{message}</p>
        <button
          onClick={onClose}
          className={styles.toastClose}
          aria-label="Cerrar notificación"
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
  const colorClass: Record<RoleName, string> = {
    'toor': styles.roleToor,
    'owner': styles.roleOwner,
    'admin': styles.roleAdmin,
    'user': styles.roleUser,
    'guest': styles.roleGuest
  };

  const sizeClass = {
    sm: styles.roleBadgeSm,
    md: styles.roleBadgeMd
  }[size];

  return (
    <span
      className={`${styles.roleBadge} ${colorClass[role]} ${sizeClass}`}
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
    sm: styles.avatarSm,
    md: styles.avatarMd,
    lg: styles.avatarLg
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
    <div className={styles.userAvatar}>
      <div className={`${styles.avatar} ${sizeClass}`}>
        {getInitials(user)}
      </div>
      <div className={styles.userDetails}>
        <span className={styles.userName}>{getName(user)}</span>
        <span className={styles.userEmail}>{user.email}</span>
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
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Agregar Usuario</h3>
            <p className={styles.modalSubtitle}>Invita a un usuario a unirse a la empresa</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className={styles.closeButton}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email del usuario *
            </label>
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
              className={`${styles.formInput} ${error && !email ? styles.error : ''}`}
            />
            <p className={styles.formHelp}>
              El usuario recibirá una invitación por email para unirse a la empresa
            </p>
          </div>

          <div className={styles.rolesSelection}>
            <h4 className={styles.sectionTitle}>Seleccionar Roles *</h4>
            <p className={styles.sectionDescription}>
              Selecciona uno o más roles para asignar al usuario
            </p>
            
            {availableRoles.length === 0 ? (
              <div className={styles.noRoles}>
                <p>No hay roles disponibles para asignar</p>
                <p className={styles.noRolesHelp}>
                  No tienes permisos para asignar roles o no hay roles configurados
                </p>
              </div>
            ) : (
              <div className={styles.rolesList}>
                {availableRoles.map((role) => (
                  <label key={role._id} className={styles.roleOption}>
                    <input
                      type="checkbox"
                      checked={selectedRoleIds.includes(role._id)}
                      onChange={() => toggleRole(role._id)}
                      disabled={loading}
                      className={styles.roleCheckbox}
                    />
                    <div className={styles.roleInfo}>
                      <div className={styles.roleNameContainer}>
                        <span className={styles.roleName}>{role.name}</span>
                        <RoleBadge role={role.name} size="sm" />
                      </div>
                      <p className={styles.roleDescription}>{role.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedRoleIds.length > 0 && (
            <div className={styles.selectedPreview}>
              <h4 className={styles.sectionTitle}>Roles a asignar</h4>
              <div className={styles.selectedRoles}>
                {availableRoles
                  .filter(role => selectedRoleIds.includes(role._id))
                  .map(role => (
                    <RoleBadge key={role._id} role={role.name} size="sm" />
                  ))
                }
              </div>
              <p className={styles.selectedHelp}>
                El usuario recibirá permisos asociados a estos roles
              </p>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={styles.secondaryButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !email || selectedRoleIds.length === 0}
              className={styles.primaryButton}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Enviar Invitación'}
            </button>
          </div>
        </form>
      </div>
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
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Editar Roles de Usuario</h3>
            <p className={styles.modalSubtitle}>Modifica los permisos del usuario</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className={styles.closeButton}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.userInfo}>
            <UserAvatar user={user} size="md" />
          </div>

          <div className={styles.currentRolesSection}>
            <h4 className={styles.sectionTitle}>Roles Actuales</h4>
            <div className={styles.currentRolesList}>
              {currentRoles.map(role => (
                <RoleBadge key={role} role={role} size="sm" />
              ))}
              {currentRoles.length === 0 && (
                <span className={styles.noRoles}>Sin roles asignados</span>
              )}
            </div>
          </div>

          <div className={styles.rolesSelection}>
            <h4 className={styles.sectionTitle}>Seleccionar Roles</h4>
            <p className={styles.sectionDescription}>
              Selecciona los roles que deseas asignar al usuario
            </p>
            
            {availableRoles.length === 0 ? (
              <div className={styles.noRoles}>
                <p>No hay roles disponibles para asignar</p>
                <p className={styles.noRolesHelp}>
                  No tienes permisos para modificar roles o no hay roles configurados
                </p>
              </div>
            ) : (
              <div className={styles.rolesList}>
                {availableRoles.map((role) => (
                  <label key={role._id} className={styles.roleOption}>
                    <input
                      type="checkbox"
                      checked={selectedRoleIds.includes(role._id)}
                      onChange={() => toggleRole(role._id)}
                      disabled={loading}
                      className={styles.roleCheckbox}
                    />
                    <div className={styles.roleInfo}>
                      <div className={styles.roleNameContainer}>
                        <span className={styles.roleName}>{role.name}</span>
                        <RoleBadge role={role.name} size="sm" />
                      </div>
                      <p className={styles.roleDescription}>{role.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedRoleIds.length > 0 && (
            <div className={styles.selectedPreview}>
              <h4 className={styles.sectionTitle}>Roles a asignar</h4>
              <div className={styles.selectedRoles}>
                {availableRoles
                  .filter(role => selectedRoleIds.includes(role._id))
                  .map(role => (
                    <RoleBadge key={role._id} role={role.name} size="sm" />
                  ))
                }
              </div>
              <p className={styles.selectedHelp}>
                Estos roles reemplazarán los roles actuales del usuario
              </p>
            </div>
          )}

          {saveError && (
            <div className={styles.errorMessage}>
              {saveError}
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className={styles.secondaryButton}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || selectedRoleIds.length === 0}
            className={styles.primaryButton}
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Guardar Cambios'}
          </button>
        </div>
      </div>
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
    <tr className={styles.userRow}>
      <td className={styles.userInfoCell}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <UserAvatar user={user} size="sm" />
          {isCurrentUser && <span className={styles.currentUserBadge}>(Tú)</span>}
        </div>
      </td>
      <td className={styles.rolesCell}>
        <div className={styles.rolesContainer}>
          {userRoles.map(role => (
            <RoleBadge key={role} role={role} size="sm" />
          ))}
          {canModify && (
            <button
              onClick={() => onEditRoles(user)}
              disabled={actionLoading?.startsWith('roles-')}
              className={styles.editButton}
              title="Editar roles"
            >
              {actionLoading === `roles-${user.user_id}` ? <LoadingSpinner size="sm" /> : '✏️'}
            </button>
          )}
        </div>
      </td>
      <td className={styles.statusCell}>
        <select
          value={userStatus}
          onChange={(e) => onStatusChange(user.user_id, e.target.value as 'active' | 'suspended')}
          disabled={!canModify || actionLoading?.startsWith('status-')}
          className={`${styles.statusSelect} ${userStatus === 'active' ? styles.active : styles.suspended}`}
        >
          <option value="active">🟢 Activo</option>
          <option value="suspended">🔴 Suspendido</option>
        </select>
        {actionLoading === `status-${user.user_id}` && (
          <div className={styles.actionLoading}>
            <LoadingSpinner size="sm" />
          </div>
        )}
      </td>
      {canManageUsers && (
        <td className={styles.actionsCell}>
          <button
            onClick={() => onDeleteUser(user.user_id)}
            disabled={!canModify || actionLoading?.startsWith('delete-') || isCurrentUser}
            className={styles.deleteButton}
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

  // Roles disponibles para asignar
  const availableRoles = useMemo(() => {
    // Si no hay roles del usuario actual, mostrar todos los roles excepto toor
    const rolesToShow = currentUserRoles.length > 0
      ? roles.filter(role => permissionService.canAssignRole(currentUserRoles, role.name))
      : roles.filter(role => role.name !== 'toor'); // Por defecto, mostrar todos excepto toor

    console.log('🎯 Roles disponibles para asignar:', rolesToShow.map(r => r.name));
    return rolesToShow;
  }, [roles, currentUserRoles]);

  // Handler para agregar usuario
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
        role_name: roleName,
        company_name: companyName
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
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="lg" />
        <p className={styles.loadingText}>Cargando gestión de usuarios...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Gestión de Usuarios</h2>
          <p className={styles.subtitle}>Administra los usuarios de <strong>{companyName}</strong></p>
          <div className={styles.debugInfo}>
            <small className={styles.debugText}>User ID: {currentUser?.id}</small>
            <small className={styles.debugText}>Company ID: {companyId}</small>
            <small className={styles.debugText}>Tus roles: {currentUserRoles.join(', ') || 'No asignados'}</small>
          </div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.permissionsInfo}>
            <p><strong>Permisos de gestión:</strong> {canManageUsers ? '✅ Activos' : '❌ Limitados'}</p>
          </div>
          <div className={styles.actionButtons}>
            {canManageUsers && (
              <button 
                onClick={handleAddUserClick}
                className={styles.primaryButton}
                disabled={loading}
              >
                + Agregar Usuario
              </button>
            )}
            <button 
              onClick={handleRefresh} 
              disabled={loading}
              className={styles.refreshButton}
            >
              {loading ? <LoadingSpinner size="sm" /> : '🔄 Actualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className={styles.searchSection}>
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={styles.clearSearch}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>
        <div className={styles.userCount}>
          {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className={styles.tableContainer}>
        {filteredUsers.length === 0 ? (
          <div className={styles.emptyState}>
            {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios en la empresa'}
            {canManageUsers && !searchTerm && (
              <button 
                onClick={handleAddUserClick}
                className={styles.primaryButton}
                style={{ marginTop: '16px' }}
              >
                + Agregar Primer Usuario
              </button>
            )}
          </div>
        ) : (
          <table className={styles.usersTable}>
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
    </div>
  );
};

export default UserManager;