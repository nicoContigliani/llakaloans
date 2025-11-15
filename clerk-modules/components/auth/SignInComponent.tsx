'use client';

import { SignIn } from '@clerk/nextjs';
import { clerkAppearance } from '../../lib/config/clerk-config';

export const SignInComponent: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-md w-full">
        <SignIn
          appearance={clerkAppearance}
          routing="path"
          path="/sign-in"
          redirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
};