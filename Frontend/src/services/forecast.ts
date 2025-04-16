import { IApiResponse } from '@type/apiResponse'
import MESSAGE from '@constants/message'
import { ForecastRequest, ForecastResponse } from '@type/models/forecast'
import { authStore } from '@stores'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_FORECAST_ENDPOINT}`

export const forecastLandPrice = async (forecastRequest: ForecastRequest): Promise<IApiResponse<ForecastResponse>> => {
  const token = authStore.getState().token?.token

  try {
    const response = await fetch(`${baseUrl}/land`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(forecastRequest)
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: 'error',
        message: data?.message || MESSAGE.forecast.FORECAST_FAILED
      }
    }

    return {
      status: 'success',
      message: MESSAGE.forecast.FORECAST_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}
