import { useQuery, QueryClient } from '@tanstack/react-query'
import { fetchPropertyById } from '@services/property'
import { IProperty } from '@type/models'
import { findPropertyInCache } from '@utils'

interface UseGetPropertyByIdReturn {
  property: IProperty | undefined
  isLoading: boolean
  isError: boolean
}

const useGetPropertyById = (
  id: number,
  queryClient?: QueryClient | null,
  queryString?: string
): UseGetPropertyByIdReturn => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (queryClient && id && queryString) {
        const cacheProperty = findPropertyInCache(queryClient, id, queryString)
        if (cacheProperty) return { data: cacheProperty }
      }
      return await fetchPropertyById(id)
    },
    enabled: !!id
  })

  return {
    property: data?.data,
    isLoading,
    isError
  }
}

export default useGetPropertyById
