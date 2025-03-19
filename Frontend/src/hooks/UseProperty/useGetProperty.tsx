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
  infinitePropertyQueryKey: (string | number)[]
  totalPropertiesQueryKey: (string | number)[]
  reCallQuery: () => void
  isLoading: boolean
  isError: boolean
}

const useGetProperty = (): UseGetPropertyReturn => {
  const { searchQuery, sortBy, itemsPerPage } = filterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      itemsPerPage: state.itemsPerPage
    }))
  )

  const queryClient = useQueryClient()
  const infinitePropertyQueryKey = ['properties', itemsPerPage, searchQuery, sortBy]
  // New query key for total count
  const totalPropertiesQueryKey = ['propertiesCount', searchQuery]

  const propertiesQuery = useInfiniteQuery({
    queryKey: infinitePropertyQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchProperties({
        page: pageParam.toString(),
        limit: itemsPerPage.toString(),
        property: searchQuery ? 'title' : '', // Only add property filter if search query exists
        value: searchQuery,
        sortBy,
        typeOfSort: 'desc'
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.data || lastPage.data.length === 0) return undefined
      return lastPageParam + 1
    },
    refetchOnWindowFocus: false
  })

  // New query for total approved properties count
  const totalPropertiesQuery = useQuery({
    queryKey: totalPropertiesQueryKey,
    queryFn: () => fetchPropertyCounts(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })

  // Get total properties - will use the approved count
  const totalProperties = useMemo(() => {
    return totalPropertiesQuery?.data?.data?.approved || 0
  }, [totalPropertiesQuery.data])

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
