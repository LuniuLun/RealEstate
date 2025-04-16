export interface BaseFilterState {
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
