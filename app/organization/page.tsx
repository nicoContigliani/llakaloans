// // 'use client';

// // import { CompanyManager } from '@/organization-module/components/CompanyManager';
// // import UserManager from '@/organization-module/components/UserManager';
// // import { Company } from '@/organization-module/types/organization';
// // import { useUser } from '@clerk/nextjs';
// // import React, { useState, useEffect } from 'react';

// // export default function OrganizationPage() {
// //   const [activeTab, setActiveTab] = useState<'companies' | 'users'>('companies');
// //   const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
// //   const [userCompanies, setUserCompanies] = useState<Company[]>([]);
// //   const { user, isLoaded } = useUser();
// //   const [refreshTrigger, setRefreshTrigger] = useState(0);

// //   // Función para recargar las empresas del usuario
// //   const loadUserCompanies = async () => {
// //     if (!isLoaded || !user?.id) {
// //       console.log('⏳ Esperando usuario...', { isLoaded, userId: user?.id });
// //       return;
// //     }
    
// //     console.log('🔄 Cargando empresas para usuario:', user.id);

// //     try {
// //       const response = await fetch(`/api/organization/employees?user_id=${user.id}`);
      
// //       console.log('📡 Response status:', response.status);
      
// //       if (response.ok) {
// //         const data = await response.json();
// //         console.log('✅ Empresas cargadas:', data.companies);
// //         setUserCompanies(data.companies || []);
        
// //         // Actualizar la empresa seleccionada
// //         if (data.companies.length > 0) {
// //           // Si la empresa seleccionada actual ya no existe, seleccionar la primera
// //           if (!selectedCompany || !data.companies.find((c: Company) => c._id === selectedCompany._id)) {
// //             setSelectedCompany(data.companies[0]);
// //           } else {
// //             // Actualizar los datos de la empresa seleccionada
// //             const updatedSelectedCompany = data.companies.find((c: Company) => c._id === selectedCompany._id);
// //             if (updatedSelectedCompany) {
// //               setSelectedCompany(updatedSelectedCompany);
// //             }
// //           }
// //         } else {
// //           setSelectedCompany(null);
// //         }
// //       } else {
// //         const errorData = await response.json();
// //         console.error('❌ Error en response:', errorData);
// //       }
// //     } catch (error) {
// //       console.error('❌ Error loading user companies:', error);
// //     }
// //   };

// //   // Cargar empresas del usuario al montar y cuando cambia el refreshTrigger
// //   useEffect(() => {
// //     loadUserCompanies();
// //   }, [user, isLoaded, refreshTrigger]);

// //   // Función para forzar recarga cuando se elimina una empresa
// //   const handleCompanyDeleted = () => {
// //     console.log('🔄 Recargando empresas después de eliminación...');
// //     setRefreshTrigger(prev => prev + 1);
// //   };

// //   if (!isLoaded) {
// //     return (
// //       <div style={{ padding: '20px', textAlign: 'center' }}>
// //         <div className="spinner"></div>
// //         <p>Cargando información del usuario...</p>
// //         <style jsx>{`
// //           .spinner {
// //             border: 3px solid #f3f3f3;
// //             border-top: 3px solid #0070f3;
// //             border-radius: 50%;
// //             width: 40px;
// //             height: 40px;
// //             animation: spin 1s linear infinite;
// //             margin: 0 auto 20px;
// //           }
// //           @keyframes spin {
// //             0% { transform: rotate(0deg); }
// //             100% { transform: rotate(360deg); }
// //           }
// //         `}</style>
// //       </div>
// //     );
// //   }

// //   if (!user) {
// //     return (
// //       <div style={{ padding: '20px', textAlign: 'center' }}>
// //         <h2>Por favor inicia sesión</h2>
// //         <p>Necesitas estar autenticado para acceder a esta página.</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={{ padding: '20px' }}>
// //       <h1>Gestión de Organización</h1>
      
