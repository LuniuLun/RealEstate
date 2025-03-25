export interface IFurnishedStatus {
  id: number
  name: string
}

export interface IHouseType {
  id: number
  name: string
}

export interface IHouseCharacteristic {
  id: number
  name: string
}

export interface IHouse {
  id: number
  houseType: IHouseType
  bedrooms: number
  floors: number
  toilets: number
  furnishedStatus: IFurnishedStatus
  houseCharacteristicMappings: IHouseCharacteristicMapping[]
}

export interface IHouseCharacteristicMapping {
  id: number
  house: IHouse
  houseCharacteristic: IHouseCharacteristic
}
