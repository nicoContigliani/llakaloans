import { User } from "@clerk/nextjs/server";

export interface ClerkAuthHook {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface AuthState {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  isLoading: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export interface AuthStore extends AuthState {
  setAuthState: (state: Partial<AuthState>) => void;
  clearAuth: () => void;
  refreshUserData: (user: User | null) => void;
}