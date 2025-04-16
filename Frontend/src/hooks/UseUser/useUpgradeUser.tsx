import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { upgradeUser } from '@services/user'
import { IUser } from '@type/models'
import { useCustomToast } from '@hooks'
import useAuthStore from '@stores/Authentication'
import MESSAGE from '@constants/message'
import { IApiResponse } from '@type/apiResponse'

interface UseUpgradeUserReturn {
  upgradeUserMutation: UseMutationResult<IApiResponse<IUser>, Error, number>
}

const useUpgradeUser = (): UseUpgradeUserReturn => {
  const { showToast } = useCustomToast()
  const queryClient = useQueryClient()
  const storeToken = useAuthStore((state) => state.storeToken)

  const upgradeUserMutation = useMutation({
    mutationFn: (id: number) => upgradeUser(id),
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        queryClient.setQueryData(['currentUser'], response.data)

        const currentToken = useAuthStore.getState().token
        if (currentToken) {
          storeToken({
            ...currentToken,
            user: response.data
          })
        }

        showToast({
          status: 'success',
          title: response.message
        })
      } else {
        showToast({
          status: 'error',
          title: response.message
        })
      }
    },
    onError: (error) => {
      showToast({
        status: 'error',
        title: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
      })
    }
  })

  return { upgradeUserMutation }
}

export default useUpgradeUser
