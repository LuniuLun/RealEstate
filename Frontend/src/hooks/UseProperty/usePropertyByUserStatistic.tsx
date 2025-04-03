import { useQuery } from '@tanstack/react-query'
import { fetchPropertyByUserCounts } from '@services/property'
import { IPropertyStatistic } from '@type/models'

interface UsePropertyStatisticReturn {
  propertyStatistics: IPropertyStatistic | undefined
  isLoading: boolean
  isError: boolean
}

const usePropertyByUserStatistic = (userId: number | undefined): UsePropertyStatisticReturn => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['propertyStatistics', userId],
    queryFn: async () => {
      if (!userId) return undefined
      return await fetchPropertyByUserCounts(userId)
    },
    enabled: !!userId
  })

  return {
    propertyStatistics: data?.data,
    isLoading,
    isError
  }
}

export default usePropertyByUserStatistic
