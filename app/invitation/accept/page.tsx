// // app/invitation/accept/page.tsx
// "use client";

// import { useState, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useUser } from '@clerk/nextjs';

// export default function AcceptInvitationPage() {
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
//   const [message, setMessage] = useState('');
//   const [companyName, setCompanyName] = useState<string>('');
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { user, isLoaded } = useUser();
  
//   const token = searchParams.get('token');

//   useEffect(() => {
//     const acceptInvitation = async () => {
//       if (!token) {
//         setStatus('error');
//         setMessage('Token de invitación no válido o faltante');
//         return;
//       }

//       console.log('🔍 Token recibido:', token);

//       if (!isLoaded) {
//         console.log('⏳ Cargando información del usuario...');
//         return;
//       }

//       if (!user) {
//         console.log('🔐 Usuario no autenticado, redirigiendo a login...');
//         // Redirigir a login con el token en la URL de retorno
//         const redirectUrl = `/sign-in?redirect_url=${encodeURIComponent(`/invitation/accept?token=${token}`)}`;
//         router.push(redirectUrl);
//         return;
//       }

//       console.log('✅ Usuario autenticado:', user.id);

//       try {
//         console.log('📤 Enviando solicitud de aceptación...');
//         const response = await fetch('/api/organization/invitations/accept', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ 
//             token, 
//             user_id: user.id 
//           })
//         });

//         console.log('📥 Respuesta recibida, status:', response.status);

//         const data = await response.json();
//         console.log('📋 Datos de respuesta:', data);

//         if (data.success) {
//           setStatus('success');
//           setMessage(data.message || 'Invitación aceptada exitosamente');
//           if (data.company_name) {
//             setCompanyName(data.company_name);
//           }
//           // Redirigir después de 3 segundos
//           setTimeout(() => {
//             console.log('🔄 Redirigiendo a organización...');
//             router.push('/organization');
//           }, 3000);
//         } else {
//           setStatus('error');
//           setMessage(data.message || data.error || 'Error al procesar la invitación');
//         }
//       } catch (error) {
//         console.error('❌ Error en la solicitud:', error);
//         setStatus('error');
//         setMessage('Error de conexión al procesar la invitación');
//       }
//     };

//     if (isLoaded) {
//       acceptInvitation();
//     }
//   }, [token, user, isLoaded, router]);

//   if (status === 'loading') {
//     return (
//       <div style={{ 
//         padding: '40px', 
//         textAlign: 'center',
//         maxWidth: '500px',
//         margin: '0 auto',
//         minHeight: '60vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center'
//       }}>
//         <div style={{
//           border: '4px solid #f3f3f3',
//           borderTop: '4px solid #0070f3',
//           borderRadius: '50%',
//           width: '50px',
//           height: '50px',
//           animation: 'spin 1s linear infinite',
//           margin: '0 auto 20px'
//         }}></div>
//         <h2 style={{ marginBottom: '10px', color: '#333' }}>Procesando invitación...</h2>
//         <p style={{ color: '#666', margin: 0 }}>Por favor espera mientras procesamos tu invitación.</p>
//         <style jsx>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   return (
//     <div style={{ 
//       padding: '40px', 
//       textAlign: 'center',
//       maxWidth: '500px',
//       margin: '0 auto',
//       minHeight: '60vh',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center'
//     }}>
//       {status === 'success' ? (
//         <div style={{ color: 'green', width: '100%' }}>
//           <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
//           <h2 style={{ marginBottom: '15px', color: '#155724' }}>¡Invitación Aceptada!</h2>
//           <p style={{ margin: '15px 0', fontSize: '16px', lineHeight: '1.5' }}>
//             {message}
//           </p>
//           {companyName && (
//             <p style={{ 
//               margin: '10px 0', 
//               fontSize: '18px', 
//               fontWeight: 'bold',
//               color: '#333'
//             }}>
//               Bienvenido a <strong>{companyName}</strong>
//             </p>
//           )}
//           <p style={{ color: '#666', fontSize: '14px', margin: '20px 0' }}>
//             Serás redirigido automáticamente a la organización...
//           </p>
//           <button 
//             onClick={() => router.push('/organization')}
//             style={{
//               marginTop: '15px',
//               padding: '12px 24px',
//               backgroundColor: '#0070f3',
//               color: 'white',
//               border: 'none',
//               borderRadius: '6px',
//               cursor: 'pointer',
//               fontSize: '16px',
//               fontWeight: '600'
//             }}
//           >
//             Ir a Organización Ahora
//           </button>
//         </div>
//       ) : (
//         <div style={{ color: 'red', width: '100%' }}>
//           <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
//           <h2 style={{ marginBottom: '15px', color: '#721c24' }}>Error al Aceptar Invitación</h2>
//           <p style={{ margin: '15px 0', fontSize: '16px', lineHeight: '1.5' }}>
//             {message}
//           </p>
//           <div style={{ marginTop: '25px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
//             <button 
//               onClick={() => router.push('/organization')}
//               style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#0070f3',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 fontSize: '14px'
//               }}
//             >
//               Volver a la Organización
//             </button>
//             <button 
//               onClick={() => window.location.reload()}
//               style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#f5f5f5',
//                 color: '#333',
//                 border: '1px solid #ddd',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 fontSize: '14px'
//               }}
//             >
//               Reintentar
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// app/invitation/accept/page.tsx
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

