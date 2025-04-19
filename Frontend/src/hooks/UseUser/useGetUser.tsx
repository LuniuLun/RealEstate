import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchUsers } from '@services/user'
import { IUser } from '@type/models'
import { userFilterStore } from '@stores'
import { useShallow } from 'zustand/shallow'

export interface UseGetUserReturn {
  users: IUser[] | undefined
  usersQuery: ReturnType<typeof useInfiniteQuery>
  totalUsers: number
  infiniteUserQueryKey: (string | number | object)[]
  reCallQuery: () => void
  isLoading: boolean
  isError: boolean
}

export interface UserPageData {
  users: IUser[]
  total: number
}

interface UserResponse {
  data: UserPageData
}

const useGetUser = (): UseGetUserReturn => {
  const { searchQuery, sortBy, itemsPerPage, userFilterCriteria } = userFilterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      itemsPerPage: state.itemsPerPage,
      userFilterCriteria: state.userFilterCriteria
    }))
  )

  const queryClient = useQueryClient()

  const infiniteUserQueryKey = ['users', itemsPerPage, searchQuery, sortBy, JSON.stringify(userFilterCriteria)]

  const usersQuery = useInfiniteQuery({
    queryKey: infiniteUserQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return (await fetchUsers({
        page: pageParam.toString(),
        limit: itemsPerPage.toString(),
        property: 'searchQuery',
        value: searchQuery,
        sortBy,
        typeOfSort: 'desc',
        userFilterCriteria
      })) as unknown as UserResponse
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.data.users || lastPage.data.users.length === 0) return undefined
      const totalPages = Math.ceil(lastPage.data.total / itemsPerPage)
      return lastPageParam < totalPages ? lastPageParam + 1 : undefined
    },
    refetchOnWindowFocus: false
  })

  const users = useMemo(() => {
    if (!usersQuery.data) return []

    return usersQuery.data.pages.flatMap((page) => {
      if (!page.data) return []

      return page.data.users
    })
  }, [usersQuery.data])

  const totalUsers = useMemo(() => {
    if (!usersQuery.data || usersQuery.data.pages.length === 0) return 0
    return usersQuery.data.pages[0].data.total || 0
  }, [usersQuery.data])

  const reCallQuery = () => {
    queryClient.invalidateQueries({ queryKey: infiniteUserQueryKey })
  }

  const isLoading = usersQuery.isLoading
  const isError = usersQuery.isError

  return {
    users,
    usersQuery,
    totalUsers,
    reCallQuery,
    infiniteUserQueryKey,
    isLoading,
    isError
  }
}

export default useGetUser
