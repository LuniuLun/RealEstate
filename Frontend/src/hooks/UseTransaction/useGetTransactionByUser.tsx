import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { authStore, transactionFilterStore } from '@stores'
import { useShallow } from 'zustand/shallow'
import { ITransaction } from '@type/models/transaction'
import { fetchTransactionsHistoryByUser } from '@services/transaction'

interface UseGetTransactionReturn {
  transactions: ITransaction[] | undefined
  transactionsQuery: ReturnType<typeof useInfiniteQuery>
  totalTransactions: number
  infiniteTransactionQueryKey: (string | number | object)[]
  reCallQuery: () => void
  isLoading: boolean
  isError: boolean
}

interface TransactionResponse {
  data: { transactions: ITransaction[]; total: number }
}

const useGetTransactionByUser = (): UseGetTransactionReturn => {
  const { token } = authStore()
  const { searchQuery, sortBy, itemsPerPage } = transactionFilterStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      itemsPerPage: state.itemsPerPage
    }))
  )

  const queryClient = useQueryClient()

  const infiniteTransactionQueryKey = ['transactions', itemsPerPage, searchQuery, sortBy]

  const transactionsQuery = useInfiniteQuery({
    queryKey: infiniteTransactionQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return (await fetchTransactionsHistoryByUser(
        {
          page: pageParam.toString(),
          limit: itemsPerPage.toString(),
          property: 'searchQuery',
          value: searchQuery,
          sortBy,
          typeOfSort: 'desc'
        },
        token!.user.id
      )) as unknown as TransactionResponse
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.data.transactions || lastPage.data.transactions.length === 0) return undefined
      const totalPages = Math.ceil(lastPage.data.total / itemsPerPage)
      return lastPageParam < totalPages ? lastPageParam + 1 : undefined
    },
    refetchOnWindowFocus: false
  })

  const transactions = useMemo(() => {
    if (!transactionsQuery.data) return []

    return transactionsQuery.data.pages.flatMap((page) => {
      if (!page.data) return []

      return page.data.transactions
    })
  }, [transactionsQuery.data])

  const totalTransactions = useMemo(() => {
    if (!transactionsQuery.data || transactionsQuery.data.pages.length === 0) return 0
    return transactionsQuery.data.pages[0].data.total || 0
  }, [transactionsQuery.data])

  const reCallQuery = () => {
    queryClient.invalidateQueries({ queryKey: infiniteTransactionQueryKey })
  }

  const isLoading = transactionsQuery.isLoading
  const isError = transactionsQuery.isError

  return {
    transactions,
    transactionsQuery,
    totalTransactions,
    reCallQuery,
    infiniteTransactionQueryKey,
    isLoading,
    isError
  }
}

export default useGetTransactionByUser
