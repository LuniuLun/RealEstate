import { IApiResponse } from '@type/apiResponse'
import MESSAGE from '@constants/message'
import { IProperty } from '@type/models'
import { IFilterOptions } from '@type/filterOptions'
import { authStore } from '@stores'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_PROPERTY_ENDPOINT}`

export const fetchProperties = async (
  params: IFilterOptions = {
    page: '1',
    limit: '12',
    typeOfSort: 'desc'
  }
): Promise<IApiResponse<IProperty[]>> => {
  try {
    const { property = '', value = '', sortBy = '', typeOfSort = 'desc', limit = '12', page = '1' } = params

    const calledUrl = new URL(baseUrl)
    calledUrl.searchParams.append('page', page)
    calledUrl.searchParams.append('limit', limit)

    // Add property and value if provided
    if (property && value) {
      calledUrl.searchParams.append(property, value)
    }

    // Add sorting parameters
    if (sortBy) {
      calledUrl.searchParams.append('sortBy', sortBy)
      calledUrl.searchParams.append('typeOfSort', typeOfSort)
    } else {
      calledUrl.searchParams.append('sortBy', 'createdAt')
      calledUrl.searchParams.append('typeOfSort', 'desc')
    }

    // If user is not admin, only show APPROVAL status properties
    const user = authStore.getState().user
    if (!user || !user.roles.includes('admin')) {
      calledUrl.searchParams.append('status', 'APPROVAL')
    }

    const response = await fetch(calledUrl.toString())

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

// Function to get property counts by status
export const fetchPropertyCounts = async (): Promise<IApiResponse<Record<string, number>>> => {
  try {
    const response = await fetch(`${baseUrl}/counts`)

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

// Function to get property count by specific status
export const fetchPropertyCountByStatus = async (status: string): Promise<IApiResponse<{ count: number }>> => {
  try {
    const response = await fetch(`${baseUrl}/count/${status}`)

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

// Function to get property count by status and category
export const fetchPropertyCountByStatusAndCategory = async (
  status: string,
  categoryId: number
): Promise<IApiResponse<{ count: number }>> => {
  try {
    const response = await fetch(`${baseUrl}/count/${status}/category/${categoryId}`)

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

// Function to get current user's property count by status
export const fetchMyPropertyCountByStatus = async (status: string): Promise<IApiResponse<{ count: number }>> => {
  try {
    const response = await fetch(`${baseUrl}/count/${status}/my`)

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
export const addProperty = async (newProperty: IProperty): Promise<IApiResponse<IProperty>> => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProperty)
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.property.ADD_FAILED
      }
    }

    const data = await response.json()
    return {
      status: 'success',
      message: MESSAGE.property.ADD_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const editProperty = async (newProperty: IProperty): Promise<IApiResponse<IProperty>> => {
  try {
    if (!newProperty.id) {
      throw new Error('Property ID is required for editing.')
    }

    const response = await fetch(`${baseUrl}/${newProperty.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProperty)
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.property.EDIT_FAILED
      }
    }

    const data = await response.json()
    return {
      status: 'success',
      message: MESSAGE.property.EDIT_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const deleteProperty = async (id: string): Promise<IApiResponse<IProperty>> => {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.property.DELETE_FAILED
      }
    }

    const data = await response.json()
    return {
      status: 'success',
      message: MESSAGE.property.DELETE_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}
