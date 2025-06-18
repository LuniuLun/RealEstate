import { IProperty, PropertyStatus } from '@type/models'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { IApiResponse } from '@type/apiResponse'
import { updateStatusProperty } from '@services/property'
import { updateInfiniteCache, updateItemInArray } from '@utils'
import { PropertyPageData } from './useGetProperty'
import useCustomToast from '@hooks/UseCustomToast'

interface UseUpdateStatusPropertyReturn {
  updateStatusPropertyMutation: UseMutationResult<
    IApiResponse<IProperty>,
    Error,
    { id: number; status: PropertyStatus }
  >
  isLoading: boolean
  isError: boolean
}

const useUpdateStatusProperty = (queryKey: unknown[]): UseUpdateStatusPropertyReturn => {
  const { showToast } = useCustomToast()
  const queryClient = useQueryClient()

  const updateStatusPropertyMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: PropertyStatus }) => updateStatusProperty(id, status),
    onSuccess: (response, variables) => {
      if (response) {
        showToast({
          title: response.message,
          status: response.status
        })
      }

      updateInfiniteCache(queryClient, queryKey, (page) => {
        const { properties, total } = page.data as unknown as PropertyPageData
        const updatedProperties = updateItemInArray(properties, { id: variables.id, status: variables.status })

        return {
          ...page,
          data: {
            properties: updatedProperties,
            total
          }
        }
      })

      queryClient.invalidateQueries({
        queryKey: ['propertyStatistics']
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
    isLoading: updateStatusPropertyMutation.isPending,
    isError: updateStatusPropertyMutation.isError,
    updateStatusPropertyMutation
  }
}

export default useUpdateStatusProperty
