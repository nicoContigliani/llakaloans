// // 'use client';

// // import React from 'react';
// // import { SignInButton, SignUpButton } from '@clerk/nextjs';
// // import { useClerkAuth } from '../../hooks/use-clerk-auth';
// // import { Button } from '../ui/Button';
// // import { UserButton } from '../ui/UserButton';

// // export const AuthButtons: React.FC = () => {
// //   const { isSignedIn, user } = useClerkAuth();

// //   if (isSignedIn) {
// //     return (
// //       <div className="flex items-center gap-4">
// //         <span className="text-sm text-gray-700">
// //           Hola, {user?.firstName || 'Usuario'}
// //         </span>
// //         <UserButton />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex gap-3">
// //       <SignInButton mode="modal">
// //         <Button variant="outline" size="sm">
// //           Iniciar Sesión
// //         </Button>
// //       </SignInButton>
// //       <SignUpButton mode="modal">
// //         <Button size="sm">
// //           Registrarse
// //         </Button>
// //       </SignUpButton>
// //     </div>
// //   );
// // };



// // components/auth/AuthButtons.tsx
// 'use client';

// import React from 'react';
// import { useClerkAuth } from '../../hooks/use-clerk-auth';
// import { UserButton } from '../ui/UserButton';

// export const AuthButtons: React.FC = () => {
//   const { isSignedIn, user, signIn, signUp } = useClerkAuth();

//   if (isSignedIn) {
//     return (
//       <div className="flex items-center gap-3">
//         <span className="text-sm text-gray-600">
//           Hola, {user?.firstName || 'Usuario'}
//         </span>
//         <UserButton />
//       </div>
//     );
//   }

//   return (
//     <div className="flex gap-2">
//       <button 
//         onClick={signIn}
//         className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//       >
//         Iniciar Sesión
//       </button>
//       <button 
//         onClick={signUp}
//         className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//       >
//         Registrarse
//       </button>
//     </div>
//   );
// };



// components/auth/AuthButtons.tsx
'use client';

import React, { useState } from 'react';
import { useClerkAuth } from '../../hooks/use-clerk-auth';
import { UserButton } from '../ui/UserButton';
import styles from './AuthButtons.module.css';

interface AuthButtonsProps {
  /**
   * Tamaño de los botones
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Mostrar el texto de bienvenida
   * @default true
   */
  showWelcomeText?: boolean;
  /**
   * Variante de los botones
   * @default 'default'
   */
  variant?: 'default' | 'minimal';
  /**
   * Clase CSS adicional
   */
  className?: string;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({
  size = 'md',
  showWelcomeText = true,
  variant = 'default',
  className = ''
}) => {
  const { isSignedIn, user, signIn, signUp } = useClerkAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignIn = async () => {
    if (isSigningIn) return;
    
    setIsSigningIn(true);
    try {
      await signIn();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUp = async () => {
    if (isSigningUp) return;
    
    setIsSigningUp(true);
    try {
      await signUp();
    } catch (error) {
      console.error('Error al registrarse:', error);
    } finally {
      setIsSigningUp(false);
    }
  };

  if (isSignedIn) {
    return (
      <div className={`${styles.signedInContainer} ${className}`}>
        {showWelcomeText && (
          <span className={styles.welcomeText}>
            Hola, {user?.firstName || user?.username || 'Usuario'}
          </span>
        )}
        <UserButton />
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`${styles.buttonGroup} ${className}`}>
        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className={`${styles.button} ${styles.buttonOutline} ${isSigningIn ? styles.loading : ''}`}
          type="button"
        >
          {isSigningIn ? '...' : 'Ingresar'}
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.buttonGroup} ${className}`}>
      <button
        onClick={handleSignIn}
        disabled={isSigningIn || isSigningUp}
        className={`${styles.button} ${styles.buttonOutline} ${isSigningIn ? styles.loading : ''}`}
        type="button"
      >
        {isSigningIn ? '...' : 'Iniciar Sesión'}
      </button>
      <button
        onClick={handleSignUp}
        disabled={isSigningUp || isSigningIn}
        className={`${styles.button} ${styles.buttonPrimary} ${isSigningUp ? styles.loading : ''}`}
        type="button"
      >
        {isSigningUp ? '...' : 'Registrarse'}
      </button>
    </div>
  );
};