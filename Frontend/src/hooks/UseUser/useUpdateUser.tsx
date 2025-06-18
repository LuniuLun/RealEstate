import { IUser } from '@type/models'
import useCustomToast from '@hooks/UseCustomToast'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { IApiResponse } from '@type/apiResponse'
import { updateUser } from '@services/user'
import { updateInfiniteCache, updateItemInArray } from '@utils'
import { UserPageData } from '@hooks/UseUser/useGetUser'

interface UseUpdateUserReturn {
  updateUserMutation: UseMutationResult<IApiResponse<IUser>, Error, IUser>
  isLoading: boolean
  isError: boolean
}

const useUpdateUser = (queryKey: unknown[]): UseUpdateUserReturn => {
  const queryClient = useQueryClient()
  const { showToast } = useCustomToast()

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: ({ data, message, status }) => {
      showToast({ title: message, status })

      if (!data) return

      updateInfiniteCache(queryClient, queryKey, (page) => {
        const typedPage = page.data as UserPageData
        const updatedUsers = updateItemInArray(typedPage.users, data)

        return {
          ...page,
          data: {
            users: updatedUsers,
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
    updateUserMutation,
    isLoading: updateUserMutation.isPending,
    isError: updateUserMutation.isError
  }
}

export default useUpdateUser
