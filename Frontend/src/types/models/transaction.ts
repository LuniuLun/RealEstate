import { TransactionType } from './enums'
import { IUser } from './user'

export interface ITransaction {
  transactionId: number
  user: IUser
  transactionType: TransactionType
  amount: number
  createdAt: Date
  updatedAt: Date
}
