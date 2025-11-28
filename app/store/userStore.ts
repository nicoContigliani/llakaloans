'use client';

import { UserWithRoles } from '@/organization-module';
import { create } from 'zustand';

interface UserState {
  userRoles: UserWithRoles | null;
  isLoading: boolean;
  setUserRoles: (roles: UserWithRoles) => void;
  clearUserRoles: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userRoles: null,
  isLoading: false,
  setUserRoles: (roles: UserWithRoles) => set({ userRoles: roles }),
  clearUserRoles: () => set({ userRoles: null }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
}));