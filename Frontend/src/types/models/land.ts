import { IProperty } from './property'

export interface ILandType {
  id: number
  name: string
}

export interface ILandCharacteristic {
  id: number
  name: string
}

export interface ILand {
  id: number
  property: IProperty
  landType: ILandType
  landCharacteristicMappings: ILandCharacteristicMapping[]
}

export interface ILandCharacteristicMapping {
  id: number
  land: ILand
  landCharacteristic: ILandCharacteristic
}
