'use client';

import { useEffect } from 'react';
import { useClerkAuth } from '../../hooks/use-clerk-auth';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { ProtectedRouteProps } from '../../types/auth';

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  redirectTo = '/sign-in'
}) => {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(redirectTo);
    }
  }, [isLoaded, isSignedIn, router, redirectTo]);

  if (!isLoaded) {
    return <>{fallback || <LoadingSpinner text="Checking authentication..." />}</>;
  }

  if (!isSignedIn) {
    return <LoadingSpinner text="Redirecting to login..." />;
  }

  return <>{children}</>;
};