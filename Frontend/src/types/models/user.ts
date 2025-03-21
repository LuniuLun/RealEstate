import { ITableRow } from '@components/CustomTable'
import { RoleName } from './enums'

export interface IRole {
  id: number
  name: RoleName
}

export interface IUser {
  id: number
  role: IRole
  email: string
  password: string
  phone: string
  createdAt: string
  updatedAt: string
}

export interface IToken {
  id: number
  user: IUser
  token: string
  expiresAt: string
  createdAt: string
}

export interface TransformedUser extends Pick<IUser, 'id'>, ITableRow {
  name: React.ReactNode
  createdAt: string
  role: React.ReactNode
}