// //       {/* Información del usuario */}
// //       <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
// //         <p><strong>Usuario:</strong> {user.emailAddresses[0]?.emailAddress}</p>
// //         <p><strong>ID:</strong> {user.id}</p>
// //         <p><strong>Empresas encontradas:</strong> {userCompanies.length}</p>
// //       </div>
      
// //       {/* Selector de empresa */}
// //       {userCompanies.length > 0 && (
// //         <div style={{ marginBottom: '20px' }}>
// //           <label htmlFor="company-select" style={{ fontWeight: 'bold', marginRight: '10px' }}>
// //             Empresa activa: 
// //           </label>
// //           <select
// //             id="company-select"
// //             value={selectedCompany?._id || ''}
// //             onChange={(e) => {
// //               const company = userCompanies.find(c => c._id === e.target.value);
// //               setSelectedCompany(company || null);
// //             }}
// //             style={{ 
// //               padding: '8px 12px', 
// //               border: '1px solid #ddd', 
// //               borderRadius: '6px',
// //               minWidth: '200px'
// //             }}
// //           >
// //             {userCompanies.map(company => (
// //               <option key={company._id} value={company._id}>
// //                 {company.name}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       )}

// //       {/* Tabs de navegación */}
// //       <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
// //         <button
// //           onClick={() => setActiveTab('companies')}
// //           style={{ 
// //             marginRight: '10px',
// //             padding: '10px 20px',
// //             fontWeight: activeTab === 'companies' ? 'bold' : 'normal',
// //             backgroundColor: activeTab === 'companies' ? '#0070f3' : 'transparent',
// //             color: activeTab === 'companies' ? 'white' : '#0070f3',
// //             border: '1px solid #0070f3',
// //             borderBottom: 'none',
// //             borderRadius: '6px 6px 0 0',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           Gestión de Empresas
// //         </button>
// //         <button
// //           onClick={() => setActiveTab('users')}
// //           style={{ 
// //             padding: '10px 20px',
// //             fontWeight: activeTab === 'users' ? 'bold' : 'normal',
// //             backgroundColor: activeTab === 'users' ? '#0070f3' : 'transparent',
// //             color: activeTab === 'users' ? 'white' : '#0070f3',
// //             border: '1px solid #0070f3',
// //             borderBottom: 'none',
// //             borderRadius: '6px 6px 0 0',
// //             cursor: 'pointer',
// //             opacity: selectedCompany ? 1 : 0.5
// //           }}
// //           disabled={!selectedCompany}
// //         >
// //           Gestión de Usuarios {selectedCompany && `- ${selectedCompany.name}`}
// //         </button>
// //       </div>

// //       {/* Contenido de tabs */}
// //       <div>
// //         {activeTab === 'companies' && (
// //           <CompanyManager onCompanyDeleted={handleCompanyDeleted} />
// //         )}
// //         {activeTab === 'users' && selectedCompany && (
// //           <UserManager 
// //             companyId={selectedCompany?._id} 
// //             companyName={selectedCompany?.name} 
// //           />
// //         )}
// //         {activeTab === 'users' && !selectedCompany && (
// //           <div style={{ 
// //             padding: '40px', 
// //             textAlign: 'center', 
// //             background: '#fff3cd', 
// //             border: '1px solid #ffeaa7', 
// //             borderRadius: '6px',
// //             marginTop: '20px'
// //           }}>
// //             <h3>Selecciona una empresa</h3>
// //             <p>Para gestionar usuarios, primero selecciona una empresa de la lista.</p>
// //             {userCompanies.length === 0 && (
// //               <p style={{ marginTop: '10px', color: '#856404' }}>
// //                 No tienes empresas disponibles. Crea una empresa primero.
// //               </p>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }




// 'use client';

