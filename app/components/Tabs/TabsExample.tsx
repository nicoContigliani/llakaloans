// examples/TabsExample.tsx
'use client';

import React, { useState } from 'react';
import { 
  PersonIcon, 
  GearIcon, 
  BellIcon,
  StarIcon,
  LockClosedIcon,
  CameraIcon,
  EnvelopeClosedIcon,
  MobileIcon
} from '@radix-ui/react-icons';
import TabsComponent from './Tabs';

export const TabsExample = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const ProfileContent = () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: '1.5rem',
      width: '100%'
    }}>
      <div>
        <h3 style={{ 
          fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
          fontWeight: 400, 
          color: '#ffffff', 
          marginBottom: '0.75rem',
          letterSpacing: '-0.3px',
          lineHeight: '1.2'
        }}>
          Perfil Personal
        </h3>
        <p style={{ 
          color: '#666', 
          fontSize: 'clamp(14px, 3vw, 16px)',
          lineHeight: '1.5',
          fontWeight: 300
        }}>
          Gestiona tu información personal y configura tus preferencias.
        </p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
        gap: '1rem',
        width: '100%'
      }}>
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '16px',
          background: 'rgba(248, 244, 240, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <PersonIcon style={{ color: '#5d4e75', width: '20px', height: '20px' }} />
            <h4 style={{ 
              fontWeight: 500, 
              color: '#5d4e75',
              fontSize: '16px',
              margin: 0
            }}>
              Información
            </h4>
          </div>
          <div style={{ fontSize: '15px', color: '#666', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <EnvelopeClosedIcon style={{ width: '16px', height: '16px' }} />
              <span>usuario@ejemplo.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MobileIcon style={{ width: '16px', height: '16px' }} />
              <span>+1 234 567 890</span>
            </div>
          </div>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '16px',
          background: 'rgba(138, 154, 91, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <StarIcon style={{ color: '#8a9a5b', width: '20px', height: '20px' }} />
            <h4 style={{ 
              fontWeight: 500, 
              color: '#8a9a5b',
              fontSize: '16px',
              margin: 0
            }}>
              Estado
            </h4>
          </div>
          <div style={{ fontSize: '15px', color: '#666', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '0.75rem' }}>✅ Verificación completada</div>
            <div style={{ marginBottom: '0.75rem' }}>🟢 Cuenta activa</div>
            <div>📅 Miembro desde 2024</div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsContent = () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <div>
        <h3 style={{ 
          fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
          fontWeight: 400, 
          color: '#1a1a1a', 
          marginBottom: '0.75rem' 
        }}>
          Configuración
        </h3>
        <p style={{ 
          color: '#666', 
          fontSize: 'clamp(14px, 3vw, 16px)',
          lineHeight: '1.5'
        }}>
          Personaliza tu experiencia en la aplicación.
        </p>
      </div>

      <div style={{ 
        background: 'rgba(248, 244, 240, 0.4)', 
        padding: '1.5rem', 
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.5)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {['Notificaciones por email', 'Modo oscuro automático', 'Sincronización en la nube'].map((setting, index) => (
            <label key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              cursor: 'pointer',
              padding: '0.5rem 0'
            }}>
              <input 
                type="checkbox" 
                style={{ 
                  width: '20px', 
                  height: '20px',
                  accentColor: '#1e40af'
                }} 
                defaultChecked={index === 1}
              />
              <span style={{ 
                color: '#1a1a1a', 
                fontWeight: 400,
                fontSize: '15px'
              }}>
                {setting}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      value: 'profile',
      label: 'Perfil',
      icon: <PersonIcon />,
      content: <ProfileContent />
    },
    {
      value: 'settings',
      label: 'Ajustes',
      icon: <GearIcon />,
      content: <SettingsContent />
    },
    {
      value: 'notifications',
      label: 'Alertas',
      icon: <BellIcon />,
      content: <div style={{ padding: '0' }}>
        <h3 style={{ 
          fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
          fontWeight: 400, 
          color: '#1a1a1a', 
          marginBottom: '0.75rem' 
        }}>
          Notificaciones
        </h3>
        <p style={{ color: '#666', lineHeight: '1.5' }}>
          Gestiona tus alertas y preferencias.
        </p>
      </div>
    },
    {
      value: 'premium',
      label: 'Premium',
      icon: <StarIcon />,
      className: 'premiumTab',
      content: <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.5rem',
        padding: '1rem 0'
      }}>
        <LockClosedIcon style={{ 
          width: 'clamp(48px, 15vw, 64px)', 
          height: 'clamp(48px, 15vw, 64px)', 
          color: '#5d4e75', 
          opacity: 0.7
        }} />
        <div>
          <h3 style={{ 
            fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
            fontWeight: 400, 
            color: '#1a1a1a', 
            marginBottom: '0.75rem' 
          }}>
            Características Premium
          </h3>
          <p style={{ 
            color: '#666', 
            lineHeight: '1.5',
            fontSize: 'clamp(14px, 3vw, 16px)'
          }}>
            Funcionalidades exclusivas para miembros Premium.
          </p>
        </div>
      </div>
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fefefe 0%, #f0f0f0 50%, #f8f4f0 100%)',
      padding: 'clamp(1rem, 4vw, 2rem)',
      fontFamily: 'var(--font-geist-sans)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '800px'
      }}>
        <TabsComponent 
          tabs={tabs}
          defaultValue="profile"
          onValueChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default TabsExample;