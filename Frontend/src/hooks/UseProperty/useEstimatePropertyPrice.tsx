import { IEstimatePropertyResult, TPostProperty } from '@type/models'
import useCustomToast from '@hooks/UseCustomToast'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { IApiResponse } from '@type/apiResponse'
import { estimatePropertyPrice } from '@services/property'

interface UseEstimatePropertyPriceReturn {
  estimatePropertyPriceMutation: UseMutationResult<IApiResponse<IEstimatePropertyResult>, Error, TPostProperty>
  isLoading: boolean
  isError: boolean
}

export const useEstimatePropertyPrice = (): UseEstimatePropertyPriceReturn => {
  const { showToast } = useCustomToast()

  const estimatePropertyPriceMutation = useMutation({
    mutationFn: estimatePropertyPrice,
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
    isLoading: estimatePropertyPriceMutation.isPending,
    isError: estimatePropertyPriceMutation.isError,
    estimatePropertyPriceMutation
  }
}
