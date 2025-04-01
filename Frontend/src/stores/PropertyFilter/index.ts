import { PropertyStatus } from '@type/models'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PropertyFilterCriteria {
  minPrice: number
  maxPrice: number
  minArea: number
  maxArea: number
  bedrooms?: number
  toilets?: number
  direction?: number
  category?: number
  furnishedStatus?: number
  status: PropertyStatus | undefined
  landType?: number
  houseType?: number
  houseCharacteristics?: number[]
  landCharacteristics?: number[]
  location?: {
    province?: string
    district?: string
    ward?: string
  }
}

export interface PropertyFilterState {
  searchQuery: string
  sortBy: string
  itemsPerPage: number
  currentPage: number
  propertyFilterCriteria: PropertyFilterCriteria

  setCurrentPage: (currentPage: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: string) => void
  setPropertyFilterCriteria: (criteria: Partial<PropertyFilterCriteria>) => void
  resetFilters: () => void
}

const initialPropertyFilterCriteria: PropertyFilterCriteria = {
  minPrice: 0,
  maxPrice: 0,
  minArea: 0,
  maxArea: 0,
  bedrooms: undefined,
  toilets: undefined,
  direction: undefined,
  category: -1,
  furnishedStatus: undefined,
  status: undefined,
  landType: undefined,
  houseType: undefined,
  houseCharacteristics: [],
  landCharacteristics: [],
  location: {
    province: undefined,
    district: undefined,
    ward: undefined
  }
}

const propertyFilterStore = create<PropertyFilterState>()(
  persist(
    (set) => ({
      searchQuery: '',
      sortBy: '',
      itemsPerPage: 12,
      currentPage: 0,
      propertyFilterCriteria: initialPropertyFilterCriteria,

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

      setPropertyFilterCriteria: (criteria: Partial<PropertyFilterCriteria>) =>
        set((state) => {
          const newPropertyFilterCriteria = {
            ...state.propertyFilterCriteria,
            ...criteria,
            location: criteria.location
              ? { ...state.propertyFilterCriteria.location, ...criteria.location }
              : state.propertyFilterCriteria.location,
            houseCharacteristics: criteria.houseCharacteristics ?? state.propertyFilterCriteria.houseCharacteristics,
            landCharacteristics: criteria.landCharacteristics ?? state.propertyFilterCriteria.landCharacteristics
          }
          return {
            propertyFilterCriteria: newPropertyFilterCriteria,
            currentPage: 0
          }
        }),

      resetFilters: () =>
        set(() => ({
          propertyFilterCriteria: initialPropertyFilterCriteria,
          currentPage: 0
        }))
    }),
    {
      name: 'property-filter-storage',
      partialize: (state) => ({
        itemsPerPage: state.itemsPerPage
      })
    }
  )
)

export default propertyFilterStore
