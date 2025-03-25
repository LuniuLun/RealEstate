import { useQuery } from '@tanstack/react-query'
import { fetchPropertyById } from '@services/property'
import { IProperty } from '@type/models'

interface UseGetPropertyByIdReturn {
  property: IProperty | undefined
  isLoading: boolean
  isError: boolean
}

const useGetPropertyById = (id: string): UseGetPropertyByIdReturn => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchPropertyById(id),
    enabled: !!id
  })

  return {
    property: data?.data,
    isLoading,
    isError
  }
}

export default useGetPropertyById
