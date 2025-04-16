import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { IFavouriteProperty } from '@type/models'
import { authStore, favouritePropertyFilterStore } from '@stores'
import { useShallow } from 'zustand/shallow'
import { UseGetPropertyReturn } from '@hooks/UseProperty/useGetProperty'
import { fetchFavouriteProperties } from '@services/favouriteProperties'

export interface FavouritePropertyPageData {
  favouriteProperties: IFavouriteProperty[]
  total: number
}

export interface FavouritePropertyResponse {
  data: FavouritePropertyPageData
}

interface UseGetFavouritePropertyReturn extends Omit<UseGetPropertyReturn, 'properties'> {
  properties: IFavouriteProperty[]
}

const useGetFavouriteProperty = (): UseGetFavouritePropertyReturn => {
  const { searchQuery, sortBy, itemsPerPage } = favouritePropertyFilterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      itemsPerPage: state.itemsPerPage
    }))
  )
  const queryClient = useQueryClient()

  const user = authStore.getState().token?.user
  const infinitePropertyQueryKey = ['favouriteProperties', itemsPerPage, searchQuery, sortBy]

  const propertiesQuery = useInfiniteQuery({
    queryKey: infinitePropertyQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return (await fetchFavouriteProperties(user?.id, {
        page: pageParam.toString(),
        limit: itemsPerPage.toString(),
        property: 'searchQuery',
        value: searchQuery,
        sortBy,
        typeOfSort: 'desc'
      })) as unknown as FavouritePropertyResponse
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.data || !lastPage.data.favouriteProperties || lastPage.data.favouriteProperties.length === 0)
        return undefined
      const totalPages = Math.ceil(lastPage.data.total / itemsPerPage)
      return lastPageParam < totalPages ? lastPageParam + 1 : undefined
    },
    refetchOnWindowFocus: false
  })

  const properties = useMemo(() => {
    if (!propertiesQuery.data) return []

    return propertiesQuery.data.pages.flatMap((page) => {
      if (!page.data) return []

      return page.data.favouriteProperties
    })
  }, [propertiesQuery.data])

  const totalProperties = useMemo(() => {
    if (!propertiesQuery.data || propertiesQuery.data.pages.length === 0) return 0
    return propertiesQuery.data.pages[0].data?.total || 0
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

export default useGetFavouriteProperty
