import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchProperties, fetchPropertyCountsByCategoryAndStatus } from '@services/property'
import { IProperty, PropertyStatus } from '@type/models'
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
  const { searchQuery, sortBy, itemsPerPage, filterCriteria } = filterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      itemsPerPage: state.itemsPerPage,
      filterCriteria: state.filterCriteria
    }))
  )

  const queryClient = useQueryClient()

  const infinitePropertyQueryKey = ['properties', itemsPerPage, searchQuery, sortBy, JSON.stringify(filterCriteria)]

  const totalPropertiesQueryKey = [
    'propertiesCount',
    searchQuery,
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

  const propertiesQuery = useInfiniteQuery({
    queryKey: infinitePropertyQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchProperties({
        page: pageParam.toString(),
        limit: itemsPerPage.toString(),
        property: searchQuery ? 'title' : '',
        value: searchQuery,
        sortBy,
        typeOfSort: 'desc',
        filterCriteria
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.data || lastPage.data.length === 0) return undefined
      return lastPageParam + 1
    },
    refetchOnWindowFocus: false
  })

  const totalPropertiesQuery = useQuery({
    queryKey: totalPropertiesQueryKey,
    queryFn: () => fetchPropertyCountsByCategoryAndStatus(PropertyStatus.APPROVAL, filterCriteria.category || 1),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })

  const totalProperties = useMemo(() => {
    return totalPropertiesQuery?.data?.data?.count || 0
  }, [totalPropertiesQuery.data])

  // Flatten property data
  const properties = useMemo(() => {
    if (!propertiesQuery.data) return []

    return propertiesQuery.data.pages.flatMap((page) => {
      if (!page.data) return []
      return page.data
    })
  }, [propertiesQuery.data])

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
