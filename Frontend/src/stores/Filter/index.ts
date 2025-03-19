import { create } from 'zustand'

export interface FilterState {
  searchQuery: string
  sortBy: string
  itemsPerPage: number
  currentPage: number
  setCurrentPage: (currentPage: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: string) => void
}

const filterStore = create<FilterState>((set) => ({
  searchQuery: '',
  sortBy: '',
  itemsPerPage: 12,
  currentPage: 0,
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
    })
}))

export default filterStore
