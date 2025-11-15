import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore } from '../types/auth';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoaded: false,
      isSignedIn: false,
      isLoading: false,

      setAuthState: (state) => set((current) => ({ ...current, ...state })),
      
      clearAuth: () => set({ 
        user: null, 
        isSignedIn: false, 
        isLoaded: true,
        isLoading: false 
      }),
      
      refreshUserData: (user) => set({ 
        user, 
        isSignedIn: !!user 
      }),
    }),
    {
      name: 'clerk-auth-storage',
      // Solo persistir datos no sensibles
      partialize: (state) => ({ 
        user: state.user ? {
          id: state.user.id,
          firstName: state.user.firstName,
          lastName: state.user.lastName,
          emailAddresses: state.user.emailAddresses,
          imageUrl: state.user.imageUrl,
        } : null,
        isSignedIn: state.isSignedIn 
      }),
    }
  )
);