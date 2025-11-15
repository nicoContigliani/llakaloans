'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { clerkConfig, clerkAppearance } from '../../lib/config/clerk-config';

interface ClerkProviderWrapperProps {
  children: React.ReactNode;
}

export const ClerkProviderWrapper: React.FC<ClerkProviderWrapperProps> = ({ 
  children 
}) => {
  return (
    <ClerkProvider
      publishableKey={clerkConfig.publishableKey}
      appearance={clerkAppearance}
      signInUrl={clerkConfig.signInUrl}
      signUpUrl={clerkConfig.signUpUrl}
      afterSignInUrl={clerkConfig.afterSignInUrl}
      afterSignUpUrl={clerkConfig.afterSignUpUrl}
    >
      {children}
    </ClerkProvider>
  );
};