// import { CompanyManager } from '@/organization-module/components/CompanyManager';
// import UserManager from '@/organization-module/components/UserManager';
// import { Company } from '@/organization-module/types/organization';
// import { useUser } from '@clerk/nextjs';
// import React, { useState, useEffect } from 'react';
// import * as Select from '@radix-ui/react-select';
// import * as Tabs from '@radix-ui/react-tabs';
// import { 
//   ChevronDownIcon, 
//   CheckIcon, 
//   PersonIcon, 
//   IdCardIcon,
//   CubeIcon 
// } from '@radix-ui/react-icons';
// // import { BuildingIcon } from '@radix-ui/react-icons';

// import styles from './OrganizationPage.module.css';

// export default function OrganizationPage() {
//   const [activeTab, setActiveTab] = useState<'companies' | 'users'>('companies');
//   const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
//   const [userCompanies, setUserCompanies] = useState<Company[]>([]);
//   const { user, isLoaded } = useUser();
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   // Función para recargar las empresas del usuario
//   const loadUserCompanies = async () => {
//     if (!isLoaded || !user?.id) {
//       console.log('⏳ Esperando usuario...', { isLoaded, userId: user?.id });
//       return;
//     }
    
//     console.log('🔄 Cargando empresas para usuario:', user.id);

//     try {
//       const response = await fetch(`/api/organization/employees?user_id=${user.id}`);
      
//       console.log('📡 Response status:', response.status);
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log('✅ Empresas cargadas:', data.companies);
//         setUserCompanies(data.companies || []);
        
//         // Actualizar la empresa seleccionada
//         if (data.companies.length > 0) {
//           if (!selectedCompany || !data.companies.find((c: Company) => c._id === selectedCompany._id)) {
//             setSelectedCompany(data.companies[0]);
//           } else {
//             const updatedSelectedCompany = data.companies.find((c: Company) => c._id === selectedCompany._id);
//             if (updatedSelectedCompany) {
//               setSelectedCompany(updatedSelectedCompany);
//             }
//           }
//         } else {
//           setSelectedCompany(null);
//         }
//       } else {
//         const errorData = await response.json();
//         console.error('❌ Error en response:', errorData);
//       }
//     } catch (error) {
//       console.error('❌ Error loading user companies:', error);
//     }
//   };

//   // Cargar empresas del usuario al montar y cuando cambia el refreshTrigger
//   useEffect(() => {
//     loadUserCompanies();
//   }, [user, isLoaded, refreshTrigger]);

//   // Función para forzar recarga cuando se elimina una empresa
//   const handleCompanyDeleted = () => {
//     console.log('🔄 Recargando empresas después de eliminación...');
//     setRefreshTrigger(prev => prev + 1);
//   };

//   // Función para manejar el cambio de tabs corregida
//   const handleTabChange = (value: string) => {
//     if (value === 'companies' || value === 'users') {
//       setActiveTab(value);
//     }
//   };

//   if (!isLoaded) {
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.spinner}></div>
//         <p className={styles.loadingText}>Cargando información del usuario...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className={styles.loginRequired}>
//         <CubeIcon className={styles.emptyStateIcon} />
//         <h2 className={styles.loginTitle}>Por favor inicia sesión</h2>
//         <p className={styles.loginText}>
//           Necesitas estar autenticado para acceder a esta página.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       {/* Header Section */}
//       <div className={styles.header}>
//         <h1 className={styles.title}>Gestión de Organización</h1>
        
