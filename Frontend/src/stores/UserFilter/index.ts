import { DEFAULT_VALUES_FILTER } from '@constants/defaultFilter'
import { BaseFilterState } from '@type/baseFilterState'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const userFilterStore = create<BaseFilterState>()(
  persist(
    (set) => ({
      ...DEFAULT_VALUES_FILTER,

      setCurrentPage: (currentPage: number) => set(() => ({ currentPage })),

      setSearchQuery: (query: string) =>
        set((state) => {
          if (state.searchQuery !== query) {
            return { searchQuery: query, currentPage: 0 }
          }
          return {}
        }),

      setSortBy: (sort: string) =>
        set((state) => {
          if (state.sortBy !== sort) {
            return { sortBy: sort, currentPage: 0 }
          }
          return {}
        }),

      setItemsPerPage: (itemsPerPage: number) =>
        set((state) => {
          if (state.itemsPerPage !== itemsPerPage) {
            return { itemsPerPage, currentPage: 0 }
          }
          return {}
        }),

      resetFilters: () =>
        set(() => ({
          currentPage: 0
        }))
    }),
    {
      name: 'user-filter-storage',
      partialize: (state) => ({
        itemsPerPage: state.itemsPerPage
      })
    }
  )
)

export default userFilterStore
