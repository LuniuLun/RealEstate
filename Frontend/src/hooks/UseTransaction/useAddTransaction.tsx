import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { IApiResponse } from '@type/apiResponse'
import { updateInfiniteCache } from '@utils'
import { addTransactionsHistory } from '@services/transaction'
import { ITransaction, TPostTransaction } from '@type/models/transaction'
import useGetTransactionByUser from './useGetTransactionByUser'

interface UseAddTransactionReturn {
  addTransactionMutation: UseMutationResult<IApiResponse<ITransaction>, Error, TPostTransaction>
}

const useAddTransaction = (): UseAddTransactionReturn => {
  const queryClient = useQueryClient()
  const { infiniteTransactionQueryKey, reCallQuery } = useGetTransactionByUser()

  const addTransactionMutation = useMutation({
    mutationFn: addTransactionsHistory,
    onSuccess: (response, newTransaction) => {
      if (response.status === 'success') {
        updateInfiniteCache(queryClient, infiniteTransactionQueryKey, (page) => {
          const { transactions, total } = page.data as { transactions: ITransaction[]; total: number }
          return {
            ...page,
            data: {
              transactions: [newTransaction, ...transactions],
              total: total + 1
            }
          }
        })
      }

      reCallQuery()
    }
  })

  return {
    addTransactionMutation
  }
}

export default useAddTransaction
