import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchProperties } from '@services/property'
import { IProperty } from '@type/models'
import { filterStore } from '@stores'
import { useShallow } from 'zustand/shallow'

interface UseGetPropertyReturn {
  properties: IProperty[] | undefined
  propertiesQuery: ReturnType<typeof useInfiniteQuery>
  totalProperties: number
  infinitePropertyQueryKey: (string | number | object)[]
  reCallQuery: () => void
  isLoading: boolean
  isError: boolean
}

interface PropertyResponse {
  data: { properties: IProperty[]; total: number }
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

  const propertiesQuery = useInfiniteQuery({
    queryKey: infinitePropertyQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return (await fetchProperties({
        page: pageParam.toString(),
        limit: itemsPerPage.toString(),
        property: searchQuery ? 'title' : '',
        value: searchQuery,
        sortBy,
        typeOfSort: 'desc',
        filterCriteria
      })) as unknown as PropertyResponse
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.data.properties || lastPage.data.properties.length === 0) return undefined
      const totalPages = Math.ceil(lastPage.data.total / itemsPerPage)
      return lastPageParam < totalPages ? lastPageParam + 1 : undefined
    },
    refetchOnWindowFocus: false
  })

  const properties = useMemo(() => {
    if (!propertiesQuery.data) return []

    return propertiesQuery.data.pages.flatMap((page) => {
      if (!page.data) return []

      return page.data.properties
    })
  }, [propertiesQuery.data])

  const totalProperties = useMemo(() => {
    if (!propertiesQuery.data || propertiesQuery.data.pages.length === 0) return 0
    return propertiesQuery.data.pages[0].data.total || 0
  }, [propertiesQuery.data])

  const reCallQuery = () => {
    queryClient.invalidateQueries({ queryKey: infinitePropertyQueryKey })
  }

  const isLoading = propertiesQuery.isLoading
  const isError = propertiesQuery.isError

  return {
    properties,
    propertiesQuery,
    totalProperties,
    reCallQuery,
    infinitePropertyQueryKey,
    isLoading,
    isError
  }
}

export default useGetProperty
