// components/CompanyRolesTabs/CompanyRolesTabs.tsx
'use client';

import React, { useMemo, useCallback } from 'react';
import { BuildingIcon } from 'lucide-react';
import { 
  PersonIcon, 
  StarIcon, 
  LockClosedIcon,
  EnvelopeClosedIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  GearIcon,
  FileTextIcon,
  DashboardIcon,
  IdCardIcon,
  EyeOpenIcon,

} from '@radix-ui/react-icons';
import { RoleName, ROLE_NAMES, HIERARCHY_LEVELS } from '@/organization-module/types/organization';
import TabsComponent from '../Tabs/Tabs';

export interface CompanyRole {
  company_id: string;
  company_name: string;
  roles: RoleName[];
  status: 'active' | 'inactive' | string;
}

export interface CompanyRolesTabsProps {
  companies: CompanyRole[];
  userEmail: string;
  userName: string;
}

interface RoleStyle {
  background: string;
  color: string;
  border: string;
}

// Memoizar estilos de roles para evitar recreación en cada render
const ROLE_STYLES: Record<RoleName, RoleStyle> = {
  [ROLE_NAMES.OWNER]: { 
    background: 'rgba(212, 175, 55, 0.1)', 
    color: '#d4af37', 
    border: 'rgba(212, 175, 55, 0.2)' 
  },
  [ROLE_NAMES.ADMIN]: { 
    background: 'rgba(30, 64, 175, 0.1)', 
    color: '#1e40af', 
    border: 'rgba(30, 64, 175, 0.2)' 
  },
  [ROLE_NAMES.TOOR]: { 
    background: 'rgba(220, 38, 38, 0.1)', 
    color: '#dc2626', 
    border: 'rgba(220, 38, 38, 0.2)' 
  },
  [ROLE_NAMES.USER]: { 
    background: 'rgba(138, 154, 91, 0.1)', 
    color: '#8a9a5b', 
    border: 'rgba(138, 154, 91, 0.2)' 
  },
  [ROLE_NAMES.GUEST]: { 
    background: 'rgba(107, 114, 128, 0.1)', 
    color: '#6b7280', 
    border: 'rgba(107, 114, 128, 0.2)' 
  }
};

// Memoizar nombres de display
const ROLE_DISPLAY_NAMES: Record<RoleName, string> = {
  [ROLE_NAMES.TOOR]: 'Super Admin',
  [ROLE_NAMES.OWNER]: 'Propietario',
  [ROLE_NAMES.ADMIN]: 'Administrador',
  [ROLE_NAMES.USER]: 'Usuario',
  [ROLE_NAMES.GUEST]: 'Invitado'
};

// Memoizar iconos de roles
const ROLE_ICONS: Record<RoleName, React.ReactNode> = {
  [ROLE_NAMES.OWNER]: <StarIcon />,
  [ROLE_NAMES.ADMIN]: <LockClosedIcon />,
  [ROLE_NAMES.TOOR]: <GearIcon />,
  [ROLE_NAMES.USER]: <PersonIcon />,
  [ROLE_NAMES.GUEST]: <EyeOpenIcon />
};

