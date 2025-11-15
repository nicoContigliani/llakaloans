// hooks/use-clerk-auth.ts
'use client';

import { useUser, useClerk } from "@clerk/nextjs";

export const useClerkAuth = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();

  return {
    user,
    isLoaded,
    isSignedIn,
    signOut: () => signOut(),
    signIn: () => openSignIn(),
    signUp: () => openSignUp(),
  };
};