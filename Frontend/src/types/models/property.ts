// src/types/propertyModels.ts
import { CategoryName, PropertyStatus } from './enums'
import { IHouse } from './house'
import { ILand } from './land'
import { IUser } from './user'

export interface ICategory {
  id: number
  name: CategoryName
}

export interface IPropertyLegalDocument {
  id: number
  name: string
}

export interface IProperty {
  id: number
  user: IUser
  category: ICategory
  status: PropertyStatus
  title: string
  description: string
  region: string
  districtName: string
  wardName: string
  streetName: string
  longitude: number
  latitude: number
  propertyLegalDocument: IPropertyLegalDocument
  direction: number
  area: number
  length: number
  width: number
  images: string
  price: number
  createdAt: string
  updatedAt: string
  house?: IHouse | null
  land?: ILand | null
}

export type TPostProperty = Omit<
  IProperty,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'images' | 'house' | 'land'
> & {
  house?: Omit<IHouse, 'id'> | null
  land?: Omit<ILand, 'id'> | null
}

export interface IFavouriteProperty {
  id: number
  user: IUser
  property: IProperty
}

export interface IPropertyStatistic {
  approved: number
  canceled: number
  pending: number
}
