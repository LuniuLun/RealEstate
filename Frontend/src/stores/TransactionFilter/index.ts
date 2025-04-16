import { DEFAULT_VALUES_FILTER } from '@constants/defaultFilter'
import { BaseFilterState } from '@type/baseFilterState'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const transactionFilterStore = create<BaseFilterState>()(
  persist(
    (set) => ({
      ...DEFAULT_VALUES_FILTER,
      setCurrentPage: (currentPage) => set({ currentPage }),
      setSearchQuery: (query) =>
        set((state) => (state.searchQuery !== query ? { searchQuery: query, currentPage: 0 } : state)),
      setSortBy: (sort) => set((state) => (state.sortBy !== sort ? { sortBy: sort, currentPage: 0 } : state)),
      setItemsPerPage: (itemsPerPage) =>
        set((state) => (state.itemsPerPage !== itemsPerPage ? { itemsPerPage, currentPage: 0 } : state)),
      resetFilters: () => set(DEFAULT_VALUES_FILTER)
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
