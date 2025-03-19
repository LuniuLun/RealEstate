import { IApiResponse } from '@type/apiResponse'
import MESSAGE from '@constants/message'
import { IProperty } from '@type/models'
import { authStore } from '@stores'
import { FilterCriteria } from '@stores/Filter'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_PROPERTY_ENDPOINT}`

export interface EnhancedFilterOptions {
  page?: string
  limit?: string
  property?: string
  value?: string
  sortBy?: string
  typeOfSort?: 'asc' | 'desc'
  filterCriteria?: FilterCriteria
}

export const fetchProperties = async (
  params: EnhancedFilterOptions = {
    page: '1',
    limit: '12',
    typeOfSort: 'desc'
  }
): Promise<IApiResponse<IProperty[]>> => {
  try {
    const {
      property = '',
      value = '',
      sortBy = '',
      typeOfSort = 'desc',
      limit = '12',
      page = '1',
      filterCriteria
    } = params

    const calledUrl = new URL(baseUrl)
    calledUrl.searchParams.append('page', page)
    calledUrl.searchParams.append('limit', limit)

    // Add basic property and value if provided
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

    // Add complex filter criteria if provided
    if (filterCriteria) {
      // Price range
      if (filterCriteria.minPrice && filterCriteria.minPrice > 0) {
        calledUrl.searchParams.append('minPrice', filterCriteria.minPrice.toString())
      }
      if (filterCriteria.maxPrice && filterCriteria.maxPrice > 0) {
        calledUrl.searchParams.append('maxPrice', filterCriteria.maxPrice.toString())
      }

      // Area range
      if (filterCriteria.minArea && filterCriteria.minArea > 0) {
        calledUrl.searchParams.append('minArea', filterCriteria.minArea.toString())
      }
      if (filterCriteria.maxArea && filterCriteria.maxArea > 0) {
        calledUrl.searchParams.append('maxArea', filterCriteria.maxArea.toString())
      }

      // Bedrooms
      if (filterCriteria.bedrooms !== undefined) {
        calledUrl.searchParams.append('bedrooms', filterCriteria.bedrooms.toString())
      }

      // Direction
      if (filterCriteria.direction !== undefined) {
        calledUrl.searchParams.append('direction', filterCriteria.direction.toString())
      }

      // Property type
      if (filterCriteria.category !== undefined) {
        calledUrl.searchParams.append('category', filterCriteria.category.toString())
      }

      // Furnished status
      if (filterCriteria.furnishedStatus !== undefined) {
        calledUrl.searchParams.append('furnishedStatus', filterCriteria.furnishedStatus.toString())
      }

      // Land type
      if (filterCriteria.landType !== undefined) {
        calledUrl.searchParams.append('landType', filterCriteria.landType.toString())
      }

      // House features (Array)
      if (filterCriteria.houseFeatures?.length) {
        calledUrl.searchParams.append('houseFeatures', filterCriteria.houseFeatures.join(','))
      }

      // Land features (Array)
      if (filterCriteria.landFeatures?.length) {
        calledUrl.searchParams.append('landFeatures', filterCriteria.landFeatures.join(','))
      }

      // Location filters
      if (filterCriteria.location?.province) {
        calledUrl.searchParams.append('province', filterCriteria.location.province)
      }
      if (filterCriteria.location?.district) {
        calledUrl.searchParams.append('district', filterCriteria.location.district)
      }
      if (filterCriteria.location?.ward) {
        calledUrl.searchParams.append('ward', filterCriteria.location.ward)
      }
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

// Keep existing functions unchanged
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
