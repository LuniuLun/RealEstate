import { fetchCurrentUser } from '@services/user'
import { useQuery } from '@tanstack/react-query'
import { IUser } from '@type/models'

const useGetCurrentUser = () => {
  return useQuery<IUser | undefined>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetchCurrentUser()
      return response.data
    },
    retry: false
  })
}

export default useGetCurrentUser
