import { TPostProperty } from './property'

export interface ForecastRequest {
  periodDays: number
  property: TPostProperty
}

export interface PricePrediction {
  date: Date
  predictedPrice: number
}

export interface ForecastResponse {
  periodDays: number
  predictions: PricePrediction[]
}
