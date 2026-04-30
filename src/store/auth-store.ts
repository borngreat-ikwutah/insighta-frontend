import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '#/lib/api/auth'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  setUser: (user: User | null) => void
  clearTokens: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      clearTokens: () => set({ accessToken: null, refreshToken: null, user: null }),
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'insighta-auth-storage',
    }
  )
)
