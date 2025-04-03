import { ITransaction } from '@type/models/transaction'
import { formatCurrency } from '@utils'

const transactionSummaryTable = (transaction: ITransaction) => ({
  id: transaction.transactionId,
  'Mã giao dịch': `MGD${transaction.transactionId}`,
  'Loại hình giao dịch': transaction.transactionType,
  Giá: `${formatCurrency(transaction.amount)} VNĐ`,
  'Thời gian giao dịch': new Date(transaction.createdAt).toLocaleDateString()
})

export default transactionSummaryTable
