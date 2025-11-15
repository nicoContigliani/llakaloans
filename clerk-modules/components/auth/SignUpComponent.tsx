'use client';

import { SignUp } from '@clerk/nextjs';
import { clerkAppearance } from '../../lib/config/clerk-config';

export const SignUpComponent: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md w-full">
        <SignUp
          appearance={clerkAppearance}
          routing="path"
          path="/sign-up"
          redirectUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
};