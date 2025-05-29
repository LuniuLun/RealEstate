import MESSAGE from '@constants/message'
import { useAddTransaction, useCustomToast, useGetTransactionByUser, useUpgradeUser, useValidateToken } from '@hooks'
import { VnpayPaymentStatus } from '@type/vnpayPaymentStatus'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { Box, Flex, Heading, Stack } from '@chakra-ui/react'
import { useEffect, useMemo, useRef } from 'react'
import { CustomTable, Filter, Pagination } from '@components'
import { ITEM_PER_PAGE, SORT_TRANSACTION_OPTION } from '@constants/option'
import { transactionSummaryTable } from '@utils'
import { TPostTransaction } from '@type/models/transaction'
import useAuthStore from '@stores/Authentication'
import { IUser, TransactionType } from '@type/models'
import transactionFilterStore from '@stores/TransactionFilter'

const TransactionHistory = () => {
  const [searchParams] = useSearchParams()
  const { showToast } = useCustomToast()
  const { token } = useAuthStore()
  const { itemsPerPage, currentPage, searchQuery, sortBy } = transactionFilterStore(
    useShallow((state) => ({
      itemsPerPage: state.itemsPerPage,
      currentPage: state.currentPage,
      searchQuery: state.searchQuery,
      sortBy: state.sortBy
    }))
  )
  const { setItemsPerPage, setCurrentPage, setSearchQuery, setSortBy } = transactionFilterStore()
  const { transactions, transactionsQuery, totalTransactions, isError } = useGetTransactionByUser()
  const { upgradeUserMutation } = useUpgradeUser()
  const { addTransactionMutation } = useAddTransaction()
  const navigate = useNavigate()
  const location = useLocation()
  const validateToken = useValidateToken()

  const transactionStatus = searchParams.get('vnp_TransactionStatus')
  const responseCode = searchParams.get('vnp_ResponseCode')
  const amount = searchParams.get('vnp_Amount')
  const isSuccess = transactionStatus === VnpayPaymentStatus.SUCCESS && responseCode === VnpayPaymentStatus.SUCCESS
  const hasProcessedTransaction = useRef(false)

  useEffect(() => {
    if (!hasProcessedTransaction.current && transactionStatus && responseCode && amount && validateToken()) {
      hasProcessedTransaction.current = true

      if (isSuccess) {
        const userId = token?.user?.id
        const newTransaction: TPostTransaction = {
          user: token?.user as IUser,
          transactionType: TransactionType.UPGRADE,
          amount: Number(amount) / 100
        }

        Promise.all([
          new Promise((resolve, reject) => {
            addTransactionMutation.mutate(newTransaction, {
              onSuccess: resolve,
              onError: reject
            })
          }),
          new Promise((resolve, reject) => {
            if (userId) {
              upgradeUserMutation.mutate(userId, {
                onSuccess: resolve,
                onError: reject
              })
            } else {
              reject(new Error('Người dùng không tồn tại'))
            }
          })
        ])
          .then(() => {
            showToast({
              status: 'success',
              title: MESSAGE.payment.PAY_SUCCESS
            })
          })
          .catch(() => {
            showToast({
              status: 'error',
              title: MESSAGE.payment.PAY_FAILED
            })
          })
      } else {
        showToast({
          status: 'error',
          title: MESSAGE.payment.PAY_FAILED
        })
      }
    }

    navigate(location.pathname, { replace: true })
  }, [])

  const dataTable = useMemo(() => {
    const transformedData = transactions?.map(transactionSummaryTable) || []
    return transformedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  }, [transactions, currentPage, itemsPerPage])

  if (isError) {
    return (
      <Heading variant='secondary' color='brand.red' p={10}>
        Chưa thực hiện giao dịch nào
      </Heading>
    )
  }

  return (
    <Stack mt={6} gap={6}>
      <Filter
        sortOptions={SORT_TRANSACTION_OPTION}
        searchQuery={searchQuery}
        sortBy={sortBy}
        setSearchQuery={setSearchQuery}
        setSortBy={setSortBy}
      />
      <Box>
        <CustomTable data={dataTable} title='Giao dịch của tôi' isLoaded={!transactionsQuery.isFetching} />

        <Flex justifyContent='center' mt={4}>
          <Pagination
            totalItems={totalTransactions}
            fetchNextPage={transactionsQuery.fetchNextPage}
            hasNextPage={transactionsQuery.hasNextPage}
            itemsPerPageOptions={ITEM_PER_PAGE}
            isLoaded={!transactionsQuery.isFetching || !transactionsQuery.isFetchingNextPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </Flex>
      </Box>
    </Stack>
  )
}

export default TransactionHistory
