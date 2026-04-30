import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Organization } from '@/types';

interface AuthState {
  // User Auth State
  user: User | null;
  isUserAuthenticated: boolean;
  isUserLoading: boolean;
  userError: string | null;

  // Organization Auth State
  organization: Organization | null;
  isOrgAuthenticated: boolean;
  isOrgLoading: boolean;
  orgError: string | null;

  // Active Role
  activeRole: 'user' | 'org' | null;

  // Actions
  setUser: (user: User | null) => void;
  setUserAuthenticated: (isAuthenticated: boolean) => void;
  setUserLoading: (isLoading: boolean) => void;
  setUserError: (error: string | null) => void;

  setOrganization: (organization: Organization | null) => void;
  setOrgAuthenticated: (isAuthenticated: boolean) => void;
  setOrgLoading: (isLoading: boolean) => void;
  setOrgError: (error: string | null) => void;

  setActiveRole: (role: 'user' | 'org' | null) => void;

  clearUserAuth: () => void;
  clearOrgAuth: () => void;
  clearAllAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // User Auth State
      user: null,
      isUserAuthenticated: false,
      isUserLoading: false,
      userError: null,

      // Organization Auth State
      organization: null,
      isOrgAuthenticated: false,
      isOrgLoading: false,
      orgError: null,

      // Active Role
      activeRole: null,

      // User Actions
      setUser: (user) => set({ user, isUserAuthenticated: !!user }),
      setUserAuthenticated: (isUserAuthenticated) => set({ isUserAuthenticated }),
      setUserLoading: (isUserLoading) => set({ isUserLoading }),
      setUserError: (userError) => set({ userError }),

      // Org Actions
      setOrganization: (organization) => set({ organization, isOrgAuthenticated: !!organization }),
      setOrgAuthenticated: (isOrgAuthenticated) => set({ isOrgAuthenticated }),
      setOrgLoading: (isOrgLoading) => set({ isOrgLoading }),
      setOrgError: (orgError) => set({ orgError }),

      // Active Role
      setActiveRole: (activeRole) => set({ activeRole }),

      // Clear Actions
      clearUserAuth: () =>
        set({
          user: null,
          isUserAuthenticated: false,
          userError: null,
        }),

      clearOrgAuth: () =>
        set({
          organization: null,
          isOrgAuthenticated: false,
          orgError: null,
        }),

      clearAllAuth: () =>
        set({
          user: null,
          isUserAuthenticated: false,
          userError: null,
          organization: null,
          isOrgAuthenticated: false,
          orgError: null,
          activeRole: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isUserAuthenticated: state.isUserAuthenticated,
        organization: state.organization,
        isOrgAuthenticated: state.isOrgAuthenticated,
        activeRole: state.activeRole,
      }),
    }
  )
);

export default useAuthStore;
