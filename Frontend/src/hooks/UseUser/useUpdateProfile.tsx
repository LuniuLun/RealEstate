import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '@services/user'
import { IUser } from '@type/models'
import { useCustomToast } from '@hooks'
import useAuthStore from '@stores/Authentication'
import MESSAGE from '@constants/message'

const useEditProfile = () => {
  const queryClient = useQueryClient()
  const { showToast } = useCustomToast()
  const storeToken = useAuthStore((state) => state.storeToken)

  return useMutation({
    mutationFn: (userData: IUser) => updateUser(userData),
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
}

export default useEditProfile
