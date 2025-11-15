// Exportaciones principales
export { ClerkProviderWrapper } from './components/auth/ClerkProviderWrapper';
export { ProtectedRoute } from './components/auth/ProtectedRoute';
export { AuthButtons } from './components/auth/AuthButtons';
export { UserProfile } from './components/auth/UserProfile';
export { SignInComponent } from './components/auth/SignInComponent';
export { SignUpComponent } from './components/auth/SignUpComponent';

// Hooks
export { useClerkAuth } from './hooks/use-clerk-auth';
export {
    useAuthStore,
    useAuthState,
    useAuthActions,
    useAuthUser,
    useAuthStatus
} from './hooks/use-auth-store';

// Utils (CLIENT ONLY)
export {
    AuthUtils,
    useAuth,
    useAuthActions as useClientAuthActions,
    useRequireAuth
} from './utils/auth-utils';

export { ProxyUtils } from './utils/proxy-utils';

// Stores
export { useAuthStore as authStore } from './stores/auth-store';

// Config
export { clerkConfig, clerkAppearance } from './lib/config/clerk-config';
export { proxyConfig } from './lib/config/proxy-config';

// Proxy
export { ClerkProxy } from './lib/auth/proxy';

// Types
export type { AuthState, ClerkAuthHook, ProtectedRouteProps } from './types/auth';
export type { ClerkModuleConfig, ProxyHandlerConfig } from './types/clerk';