import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchProperties, fetchPropertyCounts } from '@services/property'
import { IProperty } from '@type/models'
import { filterStore } from '@stores'
import { useShallow } from 'zustand/shallow'

interface UseGetPropertyReturn {
  properties: IProperty[] | undefined
  propertiesQuery: ReturnType<typeof useInfiniteQuery>
  totalProperties: number
  infinitePropertyQueryKey: (string | number | object)[]
  totalPropertiesQueryKey: (string | number | object)[]
  reCallQuery: () => void
  isLoading: boolean
  isError: boolean
}

const useGetProperty = (): UseGetPropertyReturn => {
  // Get all filter states
  const { searchQuery, sortBy, itemsPerPage, filterCriteria } = filterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      itemsPerPage: state.itemsPerPage,
      filterCriteria: state.filterCriteria
    }))
  )

  const queryClient = useQueryClient()

  // Create a query key that includes all filter criteria
  const infinitePropertyQueryKey = [
    'properties',
    itemsPerPage,
    searchQuery,
    sortBy,
    // Stringify the filter criteria to ensure it works properly as a cache key
    JSON.stringify(filterCriteria)
  ]

  // Query key for total count - includes search and filters that affect count
  const totalPropertiesQueryKey = [
    'propertiesCount',
    searchQuery,
    // Include only filter criteria that would affect total count
    JSON.stringify({
      minPrice: filterCriteria.minPrice,
      maxPrice: filterCriteria.maxPrice,
      minArea: filterCriteria.minArea,
      maxArea: filterCriteria.maxArea,
      bedrooms: filterCriteria.bedrooms,
      direction: filterCriteria.direction,
      category: filterCriteria.category,
      furnishedStatus: filterCriteria.furnishedStatus,
      landType: filterCriteria.landType,
      location: filterCriteria.location
    })
  ]

  // Enhanced query with all filter parameters
  const propertiesQuery = useInfiniteQuery({
    queryKey: infinitePropertyQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchProperties({
        page: pageParam.toString(),
        limit: itemsPerPage.toString(),
        property: searchQuery ? 'title' : '', // Only add property filter if search query exists
        value: searchQuery,
        sortBy,
        typeOfSort: 'desc',
        filterCriteria // Pass all filter criteria to the API
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.data || lastPage.data.length === 0) return undefined
      return lastPageParam + 1
    },
    refetchOnWindowFocus: false
  })

  // Query for total count with stale time to reduce API calls
  const totalPropertiesQuery = useQuery({
    queryKey: totalPropertiesQueryKey,
    queryFn: () => fetchPropertyCounts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })

  // Get total properties
  const totalProperties = useMemo(() => {
    return totalPropertiesQuery?.data?.data?.approved || 0
  }, [totalPropertiesQuery.data])

  // Flatten property data
  const properties = useMemo(() => {
    if (!propertiesQuery.data) return []

    return propertiesQuery.data.pages.flatMap((page) => {
      if (!page.data) return []
      return page.data
    })
  }, [propertiesQuery.data])

  // Function to invalidate queries
  const reCallQuery = () => {
    queryClient.invalidateQueries({ queryKey: totalPropertiesQueryKey })
    queryClient.invalidateQueries({ queryKey: infinitePropertyQueryKey })
  }

  const isLoading = propertiesQuery.isLoading || totalPropertiesQuery.isLoading
  const isError = propertiesQuery.isError || totalPropertiesQuery.isError

  return {
    properties,
    propertiesQuery,
    totalProperties,
    reCallQuery,
    infinitePropertyQueryKey,
    totalPropertiesQueryKey,
    isLoading,
    isError
  }
}

export default useGetProperty
