import React, { useState, useEffect } from 'react';
import { permissionService, UserPermissions } from '../services/permissionService';

interface PermissionManagerProps {
  userId: string;
  empresaId: string;
  modules: string[];
  availableActions: string[];
}

export const PermissionManager: React.FC<PermissionManagerProps> = ({
  userId,
  empresaId,
  modules,
  availableActions
}) => {
  const [permissions, setPermissions] = useState<UserPermissions>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, [userId, empresaId]);

  const loadPermissions = async () => {
    setLoading(true);
    const userPermissions = await permissionService.getUserPermissions(userId, empresaId);
    setPermissions(userPermissions);
    setLoading(false);
  };

  const handlePermissionChange = (module: string, action: string, checked: boolean) => {
    setPermissions(prev => {
      const modulePermissions = prev[module] || [];
      
      if (checked) {
        return {
          ...prev,
          [module]: [...modulePermissions, action]
        };
      } else {
        return {
          ...prev,
          [module]: modulePermissions.filter(a => a !== action)
        };
      }
    });
  };

  const savePermissions = async () => {
    setSaving(true);
    const success = await permissionService.updateUserPermissions(
      userId, 
      empresaId, 
      permissions
    );
    
    if (success) {
      alert('Permisos actualizados correctamente');
    } else {
      alert('Error al actualizar permisos');
    }
    setSaving(false);
  };

  if (loading) {
    return <div>Cargando permisos...</div>;
  }

  return (
    <div className="permission-manager">
      <h3>Gestión de Permisos</h3>
      
      {modules.map(module => (
        <div key={module} className="module-section">
          <h4>{module.toUpperCase()}</h4>
          <div className="permissions-grid">
            {availableActions.map(action => (
              <label key={action} className="permission-checkbox">
                <input
                  type="checkbox"
                  checked={permissions[module]?.includes(action) || false}
                  onChange={(e) => 
                    handlePermissionChange(module, action, e.target.checked)
                  }
                />
                {action}
              </label>
            ))}
          </div>
        </div>
      ))}
      
      <button 
        onClick={savePermissions} 
        disabled={saving}
        className="save-button"
      >
        {saving ? 'Guardando...' : 'Guardar Permisos'}
      </button>

      <style jsx>{`
        .permission-manager {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .module-section {
          margin-bottom: 20px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 5px;
        }
        .permissions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        .permission-checkbox {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .save-button {
          margin-top: 20px;
          padding: 10px 20px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .save-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};