import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchProperties } from '@services/property'
import { IProperty } from '@type/models'
import { propertyFilterStore } from '@stores'
import { useShallow } from 'zustand/shallow'

export interface UseGetPropertyReturn {
  properties: IProperty[] | undefined
  propertiesQuery: ReturnType<typeof useInfiniteQuery>
  totalProperties: number
  infinitePropertyQueryKey: (string | number | object)[]
  reCallQuery: () => void
  isLoading: boolean
  isError: boolean
}

export interface PropertyPageData {
  properties: IProperty[]
  total: number
}

interface PropertyResponse {
  data: PropertyPageData
}

const useGetProperty = (): UseGetPropertyReturn => {
  const { searchQuery, sortBy, itemsPerPage, propertyFilterCriteria, currentPage } = propertyFilterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      itemsPerPage: state.itemsPerPage,
      propertyFilterCriteria: state.propertyFilterCriteria,
      currentPage: state.currentPage
    }))
  )

  const queryClient = useQueryClient()

  const infinitePropertyQueryKey = [
    'properties',
    itemsPerPage,
    currentPage,
    searchQuery,
    sortBy,
    JSON.stringify(propertyFilterCriteria)
  ]

  const propertiesQuery = useInfiniteQuery({
    queryKey: infinitePropertyQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return (await fetchProperties({
        page: pageParam.toString(),
        limit: itemsPerPage.toString(),
        property: 'searchQuery',
        value: searchQuery,
        sortBy,
        typeOfSort: 'desc',
        propertyFilterCriteria
      })) as unknown as PropertyResponse
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.data?.properties || lastPage.data.properties.length === 0) return undefined
      const totalPages = Math.ceil(lastPage.data.total / itemsPerPage)
      return lastPageParam < totalPages ? lastPageParam + 1 : undefined
    },
    refetchOnWindowFocus: false
  })

  useMemo(() => {
    queryClient.resetQueries({ queryKey: ['properties'] })
  }, [itemsPerPage, queryClient])

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
    queryClient.invalidateQueries({ queryKey: ['properties'] })
  }

  const isLoading = propertiesQuery.isLoading || propertiesQuery.isFetching
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
