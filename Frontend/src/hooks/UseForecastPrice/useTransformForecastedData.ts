import { useMemo } from 'react'
import { ForecastResponse, PricePrediction } from '@type/models/forecast'
import { formatDate } from '@utils'
import { ViewMode } from '@components/ForecastChart'

interface UseForecastDataProps {
  forecastData: ForecastResponse | null
  viewMode: ViewMode
}

interface ForecastDataItem {
  date: string
  'Giá dự đoán': number
}

const useTransformForecastedData = ({ forecastData, viewMode }: UseForecastDataProps) => {
  const formatDailyChartData = (predictions: PricePrediction[]): ForecastDataItem[] => {
    return predictions.map((prediction) => ({
      date: formatDate(new Date(prediction.date)),
      'Giá dự đoán': prediction.predictedPrice
    }))
  }

  const formatMonthlyChartData = (predictions: PricePrediction[]): ForecastDataItem[] => {
    const monthlyData: Record<
      string,
      {
        predictedSum: number
        count: number
      }
    > = {}

    predictions.forEach((prediction) => {
      const date = new Date(prediction.date)
      const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          predictedSum: 0,
          count: 0
        }
      }

      monthlyData[monthKey].predictedSum += prediction.predictedPrice
      monthlyData[monthKey].count += 1
    })

    return Object.entries(monthlyData).map(([date, data]) => ({
      date,
      'Giá dự đoán': Math.round(data.predictedSum / data.count)
    }))
  }

  const data = useMemo(() => {
    if (!forecastData) return []
    return viewMode === 'daily'
      ? formatDailyChartData(forecastData.predictions)
      : formatMonthlyChartData(forecastData.predictions)
  }, [forecastData, viewMode])

  const { minY, maxY } = useMemo(() => {
    if (data.length === 0) return { minY: 0, maxY: 0 }

    const allValues = data.flatMap((d) => [d['Giá dự đoán']])
    return {
      minY: Math.min(...allValues),
      maxY: Math.max(...allValues)
    }
  }, [data])

  return {
    data,
    minY,
    maxY
  }
}

export default useTransformForecastedData
