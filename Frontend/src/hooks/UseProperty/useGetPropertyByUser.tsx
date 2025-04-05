import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchPersonalProperties } from '@services/property'
import { IProperty } from '@type/models'
import { authStore, personalPropertyFilterStore } from '@stores'
import { useShallow } from 'zustand/shallow'
import { UseGetPropertyReturn } from './useGetProperty'

interface PropertyResponse {
  data: { properties: IProperty[]; total: number }
}

const useGetPropertyByUser = (): UseGetPropertyReturn => {
  const { searchQuery, sortBy, itemsPerPage, personalPropertyFilterCriteria } = personalPropertyFilterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      itemsPerPage: state.itemsPerPage,
      personalPropertyFilterCriteria: state.personalPropertyFilterCriteria
    }))
  )
  const queryClient = useQueryClient()

  const user = authStore.getState().token?.user
  const infinitePropertyQueryKey = [
    'personalProperties',
    itemsPerPage,
    searchQuery,
    sortBy,
    JSON.stringify(personalPropertyFilterCriteria)
  ]

  const propertiesQuery = useInfiniteQuery({
    queryKey: infinitePropertyQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return (await fetchPersonalProperties(user?.id, {
        page: pageParam.toString(),
        limit: itemsPerPage.toString(),
        property: 'searchQuery',
        value: searchQuery,
        sortBy,
        typeOfSort: 'desc'
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

export default useGetPropertyByUser