// Componente interno que usa useSearchParams
function AcceptInvitationContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [companyName, setCompanyName] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  const token = searchParams.get('token');

  useEffect(() => {
    const acceptInvitation = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de invitación no válido o faltante');
        return;
      }

      console.log('🔍 Token recibido:', token);

      if (!isLoaded) {
        console.log('⏳ Cargando información del usuario...');
        return;
      }

      if (!user) {
        console.log('🔐 Usuario no autenticado, redirigiendo a login...');
        // Redirigir a login con el token en la URL de retorno
        const redirectUrl = `/sign-in?redirect_url=${encodeURIComponent(`/invitation/accept?token=${token}`)}`;
        router.push(redirectUrl);
        return;
      }

      console.log('✅ Usuario autenticado:', user.id);

      try {
        console.log('📤 Enviando solicitud de aceptación...');
        const response = await fetch('/api/organization/invitations/accept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            token, 
            user_id: user.id 
          })
        });

        console.log('📥 Respuesta recibida, status:', response.status);

        const data = await response.json();
        console.log('📋 Datos de respuesta:', data);

        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Invitación aceptada exitosamente');
          if (data.company_name) {
            setCompanyName(data.company_name);
          }
          // Redirigir después de 3 segundos
          setTimeout(() => {
            console.log('🔄 Redirigiendo a organización...');
            router.push('/homesistem');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || data.error || 'Error al procesar la invitación');
        }
      } catch (error) {
        console.error('❌ Error en la solicitud:', error);
        setStatus('error');
        setMessage('Error de conexión al procesar la invitación');
      }
    };

    if (isLoaded) {
      acceptInvitation();
    }
  }, [token, user, isLoaded, router]);

  if (status === 'loading') {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0070f3',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <h2 style={{ marginBottom: '10px', color: '#333' }}>Procesando invitación...</h2>
        <p style={{ color: '#666', margin: 0 }}>Por favor espera mientras procesamos tu invitación.</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      maxWidth: '500px',
      margin: '0 auto',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {status === 'success' ? (
        <div style={{ color: 'green', width: '100%' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h2 style={{ marginBottom: '15px', color: '#155724' }}>¡Invitación Aceptada!</h2>
          <p style={{ margin: '15px 0', fontSize: '16px', lineHeight: '1.5' }}>
            {message}
          </p>
          {companyName && (
            <p style={{ 
              margin: '10px 0', 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Bienvenido a <strong>{companyName}</strong>
            </p>
          )}
          <p style={{ color: '#666', fontSize: '14px', margin: '20px 0' }}>
            Serás redirigido automáticamente a la organización...
          </p>
          <button 
            onClick={() => router.push('/organization')}
            style={{
              marginTop: '15px',
              padding: '12px 24px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Ir a Organización Ahora
          </button>
        </div>
      ) : (
        <div style={{ color: 'red', width: '100%' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
          <h2 style={{ marginBottom: '15px', color: '#721c24' }}>Error al Aceptar Invitación</h2>
          <p style={{ margin: '15px 0', fontSize: '16px', lineHeight: '1.5' }}>
            {message}
          </p>
          <div style={{ marginTop: '25px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => router.push('/organization')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Volver a la Organización
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente principal con Suspense
export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0070f3',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <h2 style={{ marginBottom: '10px', color: '#333' }}>Cargando...</h2>
        <p style={{ color: '#666', margin: 0 }}>Preparando la página de aceptación de invitación.</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    }>
      <AcceptInvitationContent />
    </Suspense>
  );
}