//         {/* User Info Grid */}
//         <div className={styles.userInfoGrid}>
//           {/* Información Personal */}
//           <div className={styles.userInfoCard}>
//             <div className={styles.userInfoHeader}>
//               <PersonIcon className={styles.userInfoIcon} />
//               <h3 className={styles.userInfoTitle}>Información Personal</h3>
//             </div>
//             <div className={styles.userInfoContent}>
//               <div className={styles.userInfoText}>
//                 <span className={styles.userInfoLabel}>Email:</span>
//                 <span className={styles.userInfoValue}>
//                   {user.emailAddresses[0]?.emailAddress}
//                 </span>
//               </div>
//               <div className={styles.userInfoText}>
//                 <span className={styles.userInfoLabel}>Nombre:</span>
//                 <span className={styles.userInfoValue}>
//                   {user.fullName || 'No especificado'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Información de Cuenta */}
//           <div className={styles.userInfoCard}>
//             <div className={styles.userInfoHeader}>
//               <IdCardIcon className={styles.userInfoIcon} />
//               <h3 className={styles.userInfoTitle}>Cuenta</h3>
//             </div>
//             <div className={styles.userInfoContent}>
//               <div className={styles.userInfoText}>
//                 <span className={styles.userInfoLabel}>ID Usuario:</span>
//                 <span className={styles.userInfoValue}>
//                   {user.id.substring(0, 8)}...
//                 </span>
//               </div>
//               <div className={styles.userInfoText}>
//                 <span className={styles.userInfoLabel}>Estado:</span>
//                 <span className={styles.userInfoValue}>
//                   <span className={styles.userInfoHighlight}>
//                     {userCompanies.length > 0 ? 'Activo' : 'Sin empresas'}
//                   </span>
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Estadísticas */}
//           <div className={styles.userInfoCard}>
//             <div className={styles.userInfoHeader}>
//               {/* <BuildingIcon className={styles.userInfoIcon} /> */}
//               <h3 className={styles.userInfoTitle}>Empresas</h3>
//             </div>
//             <div className={styles.userInfoContent}>
//               <div className={styles.userInfoText}>
//                 <span className={styles.userInfoLabel}>Total:</span>
//                 <span className={styles.userInfoValue}>
//                   <span className={styles.userInfoHighlight}>
//                     {userCompanies.length}
//                   </span>
//                 </span>
//               </div>
//               <div className={styles.userInfoText}>
//                 <span className={styles.userInfoLabel}>Activa:</span>
//                 <span className={styles.userInfoValue}>
//                   {selectedCompany ? selectedCompany.name : 'Ninguna'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Company Selector Section */}
//         {userCompanies.length > 0 && (
//           <div className={styles.companySection}>
//             <div className={styles.companyHeader}>
//               <h2 className={styles.companyTitle}>Empresa Activa</h2>
//               <div className={styles.companySelector}>
//                 <label className={styles.companyLabel}>
//                   Seleccionar empresa:
//                 </label>
//                 <Select.Root
//                   value={selectedCompany?._id || ''}
//                   onValueChange={(value) => {
//                     const company = userCompanies.find(c => c._id === value);
//                     setSelectedCompany(company || null);
//                   }}
//                 >
//                   <Select.Trigger className={styles.selectTrigger}>
//                     <Select.Value placeholder="Seleccionar empresa..." />
//                     <Select.Icon>
//                       <ChevronDownIcon />
//                     </Select.Icon>
//                   </Select.Trigger>

//                   <Select.Portal>
//                     <Select.Content 
//                       className={styles.selectContent} 
//                       position="popper" 
//                       sideOffset={5}
//                     >
//                       <Select.Viewport>
//                         {userCompanies.map((company) => (
//                           <Select.Item 
//                             key={company._id} 
//                             value={company._id}
//                             className={styles.selectItem}
//                           >
//                             <Select.ItemText>{company.name}</Select.ItemText>
//                             <Select.ItemIndicator className={styles.selectItemIndicator}>
//                               <CheckIcon />
//                             </Select.ItemIndicator>
//                           </Select.Item>
//                         ))}
//                       </Select.Viewport>
//                     </Select.Content>
//                   </Select.Portal>
//                 </Select.Root>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Tabs Navigation */}
//       <Tabs.Root 
//         className={styles.tabsRoot}
//         value={activeTab} 
//         onValueChange={handleTabChange}
//       >
//         <Tabs.List className={styles.tabsList}>
//           <Tabs.Trigger 
//             className={styles.tabsTrigger}
//             value="companies"
//           >
//             📊 Gestión de Empresas
//           </Tabs.Trigger>
//           <Tabs.Trigger 
//             className={styles.tabsTrigger}
//             value="users"
//             disabled={!selectedCompany}
//           >
//             👥 Gestión de Usuarios
//             {selectedCompany && ` - ${selectedCompany.name}`}
//           </Tabs.Trigger>
//         </Tabs.List>

