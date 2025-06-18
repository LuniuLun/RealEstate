import { QueryClient, InfiniteData } from '@tanstack/react-query'

const findInCache = <T extends { id: number | string }>(
  queryClient: QueryClient,
  id: number | string,
  dataPath: string,
  queryString?: string
): T | null => {
  if (!id) return null

  try {
    const cache = queryClient.getQueryCache()
    const queries = cache
      .getAll()
      .filter((q) => Array.isArray(q.queryKey) && (!queryString || q.queryKey.includes(queryString)))

    for (const q of queries) {
      const infData = queryClient.getQueryData<InfiniteData<Record<string, unknown>>>(q.queryKey)
      if (!infData?.pages) continue

      for (const page of infData.pages) {
        let container: unknown =
          typeof page === 'object' && page !== null && 'data' in page ? (page as Record<string, unknown>).data : page

        for (const part of dataPath.split('.')) {
          if (typeof container === 'object' && container !== null && part in container) {
            container = (container as Record<string, unknown>)[part]
          } else {
            container = undefined
            break
          }
        }

        if (Array.isArray(container)) {
          for (const item of container) {
            if (
              typeof item === 'object' &&
              item !== null &&
              'id' in item &&
              (item as Record<string, unknown>).id === id
            ) {
              return item as T
            }
          }
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error searching in cache:', error)
    return null
  }
}

export default findInCache
