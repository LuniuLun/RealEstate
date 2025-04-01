import { PropertyStatus } from '@type/models'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PersonalPropertyFilterCriteria {
  status: PropertyStatus | null
}

export interface FilterState {
  searchQuery: string
  sortBy: string
  itemsPerPage: number
  currentPage: number
  personalPropertyFilterCriteria: PersonalPropertyFilterCriteria

  setCurrentPage: (currentPage: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: string) => void
  setPersonalPropertyFilterCriteria: (criteria: Partial<PersonalPropertyFilterCriteria>) => void
  resetFilters: () => void
}

const initialPersonalPropertyFilterCriteria: PersonalPropertyFilterCriteria = {
  status: null
}

const propertyFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      searchQuery: '',
      sortBy: '',
      itemsPerPage: 5,
      currentPage: 0,
      personalPropertyFilterCriteria: initialPersonalPropertyFilterCriteria,

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

      setPersonalPropertyFilterCriteria: (criteria: Partial<PersonalPropertyFilterCriteria>) =>
        set((state) => {
          const newPersonalPropertyFilterCriteria = {
            ...state.personalPropertyFilterCriteria,
            ...criteria
          }
          return {
            personalPropertyFilterCriteria: newPersonalPropertyFilterCriteria,
            currentPage: 0
          }
        }),

      resetFilters: () =>
        set(() => ({
          personalPropertyFilterCriteria: initialPersonalPropertyFilterCriteria,
          currentPage: 0
        }))
    }),
    {
      name: 'personal-property-filter-storage',
      partialize: (state) => ({
        itemsPerPage: state.itemsPerPage
      })
    }
  )
)

export default propertyFilterStore