//         <div className={styles.contentArea}>
//           <Tabs.Content 
//             className={styles.tabContent} 
//             value="companies"
//           >
//             <CompanyManager onCompanyDeleted={handleCompanyDeleted} />
//           </Tabs.Content>
          
//           <Tabs.Content 
//             className={styles.tabContent} 
//             value="users"
//           >
//             {selectedCompany ? (
//               <UserManager 
//                 companyId={selectedCompany._id} 
//                 companyName={selectedCompany.name} 
//               />
//             ) : (
//               <div className={styles.emptyState}>
//                 {/* <BuildingIcon className={styles.emptyStateIcon} /> */}
//                 <h3 className={styles.emptyStateTitle}>Selecciona una empresa</h3>
//                 <p className={styles.emptyStateText}>
//                   Para gestionar usuarios, primero selecciona una empresa de la lista.
//                 </p>
//                 {userCompanies.length === 0 && (
//                   <p className={styles.emptyStateText} style={{ marginTop: '0.5rem' }}>
//                     No tienes empresas disponibles. Crea una empresa primero.
//                   </p>
//                 )}
//               </div>
//             )}
//           </Tabs.Content>
//         </div>
//       </Tabs.Root>
//     </div>
//   );
// }


'use client';

import { CompanyManager } from '@/organization-module/components/CompanyManager';
import UserManager from '@/organization-module/components/UserManager';
import { Company } from '@/organization-module/types/organization';
import { useUser } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Tabs from '@radix-ui/react-tabs';
import { 
  ChevronDownIcon, 
  CheckIcon, 
  PersonIcon, 
  IdCardIcon,
  CubeIcon,
  EnvelopeClosedIcon,
  BadgeIcon,
  BadgeIcon as  BuildingIcon
} from '@radix-ui/react-icons';

