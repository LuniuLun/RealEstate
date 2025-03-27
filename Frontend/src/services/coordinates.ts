import MESSAGE from '@constants/message'
import { IApiResponse } from '@type/apiResponse'
import { Coordinates } from '@type/coordinates'

const GEOCODE_URL = import.meta.env.VITE_APP_GEOCODE_URL

export const getCoordinates = async (address: string): Promise<IApiResponse<Coordinates>> => {
  const url = new URL(GEOCODE_URL)
  url.searchParams.append('q', address)
  url.searchParams.append('format', 'jsonv2')

  try {
    const response = await fetch(url.toString(), {
      headers: { 'User-Agent': 'your_app_name' }
    })
    const data = await response.json()

    if (!response.ok || !data[0]) {
      return {
        status: 'error',
        message: MESSAGE.coordinates.GET_FAILED
      }
    }

    return {
      status: 'success',
      message: MESSAGE.coordinates.GET_SUCCESS,
      data: {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      }
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}
