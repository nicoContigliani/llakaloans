'use client';

import { SignIn } from '@clerk/nextjs';
import { clerkAppearance } from '../../lib/config/clerk-config';

export const SignInComponent: React.FC = () => {
  const urlRedirect = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL!;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-md w-full">
        <SignIn
          appearance={clerkAppearance}
          routing="path"
          path="/sign-in"
          redirectUrl={urlRedirect}
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
};