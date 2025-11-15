// Utils para uso en Client Components
'use client';

import { useUser, useClerk } from "@clerk/nextjs";

export class AuthUtils {
  // Métodos para client components
  static useAuth() {
    const { isLoaded, isSignedIn, user } = useUser();
    return {
      user,
      isLoaded,
      isSignedIn: isSignedIn ?? false,
      isLoading: !isLoaded,
    };
  }

  static useAuthActions() {
    const { signOut } = useClerk();
    return { signOut };
  }

  // Método para redirección (usar en useEffect)
  static useRequireAuth(redirectUrl: string = '/sign-in') {
    const { isLoaded, isSignedIn } = useUser();
    const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;

    if (typeof window !== 'undefined' && isLoaded && !isSignedIn && router) {
      router.push(redirectUrl);
    }

    return { isLoaded, isSignedIn };
  }

  static handleAuthError(error: any) {
    console.error('Auth error:', error);
    return { error: 'Authentication failed' };
  }
}

// Exportaciones para fácil uso
export const useAuth = AuthUtils.useAuth;
export const useAuthActions = AuthUtils.useAuthActions;
export const useRequireAuth = AuthUtils.useRequireAuth;