import styles from './OrganizationPage.module.css';

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState<'companies' | 'users'>('companies');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [userCompanies, setUserCompanies] = useState<Company[]>([]);
  const { user, isLoaded } = useUser();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadUserCompanies = async () => {
    if (!isLoaded || !user?.id) {
      console.log('⏳ Esperando usuario...', { isLoaded, userId: user?.id });
      return;
    }
    
    console.log('🔄 Cargando empresas para usuario:', user.id);

    try {
      const response = await fetch(`/api/organization/employees?user_id=${user.id}`);
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Empresas cargadas:', data.companies);
        setUserCompanies(data.companies || []);
        
        if (data.companies.length > 0) {
          if (!selectedCompany || !data.companies.find((c: Company) => c._id === selectedCompany._id)) {
            setSelectedCompany(data.companies[0]);
          } else {
            const updatedSelectedCompany = data.companies.find((c: Company) => c._id === selectedCompany._id);
            if (updatedSelectedCompany) {
              setSelectedCompany(updatedSelectedCompany);
            }
          }
        } else {
          setSelectedCompany(null);
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Error en response:', errorData);
      }
    } catch (error) {
      console.error('❌ Error loading user companies:', error);
    }
  };

  useEffect(() => {
    loadUserCompanies();
  }, [user, isLoaded, refreshTrigger]);

  const handleCompanyDeleted = () => {
    console.log('🔄 Recargando empresas después de eliminación...');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTabChange = (value: string) => {
    if (value === 'companies' || value === 'users') {
      setActiveTab(value);
    }
  };

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Cargando información del usuario...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loginRequired}>
        <CubeIcon className={styles.emptyStateIcon} />
        <h2 className={styles.loginTitle}>Por favor inicia sesión</h2>
        <p className={styles.loginText}>
          Necesitas estar autenticado para acceder a esta página.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <br /><br /><br />
      {/* Header Compacto */}
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.title}>Gestión de Organización</h1>
          
          {/* Información compacta del usuario */}
          <div className={styles.userInfoCompact}>
            <div className={styles.userAvatar}>
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Avatar" 
                  className={styles.avatarImage}
                />
              ) : (
                <PersonIcon className={styles.avatarFallback} />
              )}
            </div>
            
            <div className={styles.userDetails}>
              <div className={styles.userName}>
                {user.fullName || 'Usuario'}
              </div>
              <div className={styles.userEmail}>
                <EnvelopeClosedIcon className={styles.emailIcon} />
                {user.emailAddresses[0]?.emailAddress}
              </div>
            </div>
            
            <div className={styles.userStats}>
              <div className={styles.statItem}>
                <BuildingIcon className={styles.statIcon} />
                <span className={styles.statValue}>{userCompanies.length}</span>
                <span className={styles.statLabel}>Empresas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de empresa siempre visible pero compacto */}
        {userCompanies.length > 0 && (
          <div className={styles.companySelectorCompact}>
            <div className={styles.selectorHeader}>
              <BuildingIcon className={styles.selectorIcon} />
              <span className={styles.selectorLabel}>Empresa activa:</span>
            </div>
            <Select.Root
              value={selectedCompany?._id || ''}
              onValueChange={(value) => {
                const company = userCompanies.find(c => c._id === value);
                setSelectedCompany(company || null);
              }}
            >
              <Select.Trigger className={styles.selectTriggerCompact}>
                <Select.Value placeholder="Seleccionar empresa..." />
                <Select.Icon>
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content 
                  className={styles.selectContent} 
                  position="popper" 
                  sideOffset={5}
                >
                  <Select.Viewport>
                    {userCompanies.map((company) => (
                      <Select.Item 
                        key={company._id} 
                        value={company._id}
                        className={styles.selectItem}
                      >
                        <Select.ItemText>{company.name}</Select.ItemText>
                        <Select.ItemIndicator className={styles.selectItemIndicator}>
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        )}
      </div>

      {/* Tabs Navigation - Siempre fijo en mobile */}
      <Tabs.Root 
        className={styles.tabsRoot}
        value={activeTab} 
        onValueChange={handleTabChange}
      >
        <div className={styles.tabsContainer}>
          <Tabs.List className={styles.tabsList}>
            <Tabs.Trigger 
              className={styles.tabsTrigger}
              value="companies"
            >
              <BuildingIcon className={styles.tabIcon} />
              <span className={styles.tabText}>Empresas</span>
            </Tabs.Trigger>
            <Tabs.Trigger 
              className={styles.tabsTrigger}
              value="users"
              disabled={!selectedCompany}
            >
              <PersonIcon className={styles.tabIcon} />
              <span className={styles.tabText}>
                Usuarios
                {selectedCompany && ` - ${selectedCompany.name}`}
              </span>
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <div className={styles.contentArea}>
          <Tabs.Content 
            className={styles.tabContent} 
            value="companies"
          >
            <CompanyManager onCompanyDeleted={handleCompanyDeleted} />
          </Tabs.Content>
          
          <Tabs.Content 
            className={styles.tabsContent} 
            value="users"
          >
            {selectedCompany ? (
              <UserManager 
                companyId={selectedCompany._id} 
                companyName={selectedCompany.name} 
              />
            ) : (
              <div className={styles.emptyState}>
                <BuildingIcon className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>Selecciona una empresa</h3>
                <p className={styles.emptyStateText}>
                  Para gestionar usuarios, primero selecciona una empresa de la lista.
                </p>
                {userCompanies.length === 0 && (
                  <p className={styles.emptyStateText} style={{ marginTop: '0.5rem' }}>
                    No tienes empresas disponibles. Crea una empresa primero.
                  </p>
                )}
              </div>
            )}
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}