import { IUser } from '@type/models'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { IApiResponse } from '@type/apiResponse'
import { updateStatusUser } from '@services/user'
import { updateInfiniteCache, updateItemInArray } from '@utils'
import { UserPageData } from '@hooks/UseUser/useGetUser'
import useCustomToast from '@hooks/UseCustomToast'

interface UseUpdateStatusUserReturn {
  updateStatusUserMutation: UseMutationResult<IApiResponse<IUser>, Error, number>
  isLoading: boolean
  isError: boolean
}

const useUpdateStatusUser = (queryKey: unknown[]): UseUpdateStatusUserReturn => {
  const queryClient = useQueryClient()
  const { showToast } = useCustomToast()

  const updateStatusUserMutation = useMutation({
    mutationFn: updateStatusUser,
    onSuccess: ({ data, message, status }) => {
      showToast({ title: message, status })

      if (!data) return

      updateInfiniteCache(queryClient, queryKey, (page) => {
        const typedPage = page.data as UserPageData
        const updateStatusdUsers = updateItemInArray(typedPage.users, data)

        return {
          ...page,
          data: {
            users: updateStatusdUsers,
            total: typedPage.total
          }
        }
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
    updateStatusUserMutation,
    isLoading: updateStatusUserMutation.isPending,
    isError: updateStatusUserMutation.isError
  }
}

export default useUpdateStatusUser
