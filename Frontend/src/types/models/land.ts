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
  landType: ILandType
  landCharacteristicMappings: ILandCharacteristicMapping[] | []
}

export interface ILandCharacteristicMapping {
  id: number
  landCharacteristic: ILandCharacteristic
}
