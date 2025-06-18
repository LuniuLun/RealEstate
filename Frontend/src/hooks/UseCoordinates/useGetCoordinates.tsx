import MESSAGE from '@constants/message'
import useCustomToast from '@hooks/UseCustomToast'
import { getCoordinates } from '@services/coordinates'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { IApiResponse } from '@type/apiResponse'
import { Coordinates } from '@type/coordinates'

interface UseGetCoordinatesReturn {
  getCoordinatesMutation: UseMutationResult<IApiResponse<Coordinates>, Error, string>
  isLoading: boolean
  isError: boolean
}

export const useGetCoordinates = (): UseGetCoordinatesReturn => {
  const { showToast } = useCustomToast()

  const getCoordinatesMutation = useMutation({
    mutationFn: getCoordinates,
    onSuccess: (response) => {
      if (response && response.status === 'success') {
        showToast({
          title: response.message,
          status: response.status
        })
      }
    },
    onError: (error) => {
      console.log(error.message)
      showToast({
        title: MESSAGE.coordinates.GET_FAILED,
        status: 'error'
      })
    }
  })

  return {
    getCoordinatesMutation,
    isLoading: getCoordinatesMutation.isPending,
    isError: getCoordinatesMutation.isError
  }
}
