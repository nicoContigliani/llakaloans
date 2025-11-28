'use client';

import { Navbar } from '@/clerk-modules/components/Navbar/Navbar';
import { ClerkProviderWrapper } from '../clerk-modules/components/auth/ClerkProviderWrapper';
import './globals.css';
import { Theme } from "@radix-ui/themes";

// Este componente se asegura de que Clerk solo se renderice después de la hidratación
function ClientOnlyClerk({ children }: { children: React.ReactNode }) {
  return (
    <Theme>
      <ClerkProviderWrapper>
        {children}
      </ClerkProviderWrapper>
    </Theme>
  );
}





export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <ClientOnlyClerk>
          <Navbar />
          {children}
        </ClientOnlyClerk>
      </body>
    </html>
  );
}