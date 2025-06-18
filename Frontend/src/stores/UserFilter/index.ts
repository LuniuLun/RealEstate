import { DEFAULT_VALUES_FILTER } from '@constants/defaultFilter'
import { BaseFilterState } from '@type/baseFilterState'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserFilterCriteria {
  isEnabled: number
}

export interface FilterState extends BaseFilterState {
  userFilterCriteria: UserFilterCriteria
  setUserFilterCriteria: (criteria: Partial<UserFilterCriteria>) => void
}

const initialUserFilterCriteria: UserFilterCriteria = {
  isEnabled: -1
}

const userFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...DEFAULT_VALUES_FILTER,
      userFilterCriteria: initialUserFilterCriteria,

      setUserFilterCriteria: (criteria: Partial<UserFilterCriteria>) =>
        set((state) => {
          const newUserFilterCriteria = {
            ...state.userFilterCriteria,
            ...criteria
          }
          return {
            userFilterCriteria: newUserFilterCriteria,
            currentPage: 0
          }
        }),

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
          userFilterCriteria: initialUserFilterCriteria,
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
