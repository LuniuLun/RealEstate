import { useMutation, UseMutationResult } from '@tanstack/react-query'
import useCustomToast from '@hooks/UseCustomToast'
import { IApiResponse } from '@type/apiResponse'
import { forecastLandPrice } from '@services/forecast'
import { ForecastRequest, ForecastResponse } from '@type/models/forecast'

interface UseForecastLandPriceReturn {
  forecastLandPriceMutation: UseMutationResult<IApiResponse<ForecastResponse>, Error, ForecastRequest>
  isLoading: boolean
  isError: boolean
}

const useForecastLandPrice = (): UseForecastLandPriceReturn => {
  const { showToast } = useCustomToast()

  const forecastLandPriceMutation = useMutation({
    mutationFn: forecastLandPrice,
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
    isLoading: forecastLandPriceMutation.isPending,
    isError: forecastLandPriceMutation.isError,
    forecastLandPriceMutation
  }
}

export default useForecastLandPrice
