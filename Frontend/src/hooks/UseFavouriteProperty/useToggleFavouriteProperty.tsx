import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { IApiResponse } from '@type/apiResponse'
import { toggleIdInArray, updateInfiniteCache } from '@utils'
import useCustomToast from '@hooks/UseCustomToast'
import { toggleFavouriteProperty } from '@services/favouriteProperties'
import { FavouritePropertyPageData } from './useGetFavouriteProperty'
import { IFavouriteProperty } from '@type/models'
import useAuthStore from '@stores/Authentication'

interface UseToggleFavouritePropertyReturn {
  toggleFavouritePropertyMutation: UseMutationResult<
    IApiResponse<IFavouriteProperty>,
    Error,
    { userId: number; propertyId: number }
  >
  isLoading: boolean
  isError: boolean
}

const useToggleFavouriteProperty = (queryKey: unknown[]): UseToggleFavouritePropertyReturn => {
  const favouritePropertyIds = useAuthStore((state) => state.favouritePropertyIds)
  const queryClient = useQueryClient()
  const { storeFavouritePropertyIds } = useAuthStore()
  const { showToast } = useCustomToast()

  const toggleFavouritePropertyMutation = useMutation({
    mutationFn: ({ userId, propertyId }: { userId: number; propertyId: number }) =>
      toggleFavouriteProperty(userId, propertyId),
    onSuccess: (response, variables) => {
      if (response) {
        showToast({
          title: response.message,
          status: response.status
        })
      }
      console.log(variables.propertyId)

      storeFavouritePropertyIds(toggleIdInArray(favouritePropertyIds, variables.propertyId))
      updateInfiniteCache(queryClient, queryKey, (page) => {
        const { favouriteProperties, total } = page.data as unknown as FavouritePropertyPageData

        const updatedProperties = favouriteProperties.filter((property) => property.id !== variables.propertyId)

        return {
          ...page,
          data: {
            favouriteProperties: updatedProperties,
            total: total - 1
          }
        }
      })

      queryClient.invalidateQueries({
        queryKey: ['favouriteProperties']
      })
    },
    onError: (error) => {
      showToast({
        title: error.message,
        status: 'error'
      })
    }
  })

  return {
    isLoading: toggleFavouritePropertyMutation.isPending,
    isError: toggleFavouritePropertyMutation.isError,
    toggleFavouritePropertyMutation
  }
}

export default useToggleFavouriteProperty
