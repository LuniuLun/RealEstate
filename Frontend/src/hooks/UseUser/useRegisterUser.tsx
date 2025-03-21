import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { IUser, TRegisterUserRequest } from '@type/models'
import { IApiResponse } from '@type/apiResponse'
import { registerUser } from '@services/auth'

interface UseAddUserReturn {
  registerUserMutation: UseMutationResult<IApiResponse<IUser>, Error, TRegisterUserRequest>
}

const useRegisterUser = (): UseAddUserReturn => {
  const navigate = useNavigate()

  const registerUserMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      if (response.data) {
        navigate('/login')
      }
    }
  })

  return {
    registerUserMutation
  }
}

export default useRegisterUser
