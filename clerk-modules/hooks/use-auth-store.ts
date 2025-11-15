import { useAuthStore as useAuthZustandStore } from "../stores/auth-store";

// Exportar el hook del store directamente
export const useAuthStore = useAuthZustandStore;

// Selectores específicos
export const useAuthState = () => useAuthZustandStore((state) => ({
  user: state.user,
  isLoaded: state.isLoaded,
  isSignedIn: state.isSignedIn,
  isLoading: state.isLoading,
}));

export const useAuthActions = () => useAuthZustandStore((state) => ({
  setAuthState: state.setAuthState,
  clearAuth: state.clearAuth,
  refreshUserData: state.refreshUserData,
}));

export const useAuthUser = () => useAuthZustandStore((state) => state.user);

export const useAuthStatus = () => useAuthZustandStore((state) => ({
  isLoaded: state.isLoaded,
  isSignedIn: state.isSignedIn,
  isLoading: state.isLoading,
}));