import { useQuery } from '@tanstack/react-query'
import { fetchPropertyCounts } from '@services/property'
import { IPropertyStatistic } from '@type/models'

interface UsePropertyStatisticReturn {
  propertyStatistics: IPropertyStatistic | undefined
  isLoading: boolean
  isError: boolean
}

const usePropertyStatistic = (): UsePropertyStatisticReturn => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['propertyStatistics'],
    queryFn: async () => {
      return await fetchPropertyCounts()
    }
  })

  return {
    propertyStatistics: data?.data,
    isLoading,
    isError
  }
}

export default usePropertyStatistic
