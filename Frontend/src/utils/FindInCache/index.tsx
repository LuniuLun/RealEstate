import { QueryClient, InfiniteData } from '@tanstack/react-query'

const findInCache = <T extends { id: number | string }>(
  queryClient: QueryClient,
  id: number | string,
  dataPath: string,
  queryString?: string
): T | null => {
  if (!id) return null

  try {
    const queryCache = queryClient.getQueryCache()
    const queryKeys = queryCache
      .getAll()
      .filter((query) => Array.isArray(query.queryKey) && (queryString ? query.queryKey.includes(queryString) : true))

    for (const query of queryKeys) {
      const queryData = queryClient.getQueryData<InfiniteData<unknown>>(query.queryKey)
      if (!queryData?.pages) continue

      for (const page of queryData.pages) {
        const pathParts = dataPath.split('.')
        let dataContainer: unknown = page

        for (const part of pathParts) {
          if (!dataContainer || typeof dataContainer !== 'object') break
          dataContainer = (dataContainer as Record<string, unknown>)[part]
        }

        if (!Array.isArray(dataContainer)) continue

        const found = dataContainer.find(
          (item) => typeof item === 'object' && item !== null && 'id' in item && item.id === id
        )

        if (found) return found as T
      }
    }

    return null
  } catch (err) {
    console.error('Error searching in cache:', err)
    return null
  }
}

export default findInCache
