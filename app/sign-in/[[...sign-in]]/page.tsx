'use client';

import { SignUpComponent } from '../../../clerk-modules/components/auth/SignUpComponent';
import { useAuth } from '../../../clerk-modules/utils/auth-utils';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const urlRedirect = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL!;


  useEffect(() => {
    if (isLoaded && user) {
      router.push(`${urlRedirect}`);
    }
  }, [user, isLoaded, router]);

  // Mostrar loading mientras verifica autenticación
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si está autenticado, no mostrar nada (será redirigido)
  if (user) {
    return null;
  }

  return <SignUpComponent />;
}