// // 'use client';

// // import { ProtectedRoute } from '../../clerk-modules/components/auth/ProtectedRoute';
// // import { AuthButtons } from '../../clerk-modules/components/auth/AuthButtons';
// // import { useAuth } from '../../clerk-modules/utils/auth-utils';
// // import Link from 'next/link';
// // import styles from './home.module.css';
// // import { Button } from '@/app/components/ui/Button/Button';
// // import { Select } from '@/app/components/ui/Form/Select';


// // import { Form, FormGroup, FormActions } from '../components/ui/Form/Form';
// // import { Input } from '../components/ui/Form/Input';
// // import { useForm } from '../hooks/useForm';



// // interface ExampleFormValues {
// //   firstName: string;
// //   lastName: string;
// //   email: string;
// //   country: string;
// //   password: string;
// // }

// // export default function Home() {
// //   const { user } = useAuth();

// //   const getVerificationStatus = (status: string | undefined) => {
// //     switch (status) {
// //       case 'verified':
// //         return <span className={styles.verified}>Verificado</span>;
// //       case 'pending':
// //         return <span className={styles.pending}>Pendiente</span>;
// //       default:
// //         return <span>{status || 'No disponible'}</span>;
// //     }
// //   };

// //   return (
// //     <ProtectedRoute>
// //       <div className={styles.container}>
// //         <div className="container mx-auto px-4 py-8">
// //           {/* Header */}
// //           <header className={styles.header}>
// //             <h1 className={styles.title}>Dashboard</h1>
// //             <AuthButtons />
// //           </header>

// //           {/* Main Content */}
// //           <main className="max-w-6xl mx-auto">
// //             {/* Welcome Card */}
// //             <div className={styles.welcomeCard}>
// //               <h2 className={styles.welcomeTitle}>
// //                 ¡Hola, {user?.firstName} {user?.lastName}! 👋
// //               </h2>
// //               <p className={styles.welcomeText}>
// //                 Bienvenido a la plataforma de tu empresa. Gestiona tus proyectos,
// //                 colabora con tu equipo y accede a todas las herramientas necesarias
// //                 para tu trabajo.
// //               </p>

// //               {/* Info Grid */}
// //               <div className={styles.grid}>
// //                 {/* Información Personal */}
// //                 <div className={`${styles.infoCard} ${styles.personalInfo}`}>
// //                   <h3 className={styles.cardTitle}>Información Personal</h3>
// //                   <p className={styles.infoText}>
// //                     <strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}
// //                   </p>
// //                   <p className={styles.infoText}>
// //                     <strong>Usuario ID:</strong> {user?.id}
// //                   </p>
// //                 </div>

// //                 {/* Estado de Cuenta */}
// //                 <div className={`${styles.infoCard} ${styles.accountStatus}`}>
// //                   <h3 className={styles.cardTitle}>Estado de Cuenta</h3>
// //                   {/* <p className={styles.infoText}>
// //                     {
// //                       user && <strong>Verificación:</strong> {getVerificationStatus(user?.emailAddresses[0]?.verification?.status)}
// //                    }
// //                   </p> */}
// //                   <p className={styles.infoText}>
// //                     <strong>Miembro desde:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
// //                   </p>
// //                 </div>

// //                 {/* Acciones Rápidas */}
// //                 <div className={`${styles.infoCard} ${styles.quickActions}`}>
// //                   <h3 className={styles.cardTitle}>Acciones Rápidas</h3>
// //                   <div className="space-y-2">
// //                     <Link
// //                       href="/user-profile"
// //                       className={styles.actionLink}
// //                     >
// //                       Editar Perfil
// //                     </Link>
// //                     <Link
// //                       href="/projects"
// //                       className={styles.actionLink}
// //                     >
// //                       Ver Proyectos
// //                     </Link>
// //                     <Link
// //                       href="/settings"
// //                       className={styles.actionLink}
// //                     >
// //                       Configuración
// //                     </Link>
// //                     <Link
// //                       href="/help"
// //                       className={styles.actionLink}
// //                     >
// //                       Centro de Ayuda
// //                     </Link>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Additional Info Section */}
// //             <div className={styles.grid}>
// //               {/* Stats Card */}
// //               <div className={styles.welcomeCard}>
// //                 <h3 className={styles.cardTitle} style={{ color: '#2d3748' }}>Resumen de Actividad</h3>
// //                 <div className="space-y-3">
// //                   <p className={styles.infoText} style={{ color: '#4a5568' }}>
// //                     <strong>Proyectos activos:</strong> 3
// //                   </p>
// //                   <p className={styles.infoText} style={{ color: '#4a5568' }}>
// //                     <strong>Tareas pendientes:</strong> 12
// //                   </p>
// //                   <p className={styles.infoText} style={{ color: '#4a5568' }}>
// //                     <strong>Mensajes sin leer:</strong> 5
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* Quick Links */}
// //               <div className={styles.welcomeCard}>
// //                 <h3 className={styles.cardTitle} style={{ color: '#2d3748' }}>Enlaces Rápidos</h3>
// //                 <div className="space-y-2">
// //                   <Link href="/documents" className={styles.actionLink}>
// //                     Documentos Compartidos
// //                   </Link>
// //                   <Link href="/calendar" className={styles.actionLink}>
// //                     Calendario
// //                   </Link>
// //                   <Link href="/team" className={styles.actionLink}>
// //                     Directorio del Equipo
// //                   </Link>
// //                   <Link href="/reports" className={styles.actionLink}>
// //                     Reportes
// //                   </Link>
// //                 </div>
// //               </div>
// //             </div>
// //           </main>

