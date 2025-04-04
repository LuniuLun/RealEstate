import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProperty } from '@services/property'
import { IProperty } from '@type/models'
import { IApiResponse } from '@type/apiResponse'
import { updateInfiniteCache } from '@utils'
import removeItemFromArray from '@utils/RemoveItemFromArray'
import useAuthStore from '@stores/Authentication'
import { PropertyPageData } from './useGetProperty'

const useDeleteProperty = (queryKey: unknown[]) => {
  const queryClient = useQueryClient()
  const { token } = useAuthStore()
  const deletePropertyMutation = useMutation<IApiResponse<IProperty>, Error, number>({
    mutationFn: deleteProperty,
    onSuccess: (response, id) => {
      if (response.status === 'success') {
        updateInfiniteCache(queryClient, queryKey, (page) => {
          const { properties, total } = page.data as unknown as PropertyPageData
          return {
            ...page,
            data: {
              properties: removeItemFromArray(properties, id),
              total: Math.max(0, total - 1)
            }
          }
        })
        if (token) {
          queryClient.invalidateQueries({
            queryKey: ['propertyStatistics', token.user.id]
          })
        }
      }
    }
  })

  return { deletePropertyMutation }
}

export default useDeleteProperty
