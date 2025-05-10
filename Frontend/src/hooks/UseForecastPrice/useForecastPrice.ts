import { useMutation, UseMutationResult } from '@tanstack/react-query'
import useCustomToast from '@hooks/UseCustomToast'
import { IApiResponse } from '@type/apiResponse'
import { ForecastPrice } from '@services/forecast'
import { ForecastRequest, ForecastResponse } from '@type/models/forecast'

interface UseForecastPriceReturn {
  ForecastPriceMutation: UseMutationResult<IApiResponse<ForecastResponse>, Error, ForecastRequest>
  isLoading: boolean
  isError: boolean
}

const useForecastPrice = (): UseForecastPriceReturn => {
  const { showToast } = useCustomToast()

  const ForecastPriceMutation = useMutation({
    mutationFn: ForecastPrice,
    onSuccess: (response) => {
      if (response) {
        showToast({
          title: response.message,
          status: response.status
        })
      }
    },
    onError: (error) => {
      showToast({
        title: error.message,
        status: 'error'
      })
    }
  })

  return {
    isLoading: ForecastPriceMutation.isPending,
    isError: ForecastPriceMutation.isError,
    ForecastPriceMutation
  }
}

export default useForecastPrice
