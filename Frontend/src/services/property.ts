import { IApiResponse } from '@type/apiResponse'
import MESSAGE from '@constants/message'
import {
  IEstimatePropertyResult,
  IProperty,
  IPropertyStatistic,
  PropertyStatus,
  RoleName,
  TPostProperty
} from '@type/models'
import { authStore } from '@stores'
import { PropertyFilterCriteria } from '@stores/PropertyFilter'
import { IFilterOptions } from '@type/filterOptions'
import { PersonalPropertyFilterCriteria } from '@stores/PersonalPropertyFilter'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_PROPERTY_ENDPOINT}`

export interface EnhancedFilterOptions extends IFilterOptions {
  propertyFilterCriteria?: PropertyFilterCriteria
}

export interface EnhancedPersonalFilterOptions extends IFilterOptions {
  personalPropertyFilterCriteria?: PersonalPropertyFilterCriteria
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
      propertyFilterCriteria
    } = params

    const calledUrl = new URL(baseUrl)
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

    if (propertyFilterCriteria) {
      if (propertyFilterCriteria.minPrice && propertyFilterCriteria.minPrice > 0) {
        calledUrl.searchParams.append('minPrice', (propertyFilterCriteria.minPrice * 1_000_000_000).toString())
      }
      if (propertyFilterCriteria.maxPrice && propertyFilterCriteria.maxPrice > 0) {
        calledUrl.searchParams.append('maxPrice', (propertyFilterCriteria.maxPrice * 1_000_000_000).toString())
      }

      if (propertyFilterCriteria.minArea && propertyFilterCriteria.minArea > 0) {
        calledUrl.searchParams.append('minArea', propertyFilterCriteria.minArea.toString())
      }
      if (propertyFilterCriteria.maxArea && propertyFilterCriteria.maxArea > 0) {
        calledUrl.searchParams.append('maxArea', propertyFilterCriteria.maxArea.toString())
      }

      if (propertyFilterCriteria.bedrooms) {
        calledUrl.searchParams.append('bedrooms', propertyFilterCriteria.bedrooms.toString())
      }

      if (propertyFilterCriteria.direction && propertyFilterCriteria.direction > 0) {
        calledUrl.searchParams.append('direction', propertyFilterCriteria.direction.toString())
      }

      if (propertyFilterCriteria.category && propertyFilterCriteria.category > 0) {
        calledUrl.searchParams.append('category', propertyFilterCriteria.category.toString())
      }

      if (propertyFilterCriteria.furnishedStatus) {
        calledUrl.searchParams.append('furnishedStatus', propertyFilterCriteria.furnishedStatus.toString())
      }

      if (propertyFilterCriteria.status && propertyFilterCriteria.status !== PropertyStatus.ALL) {
        calledUrl.searchParams.append('status', propertyFilterCriteria.status.toString())
      }

      if (propertyFilterCriteria.landType) {
        calledUrl.searchParams.append('landType', propertyFilterCriteria.landType.toString())
      }

      if (propertyFilterCriteria.houseType) {
        calledUrl.searchParams.append('houseType', propertyFilterCriteria.houseType.toString())
      }

      if (propertyFilterCriteria.houseCharacteristics?.length) {
        calledUrl.searchParams.append('houseCharacteristics', propertyFilterCriteria.houseCharacteristics.join(','))
      }

      if (propertyFilterCriteria.landCharacteristics?.length) {
        calledUrl.searchParams.append('landCharacteristics', propertyFilterCriteria.landCharacteristics.join(','))
      }

      if (propertyFilterCriteria.location?.province) {
        calledUrl.searchParams.append('province', propertyFilterCriteria.location.province)
      }
      if (propertyFilterCriteria.location?.district) {
        calledUrl.searchParams.append('district', propertyFilterCriteria.location.district)
      }
      if (propertyFilterCriteria.location?.ward) {
        calledUrl.searchParams.append('ward', propertyFilterCriteria.location.ward)
      }
    }

    const user = authStore.getState().token?.user
    if (!user || !(user.role.name === RoleName.ADMIN)) {
      calledUrl.searchParams.append('status', 'APPROVAL')
    }
    console.log(calledUrl.toString())

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
export const fetchPersonalProperties = async (
  userId: number | undefined,
  params: EnhancedPersonalFilterOptions = {
    page: '1',
    limit: '5',
    typeOfSort: 'desc'
  }
): Promise<IApiResponse<IProperty[]>> => {
  try {
    const {
      property = '',
      value = '',
      sortBy = '',
      typeOfSort = 'desc',
      limit = '5',
      page = '1',
      personalPropertyFilterCriteria
    } = params

    const calledUrl = new URL(`${baseUrl}/user/${userId}`)
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

    if (personalPropertyFilterCriteria?.status) {
      calledUrl.searchParams.append('status', personalPropertyFilterCriteria.status)
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

export const fetchPropertyById = async (id: number): Promise<IApiResponse<IProperty>> => {
  try {
    const response = await fetch(`${baseUrl}/${id}`)

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

export const fetchPropertyCounts = async (): Promise<IApiResponse<IPropertyStatistic>> => {
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

export const fetchPropertyByUserCounts = async (userId: number): Promise<IApiResponse<IPropertyStatistic>> => {
  try {
    const response = await fetch(`${baseUrl}/counts/user/${userId}`)

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

export const fetchPropertyCountsByCategoryAndStatus = async (
  status: PropertyStatus,
  categoryId: number
): Promise<IApiResponse<Record<string, number>>> => {
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

export const addProperty = async (newProperty: FormData): Promise<IApiResponse<IProperty>> => {
  const token = authStore.getState().token?.token

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: newProperty
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: 'error',
        message: data?.message || MESSAGE.property.ADD_FAILED
      }
    }

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

export const estimatePropertyPrice = async (
  property: TPostProperty
): Promise<IApiResponse<IEstimatePropertyResult>> => {
  try {
    const response = await fetch(`${baseUrl}/estimate-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(property)
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: 'error',
        message: data?.message || MESSAGE.property.ESTIMATE_FAILED
      }
    }

    return {
      status: 'success',
      message: MESSAGE.property.ESTIMATE_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const updateProperty = async (id: number, newProperty: FormData): Promise<IApiResponse<IProperty>> => {
  try {
    const token = authStore.getState().token?.token

    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: newProperty
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.property.EDIT_FAILED
      }
    }

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

export const deleteProperty = async (id: number): Promise<IApiResponse<IProperty>> => {
  try {
    const token = authStore.getState().token?.token

    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.property.DELETE_FAILED
      }
    }

    return {
      status: 'success',
      message: MESSAGE.property.DELETE_SUCCESS
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const updateStatusProperty = async (id: number, status: PropertyStatus): Promise<IApiResponse<IProperty>> => {
  try {
    const token = authStore.getState().token?.token

    const response = await fetch(`${baseUrl}/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.property.EDIT_FAILED
      }
    }

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
