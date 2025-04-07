import { IToken } from '@type/models'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  token: IToken | null
  favouritePropertyIds: number[]
  storeToken: (currentToken: IToken) => void
  storeFavouritePropertyIds: (favouritePropertyIds: number[]) => void
  logout: () => void
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      favouritePropertyIds: [],
      storeToken: (currentToken: IToken) => set({ token: currentToken }),
      storeFavouritePropertyIds: (favouritePropertyIds: number[]) => set({ favouritePropertyIds }),
      logout: () => set({ token: null, favouritePropertyIds: [] })
    }),
    {
      name: 'auth-storage'
    }
  )
)

export default useAuthStore