export const CompanyRolesTabs: React.FC<CompanyRolesTabsProps> = ({
  companies,
  userEmail,
  userName
}) => {
  // Función para obtener el rol principal (más alto en jerarquía)
  const getPrimaryRole = useCallback((roles: RoleName[]): RoleName => {
    if (roles.length === 0) return ROLE_NAMES.USER;
    
    return roles.reduce((highest, current) => {
      return HIERARCHY_LEVELS[current] > HIERARCHY_LEVELS[highest] ? current : highest;
    }, roles[0]);
  }, []);

  // Función para obtener el contenido específico por rol
  const getRoleSpecificContent = useCallback((company: CompanyRole) => {
    const isToor = company.roles.includes(ROLE_NAMES.TOOR);
    const isOwner = company.roles.includes(ROLE_NAMES.OWNER);
    const isAdmin = company.roles.includes(ROLE_NAMES.ADMIN);
    const isUser = company.roles.includes(ROLE_NAMES.USER);
    const isGuest = company.roles.includes(ROLE_NAMES.GUEST);

    // Contenido para TOOR (Super Admin)
    if (isToor) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ 
            padding: '1.5rem', 
            borderRadius: '16px',
            background: 'rgba(220, 38, 38, 0.05)',
            border: '1px solid rgba(220, 38, 38, 0.2)'
          }}>
            <h4 style={{ 
              fontWeight: 500, 
              color: '#dc2626',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <GearIcon />
              Panel de Super Administrador
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <button style={{ 
                padding: '12px 16px',
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '12px',
                color: '#dc2626',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <DashboardIcon />
                Todas las Empresas
              </button>
              <button style={{ 
                padding: '12px 16px',
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '12px',
                color: '#dc2626',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <PersonIcon />
                Gestión Global
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Contenido para Owner
    if (isOwner) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ 
            padding: '1.5rem', 
            borderRadius: '16px',
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <h4 style={{ 
              fontWeight: 500, 
              color: '#d4af37',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <StarIcon />
              Acciones de Propietario
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button style={{ 
                padding: '12px 16px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                color: '#d4af37',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <GearIcon />
                Gestionar Empresa
              </button>
              <button style={{ 
                padding: '12px 16px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                color: '#d4af37',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <IdCardIcon />
                Configurar Permisos
              </button>
            </div>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ 
              padding: '1.25rem', 
              borderRadius: '12px',
              background: 'rgba(30, 64, 175, 0.05)',
              border: '1px solid rgba(30, 64, 175, 0.1)'
            }}>
              <h5 style={{ 
                fontWeight: 500, 
                color: '#1e40af', 
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <DashboardIcon />
                Estadísticas
              </h5>
              <p style={{ color: '#666', fontSize: '14px' }}>Usuarios activos: <strong>15</strong></p>
              <p style={{ color: '#666', fontSize: '14px' }}>Proyectos: <strong>8</strong></p>
            </div>
            
            <div style={{ 
              padding: '1.25rem', 
              borderRadius: '12px',
              background: 'rgba(138, 154, 91, 0.05)',
              border: '1px solid rgba(138, 154, 91, 0.1)'
            }}>
              <h5 style={{ 
                fontWeight: 500, 
                color: '#8a9a5b', 
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FileTextIcon />
                Acciones Rápidas
              </h5>
              <p style={{ color: '#666', fontSize: '14px' }}>Facturación pendiente</p>
              <p style={{ color: '#666', fontSize: '14px' }}>Soporte requerido: <strong>2</strong></p>
            </div>
          </div>
        </div>
      );
    }

    // Contenido para Admin
    if (isAdmin) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ 
            padding: '1.5rem', 
            borderRadius: '16px',
            background: 'rgba(30, 64, 175, 0.05)',
            border: '1px solid rgba(30, 64, 175, 0.2)'
          }}>
            <h4 style={{ 
              fontWeight: 500, 
              color: '#1e40af',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <LockClosedIcon />
              Panel de Administración
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <button style={{ 
                padding: '12px 16px',
                background: 'rgba(30, 64, 175, 0.1)',
                border: '1px solid rgba(30, 64, 175, 0.3)',
                borderRadius: '12px',
                color: '#1e40af',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <PersonIcon />
                Gestionar Usuarios
              </button>
              <button style={{ 
                padding: '12px 16px',
                background: 'rgba(30, 64, 175, 0.1)',
                border: '1px solid rgba(30, 64, 175, 0.3)',
                borderRadius: '12px',
                color: '#1e40af',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <GearIcon />
                Configurar Sistema
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Contenido para User
    if (isUser) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ 
            padding: '1.5rem', 
            borderRadius: '16px',
            background: 'rgba(138, 154, 91, 0.05)',
            border: '1px solid rgba(138, 154, 91, 0.2)'
          }}>
            <h4 style={{ 
              fontWeight: 500, 
              color: '#8a9a5b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <PersonIcon />
              Panel de Usuario
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <button style={{ 
                padding: '12px 16px',
                background: 'rgba(138, 154, 91, 0.1)',
                border: '1px solid rgba(138, 154, 91, 0.3)',
                borderRadius: '12px',
                color: '#8a9a5b',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <DashboardIcon />
                Mis Proyectos
              </button>
              <button style={{ 
                padding: '12px 16px',
                background: 'rgba(138, 154, 91, 0.1)',
                border: '1px solid rgba(138, 154, 91, 0.3)',
                borderRadius: '12px',
                color: '#8a9a5b',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FileTextIcon />
                Documentos
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Contenido para Guest
    if (isGuest) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ 
            padding: '1.5rem', 
            borderRadius: '16px',
            background: 'rgba(107, 114, 128, 0.05)',
            border: '1px solid rgba(107, 114, 128, 0.2)'
          }}>
            <h4 style={{ 
              fontWeight: 500, 
              color: '#6b7280',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <EyeOpenIcon />
              Acceso de Invitado
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <button style={{ 
                padding: '12px 16px',
                background: 'rgba(107, 114, 128, 0.1)',
                border: '1px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '12px',
                color: '#6b7280',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FileTextIcon />
                Ver Documentos
              </button>
              <button style={{ 
                padding: '12px 16px',
                background: 'rgba(107, 114, 128, 0.1)',
                border: '1px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '12px',
                color: '#6b7280',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <DashboardIcon />
                Proyectos Públicos
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }, []);

  // Crear los tabs basados en las empresas
  const tabs = useMemo(() => {
    return companies.map((company) => {
      const primaryRole = getPrimaryRole(company.roles);

      return {
        value: company.company_id,
        label: company.company_name,
        icon: <BuildingIcon />,
        className: `${primaryRole.toLowerCase()}Tab`,
        content: (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1.5rem',
            width: '100%'
          }}>
            {/* Header de la empresa */}
            <div>
              <h3 style={{ 
                fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
                fontWeight: 400, 
                color: '#1a1a1a', 
                marginBottom: '0.5rem'
              }}>
                {company.company_name}
              </h3>
              <p style={{ 
                color: '#666', 
                fontSize: 'clamp(14px, 3vw, 16px)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <EnvelopeClosedIcon />
                {userEmail}
              </p>
              
              {/* Badges de roles */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {company.roles.map((role, index) => {
                  const roleStyle = ROLE_STYLES[role];
                  return (
                    <span
                      key={`${company.company_id}-${role}-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '6px 12px',
                        background: roleStyle.background,
                        color: roleStyle.color,
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 500,
                        border: `1px solid ${roleStyle.border}`
                      }}
                    >
                      {ROLE_ICONS[role]}
                      {ROLE_DISPLAY_NAMES[role]}
                    </span>
                  );
                })}
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '6px 12px',
                  background: company.status === 'active' ? 'rgba(72, 187, 120, 0.1)' : 'rgba(237, 137, 54, 0.1)',
                  color: company.status === 'active' ? '#48BB78' : '#ED8936',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: company.status === 'active' ? '1px solid rgba(72, 187, 120, 0.2)' : '1px solid rgba(237, 137, 54, 0.2)'
                }}>
                  {company.status === 'active' ? <CheckCircledIcon /> : <CrossCircledIcon />}
                  {company.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            {/* Contenido específico por rol */}
            {getRoleSpecificContent(company)}

            {/* Información general */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ 
                padding: '1rem', 
                borderRadius: '12px',
                background: 'rgba(248, 244, 240, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.5)'
              }}>
                <h5 style={{ 
                  fontWeight: 500, 
                  color: '#5d4e75', 
                  marginBottom: '0.5rem', 
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <IdCardIcon />
                  ID de Empresa
                </h5>
                <p style={{ color: '#666', fontSize: '13px', wordBreak: 'break-all' }}>
                  {company.company_id}
                </p>
              </div>
            </div>
          </div>
        )
      };
    });
  }, [companies, userEmail, getPrimaryRole, getRoleSpecificContent]);

  const defaultTabValue = companies[0]?.company_id;

  if (companies.length === 0) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        background: 'rgba(254, 254, 254, 0.8)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)'
      }}>
        <BuildingIcon style={{ width: '48px', height: '48px', color: '#666', opacity: 0.5, marginBottom: '1rem' }} />
        <h3 style={{ color: '#666', marginBottom: '0.5rem', fontWeight: 500 }}>No tienes empresas</h3>
        <p style={{ color: '#999', fontSize: '14px' }}>No estás asociado a ninguna empresa actualmente.</p>
      </div>
    );
  }

  return (
    <TabsComponent 
      tabs={tabs}
      defaultValue={defaultTabValue}
      activationMode="automatic"
    />
  );
};

export default React.memo(CompanyRolesTabs);