// //         </div>
// //       </div>
// //     </ProtectedRoute>
// //   );
// // }



// 'use client';

// import { ProtectedRoute } from '../../clerk-modules/components/auth/ProtectedRoute';
// import { AuthButtons } from '../../clerk-modules/components/auth/AuthButtons';
// import { useAuth } from '../../clerk-modules/utils/auth-utils';
// import Link from 'next/link';
// import styles from './home.module.css';
// import { UserRoleDisplay } from '../components/ui/UserRoleDisplay';
// import MyFormWithSteps from '../components/Steps/StepsExample';
// import { useUserRoles } from '../hooks/useUserRoles';
// import TabsExample from '../components/Tabs/TabsExample';

// export default function Home() {
//   const { user } = useAuth();
//   const { userRoles, isLoading, error, refetch, getPrimaryRole, getUserRolesText, hasRoles } = useUserRoles();
//   console.log("🚀 ~ Home ~ userRoles:", userRoles)

//   const getVerificationStatus = (status: string | undefined) => {
//     switch (status) {
//       case 'verified':
//         return <span className={styles.verified}>Verificado</span>;
//       case 'pending':
//         return <span className={styles.pending}>Pendiente</span>;
//       default:
//         return <span>{status || 'No disponible'}</span>;
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <div className={styles.container}>
//         <div className="container mx-auto px-4 py-8">
//           {/* Header */}
//           {/* <header className={styles.header}>
//             <h1 className={styles.title}>Dashboard</h1>
//             <AuthButtons />
//           </header> */}
//           <hr />
//           <hr />
//           <hr /> <br /><br /><br /><br /><br />
//           {/* Main Content */}
//           <main className="max-w-6xl mx-auto">
//             {/* Display User Roles */}


//             {/* Welcome Card */}
//             <div className={styles.welcomeCard}>
//               <h2 className={styles.welcomeTitle}>
//                 ¡Hola, {user?.firstName} {user?.lastName}! 👋
//               </h2>
//               <p className={styles.welcomeText}>
//                 Bienvenido a la plataforma de tu empresa. Gestiona tus proyectos,
//                 colabora con tu equipo y accede a todas las herramientas necesarias
//                 para tu trabajo.
//               </p>

//               {/* Info Grid */}
//               <div className={styles.grid}>
//                 {/* Información Personal */}
//                 <div className={`${styles.infoCard} ${styles.personalInfo}`}>
//                   <h3 className={styles.cardTitle}>Información Personal</h3>
//                   <p className={styles.infoText}>
//                     <strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}
//                   </p>
//                   <p className={styles.infoText}>
//                     <strong>Usuario ID:</strong> {user?.id}
//                   </p>
//                 </div>

//                 {/* Estado de Cuenta */}
//                 <div className={`${styles.infoCard} ${styles.accountStatus}`}>
//                   <h3 className={styles.cardTitle}>Estado de Cuenta</h3>
//                   <p className={styles.infoText}>
//                     <strong>Miembro desde:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
//                   </p>
//                 </div>

//                 {/* Acciones Rápidas */}
//                 <div className={`${styles.infoCard} ${styles.quickActions}`}>
//                   <h3 className={styles.cardTitle}>Acciones Rápidas</h3>
//                   <div className="space-y-2">
//                     <Link
//                       href="/user-profile"
//                       className={styles.actionLink}
//                     >
//                       Editar Perfil
//                     </Link>
//                     <Link
//                       href="/projects"
//                       className={styles.actionLink}
//                     >
//                       Ver Proyectos
//                     </Link>
//                     <Link
//                       href="/settings"
//                       className={styles.actionLink}
//                     >
//                       Configuración
//                     </Link>
//                     <Link
//                       href="/help"
//                       className={styles.actionLink}
//                     >
//                       Centro de Ayuda
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* <div className={styles.grid}>
//               <div className={styles.welcomeCard}>
//                 <h3 className={styles.cardTitle} style={{ color: '#2d3748' }}>Resumen de Actividad</h3>
//                 <div className="space-y-3">
//                   <p className={styles.infoText} style={{ color: '#4a5568' }}>
//                     <strong>Proyectos activos:</strong> 3
//                   </p>
//                   <p className={styles.infoText} style={{ color: '#4a5568' }}>
//                     <strong>Tareas pendientes:</strong> 12
//                   </p>
//                   <p className={styles.infoText} style={{ color: '#4a5568' }}>
//                     <strong>Mensajes sin leer:</strong> 5
//                   </p>
//                 </div>
//               </div>

