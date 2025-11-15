'use client';

import { UserButton as ClerkUserButton } from "@clerk/nextjs";
import { clerkAppearance } from "../../lib/config/clerk-config";

export const UserButton: React.FC = () => {
  return (
    <ClerkUserButton
      appearance={{
        elements: clerkAppearance.elements
      }}
      afterSignOutUrl="/"
    />
  );
};