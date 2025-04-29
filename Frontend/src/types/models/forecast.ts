export interface ForecastRequest {
  district: string
  periodDays: number
  width: number
  length: number
  floors: number
  rooms: number
  toilets: number
  landCharacteristics: number[]
  categoryId: number
  directionId: number
  furnishingId: number
}

export interface PricePrediction {
  date: Date
  district: string
  predictedPrice: number
  minPrice: number
  maxPrice: number
}

export interface ForecastResponse {
  district: string
  periodDays: number
  predictions: PricePrediction[]
}
