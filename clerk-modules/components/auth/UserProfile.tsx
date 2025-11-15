'use client';

import { UserProfile as ClerkUserProfile } from '@clerk/nextjs';
import { clerkAppearance } from '../../lib/config/clerk-config';

export const UserProfile: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <ClerkUserProfile
        appearance={clerkAppearance}
        routing="path"
        path="/user-profile"
      />
    </div>
  );
};