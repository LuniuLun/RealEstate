export interface ForecastRequest {
  district: string
  periodDays: number
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
