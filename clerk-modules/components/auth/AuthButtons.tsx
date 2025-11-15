// 'use client';

// import React from 'react';
// import { SignInButton, SignUpButton } from '@clerk/nextjs';
// import { useClerkAuth } from '../../hooks/use-clerk-auth';
// import { Button } from '../ui/Button';
// import { UserButton } from '../ui/UserButton';

// export const AuthButtons: React.FC = () => {
//   const { isSignedIn, user } = useClerkAuth();

//   if (isSignedIn) {
//     return (
//       <div className="flex items-center gap-4">
//         <span className="text-sm text-gray-700">
//           Hola, {user?.firstName || 'Usuario'}
//         </span>
//         <UserButton />
//       </div>
//     );
//   }

//   return (
//     <div className="flex gap-3">
//       <SignInButton mode="modal">
//         <Button variant="outline" size="sm">
//           Iniciar Sesión
//         </Button>
//       </SignInButton>
//       <SignUpButton mode="modal">
//         <Button size="sm">
//           Registrarse
//         </Button>
//       </SignUpButton>
//     </div>
//   );
// };



// components/auth/AuthButtons.tsx
'use client';

import React from 'react';
import { useClerkAuth } from '../../hooks/use-clerk-auth';
import { UserButton } from '../ui/UserButton';

export const AuthButtons: React.FC = () => {
  const { isSignedIn, user, signIn, signUp } = useClerkAuth();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          Hola, {user?.firstName || 'Usuario'}
        </span>
        <UserButton />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={signIn}
        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Iniciar Sesión
      </button>
      <button 
        onClick={signUp}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Registrarse
      </button>
    </div>
  );
};