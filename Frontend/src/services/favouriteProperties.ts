import { IApiResponse } from '@type/apiResponse'
import MESSAGE from '@constants/message'
import { IFavouriteProperty } from '@type/models'
import { authStore } from '@stores'
import { IFilterOptions } from '@type/filterOptions'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_FAVOURITE_PROPERTIES_ENDPOINT}`

export const fetchFavouriteProperties = async (
  userId: number | undefined,
  params: IFilterOptions = {
    page: '1',
    limit: '5',
    typeOfSort: 'desc'
  }
): Promise<IApiResponse<IFavouriteProperty[]>> => {
  try {
    const { property = '', value = '', sortBy = '', typeOfSort = 'desc', limit = '5', page = '1' } = params

    const calledUrl = new URL(`${baseUrl}/${userId}`)
    const token = authStore.getState().token?.token

    calledUrl.searchParams.append('page', page)
    calledUrl.searchParams.append('limit', limit)

    if (property && value) {
      calledUrl.searchParams.append(property, value)
    }

    if (sortBy) {
      calledUrl.searchParams.append('sortBy', sortBy)
      calledUrl.searchParams.append('typeOfSort', typeOfSort)
    } else {
      calledUrl.searchParams.append('sortBy', 'createdAt')
      calledUrl.searchParams.append('typeOfSort', 'desc')
    }

    const response = await fetch(calledUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      }
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.property.GET_FAILED
      }
    }

    const data = await response.json()

    return {
      status: 'success',
      message: MESSAGE.property.GET_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const toggleFavouriteProperty = async (
  userId: number,
  propertyId: number
): Promise<IApiResponse<IFavouriteProperty>> => {
  try {
    const token = authStore.getState().token?.token
    const response = await fetch(`${baseUrl}/${userId}/property/${propertyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      }
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.favouriteProperty.EDIT_FAILED
      }
    }

    const data = await response.json()

    return {
      status: 'success',
      message: MESSAGE.favouriteProperty.EDIT_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}