//               <div className={styles.welcomeCard}>
//                 <h3 className={styles.cardTitle} style={{ color: '#2d3748' }}>Enlaces Rápidos</h3>
//                 <div className="space-y-2">
//                   <Link href="/documents" className={styles.actionLink}>
//                     Documentos Compartidos
//                   </Link>
//                   <Link href="/calendar" className={styles.actionLink}>
//                     Calendario
//                   </Link>
//                   <Link href="/team" className={styles.actionLink}>
//                     Directorio del Equipo
//                   </Link>
//                   <Link href="/reports" className={styles.actionLink}>
//                     Reportes
//                   </Link>
//                 </div>
//               </div>

//             </div> */}

//             <div className={styles.grid}>
//               {/* Stats Card */}
//               <div className={styles.welcomeCard}>
//                 <h3 className={styles.cardTitle} style={{ color: '#2d3748' }}>Resumen de Actividad</h3>
//                 <div className="space-y-3">
//                   <p className={styles.infoText} style={{ color: '#4a5568' }}>
//                     <strong>Proyectos activos:</strong> 3
//                   </p>
//                   <p className={styles.infoText} style={{ color: '#4a5568' }}>
//                     <strong>Tareas pendientes:</strong> 12
//                   </p>
//                   <p className={styles.infoText} style={{ color: '#4a5568' }}>
//                     <strong>Mensajes sin leer:</strong> 5
//                   </p>
//                 </div>
//               </div>


//               <div className={styles.welcomeCard}>
//                 <h3 className={styles.cardTitle} style={{ color: '#2d3748' }}>Enlaces Rápidos</h3>
//                 <div className="space-y-2">
//                   <TabsExample />

//                 </div>
//               </div>
//               {/* <UserRoleDisplay />


//               <MyFormWithSteps />


//               */}
//             </div>






//           </main>
//         </div>
//       </div >
//     </ProtectedRoute >
//   );
// }


// En tu archivo Home.tsx
'use client';

import { ProtectedRoute } from '../../clerk-modules/components/auth/ProtectedRoute';
import { AuthButtons } from '../../clerk-modules/components/auth/AuthButtons';
import { useAuth } from '../../clerk-modules/utils/auth-utils';
import Link from 'next/link';
import styles from './home.module.css';
import { UserRoleDisplay } from '../components/ui/UserRoleDisplay';
import MyFormWithSteps from '../components/Steps/StepsExample';
import { useUserRoles } from '../hooks/useUserRoles';
import CompanyRolesTabs from '../components/CompanyRolesTabs/CompanyRolesTabs';

export default function Home() {
  const { user } = useAuth();
  const { userRoles, isLoading, error, refetch, getPrimaryRole, getUserRolesText, hasRoles } = useUserRoles();
  console.log("🚀 ~ Home ~ userRoles:", userRoles)

  // Transformar los datos para el componente
  const companiesData = userRoles?.companies?.map(company => ({
    company_id: company.company_id,
    company_name: company.company_name,
    roles: company.roles,
    status: company.status
  })) || [];

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className="container mx-auto px-4 py-8">
          <br /><br /><br /><br /><br /><br />
          <CompanyRolesTabs
            companies={companiesData}
            userEmail={user?.emailAddresses[0]?.emailAddress || ''}
            userName={`${user?.firstName} ${user?.lastName}`}
          />
          <div className={styles.grid}>

            <div className={styles.welcomeCard}>
              <h3 className={styles.cardTitle} style={{ color: '#2d3748' }}>Resumen de Actividad</h3>
              <div className="space-y-3">
                <p className={styles.infoText} style={{ color: '#4a5568' }}>
                  <strong>Proyectos activos:</strong> 3
                </p>
                <p className={styles.infoText} style={{ color: '#4a5568' }}>
                  <strong>Tareas pendientes:</strong> 12
                </p>
                <p className={styles.infoText} style={{ color: '#4a5568' }}>
                  <strong>Mensajes sin leer:</strong> 5
                </p>
              </div>
            </div>

            <div className={styles.welcomeCard}>
              <h3 className={styles.cardTitle} style={{ color: '#2d3748' }}>Tus Empresas y Roles</h3>
              <div className="space-y-2">

              </div>
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}