import { IToken } from '@type/models'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  token: IToken | null
  storeToken: (currentToken: IToken) => void
  logout: () => void
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      storeToken: (currentToken: IToken) => set({ token: currentToken }),
      logout: () => set({ token: null })
    }),
    {
      name: 'auth-storage'
    }
  )
)

export default useAuthStore
