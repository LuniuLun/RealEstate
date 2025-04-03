import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface TransactionFilterState {
  searchQuery: string
  sortBy: string
  itemsPerPage: number
  currentPage: number
  setCurrentPage: (currentPage: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: string) => void
  resetFilters: () => void
}

const DEFAULT_VALUES = {
  searchQuery: '',
  sortBy: '',
  itemsPerPage: 5,
  currentPage: 0
}

const transactionFilterStore = create<TransactionFilterState>()(
  persist(
    (set) => ({
      ...DEFAULT_VALUES,
      setCurrentPage: (currentPage) => set({ currentPage }),
      setSearchQuery: (query) =>
        set((state) => (state.searchQuery !== query ? { searchQuery: query, currentPage: 0 } : state)),
      setSortBy: (sort) => set((state) => (state.sortBy !== sort ? { sortBy: sort, currentPage: 0 } : state)),
      setItemsPerPage: (itemsPerPage) =>
        set((state) => (state.itemsPerPage !== itemsPerPage ? { itemsPerPage, currentPage: 0 } : state)),
      resetFilters: () => set(DEFAULT_VALUES)
    }),
    {
      name: 'transaction-filters',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
        itemsPerPage: state.itemsPerPage,
        currentPage: state.currentPage
      })
    }
  )
)

export default transactionFilterStore
