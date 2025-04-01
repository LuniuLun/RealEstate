import { QueryClient } from '@tanstack/react-query'
import { IProperty } from '@type/models'

interface QueryData {
  pages?: { data?: { properties?: IProperty[] } }[]
}

const findPropertyInCache = (queryClient: QueryClient, id: number, queryString?: string): IProperty | null => {
  if (!id) return null

  try {
    const queryCache = queryClient.getQueryCache()
    const queryKeys = queryCache
      .getAll()
      .filter((query) => Array.isArray(query.queryKey) && (queryString ? query.queryKey.includes(queryString) : true))

    for (const query of queryKeys) {
      const queryData = queryClient.getQueryData<QueryData>(query.queryKey)
      if (!queryData?.pages) continue

      for (const page of queryData.pages) {
        if (!page?.data?.properties) continue
        const foundProperty = page.data.properties.find((property) => property.id === id)
        if (foundProperty) return foundProperty
      }
    }
    return null
  } catch (err) {
    console.error('Error searching property in cache:', err)
    return null
  }
}

export default findPropertyInCache
