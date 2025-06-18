import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUserById } from '@services/user'
import { IUser } from '@type/models'
import { findInCache } from '@utils'

interface UseGetUserByIdReturn {
  user: IUser | undefined
  isLoading: boolean
  isError: boolean
}

const useGetUserById = (id: number | undefined, queryString?: string): UseGetUserByIdReturn => {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return
      if (id && queryString) {
        const cacheUser = findInCache(queryClient, id, queryString)
        if (cacheUser) return { data: cacheUser }
      }
      return await fetchUserById(id)
    },
    enabled: !!id
  })

  return {
    user: data?.data as IUser,
    isLoading,
    isError
  }
}

export default useGetUserById
