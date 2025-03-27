import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { IUser, TRegisterUserRequest } from '@type/models'
import { IApiResponse } from '@type/apiResponse'
import MESSAGE from '@constants/message'
import { registerUser } from '@services/auth'

interface UseRegisterUserReturn {
  registerUserMutation: UseMutationResult<IApiResponse<IUser>, Error, TRegisterUserRequest>
}

const useRegisterUser = (): UseRegisterUserReturn => {
  const navigate = useNavigate()
  const toast = useToast()

  const registerUserMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response: IApiResponse<IUser>) => {
      toast({
        title: response.message,
        status: response.status
      })
      if (response.status === 'success') navigate('/login')
    },
    onError: (error: Error) => {
      toast({
        title: error.message || MESSAGE.auth.REGISTER_FAILED,
        status: 'error'
      })
    }
  })

  return {
    registerUserMutation
  }
}

export default useRegisterUser
