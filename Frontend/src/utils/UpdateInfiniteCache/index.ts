import { InfiniteData, QueryClient } from '@tanstack/react-query'

export interface QueryData<T> {
  data: T
  page: number
  limit: number
}

const updateInfiniteCache = <T>(
  queryClient: QueryClient,
  queryKey: unknown[],
  updateFn: (page: QueryData<T>) => QueryData<T>
) => {
  const existingData = queryClient.getQueryData<InfiniteData<QueryData<T>>>(queryKey)
  if (!existingData) {
    queryClient.invalidateQueries({ queryKey })
    return
  }

  queryClient.setQueryData<InfiniteData<QueryData<T>>>(queryKey, (oldData) => {
    if (!oldData) return existingData

    const updatedPages = oldData.pages.map((page) => ({
      ...page,
      data: updateFn(page).data
    }))

    return {
      ...oldData,
      pages: updatedPages,
      pageParams: oldData.pageParams
    }
  })
}

export default updateInfiniteCache
