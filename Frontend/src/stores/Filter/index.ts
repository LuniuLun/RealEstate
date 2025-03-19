import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FilterCriteria {
  minPrice: number
  maxPrice: number
  minArea: number
  maxArea: number
  bedrooms?: number
  direction?: number
  category?: number
  furnishedStatus?: number
  landType?: number
  houseFeatures?: number[]
  landFeatures?: number[]
  location?: {
    province?: string
    district?: string
    ward?: string
  }
}

export interface FilterState {
  searchQuery: string
  sortBy: string
  itemsPerPage: number
  currentPage: number
  filterCriteria: FilterCriteria

  setCurrentPage: (currentPage: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: string) => void
  setFilterCriteria: (criteria: Partial<FilterCriteria>) => void
  resetFilters: () => void
}

const initialFilterCriteria: FilterCriteria = {
  minPrice: 0,
  maxPrice: 0,
  minArea: 0,
  maxArea: 0,
  bedrooms: undefined,
  direction: undefined,
  category: 1,
  furnishedStatus: undefined,
  landType: undefined,
  houseFeatures: [],
  landFeatures: [],
  location: {
    province: undefined,
    district: undefined,
    ward: undefined
  }
}

const filterStore = create<FilterState>()(
  persist(
    (set) => ({
      searchQuery: '',
      sortBy: '',
      itemsPerPage: 12,
      currentPage: 0,
      filterCriteria: initialFilterCriteria,

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

      setFilterCriteria: (criteria: Partial<FilterCriteria>) =>
        set((state) => {
          const newFilterCriteria = {
            ...state.filterCriteria,
            ...criteria,
            location: criteria.location
              ? { ...state.filterCriteria.location, ...criteria.location }
              : state.filterCriteria.location,
            houseFeatures: criteria.houseFeatures ?? state.filterCriteria.houseFeatures,
            landFeatures: criteria.landFeatures ?? state.filterCriteria.landFeatures
          }
          return {
            filterCriteria: newFilterCriteria,
            currentPage: 0
          }
        }),

      resetFilters: () =>
        set(() => ({
          filterCriteria: initialFilterCriteria,
          currentPage: 0
        }))
    }),
    {
      name: 'property-filter-storage',
      partialize: (state) => ({
        itemsPerPage: state.itemsPerPage,
        sortBy: state.sortBy
      })
    }
  )
)

export default filterStore
