'use client';

import { SignUp } from '@clerk/nextjs';
import { clerkAppearance } from '../../lib/config/clerk-config';

export const SignUpComponent: React.FC = () => {
  const urlRedirect = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL!;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md w-full">
        <SignUp
          appearance={clerkAppearance}
          routing="path"
          path="/sign-up"
          redirectUrl={urlRedirect}
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
};