import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { IToken, TLoginUserRequest } from '@type/models'
import { IApiResponse } from '@type/apiResponse'
import { login } from '@services/auth'
import MESSAGE from '@constants/message'
import { authStore } from '@stores'

interface UseLoginUserReturn {
  loginUserMutation: UseMutationResult<IApiResponse<IToken>, Error, TLoginUserRequest>
}

const useLoginUser = (): UseLoginUserReturn => {
  const navigate = useNavigate()
  const toast = useToast()
  const { storeToken } = authStore()

  const loginUserMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      toast({
        title: response.message,
        status: response.status
      })
      if (response.data && response.status === 'success') {
        navigate('/')
        storeToken(response.data)
      }
    },
    onError: (error: Error) => {
      toast({
        title: error.message || MESSAGE.auth.LOGIN_FAILED,
        status: 'error'
      })
    }
  })

  return {
    loginUserMutation
  }
}

export default useLoginUser
