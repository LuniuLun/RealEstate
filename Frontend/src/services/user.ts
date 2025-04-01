import { IApiResponse } from '@type/apiResponse'
import MESSAGE from '@constants/message'
import { IUser, TRegisterUserRequest } from '@type/models'
import { IFilterOptions } from '@type/filterOptions'
import { authStore } from '@stores'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_USER_ENDPOINT}`

export const fetchUsers = async (
  params: IFilterOptions = {
    page: '1',
    limit: '10',
    typeOfSort: 'desc'
  }
): Promise<IApiResponse<IUser[]>> => {
  try {
    const { property = '', value = '', sortBy = '', typeOfSort = 'desc', limit = '10', page = '1' } = params
    const token = authStore.getState().token?.token
    if (!token) {
      return {
        status: 'error',
        message: MESSAGE.auth.REQUIRE
      }
    }
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

    const response = await fetch(calledUrl.toString(), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.user.GET_FAILED
      }
    }

    const data = await response.json()

    return {
      status: 'success',
      message: MESSAGE.user.GET_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const fetchAllUsers = async (property?: string, value?: string): Promise<IApiResponse<IUser[]>> => {
  try {
    const token = authStore.getState().token?.token
    if (!token) {
      return {
        status: 'error',
        message: MESSAGE.auth.REQUIRE
      }
    }
    const calledUrl = new URL(baseUrl)
    if (property && value) {
      calledUrl.searchParams.append(property, value)
    }
    calledUrl.searchParams.append('sortBy', 'createdAt')
    calledUrl.searchParams.append('typeOfSort', 'desc')
    const response = await fetch(calledUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.user.GET_FAILED
      }
    }

    const data = await response.json()

    return {
      status: 'success',
      message: MESSAGE.user.GET_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const fetchUserById = async (id: string): Promise<IApiResponse<IUser>> => {
  try {
    const token = authStore.getState().token?.token
    if (!token) {
      return {
        status: 'error',
        message: MESSAGE.auth.REQUIRE
      }
    }
    const response = await fetch(`${baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.user.GET_FAILED
      }
    }

    const data = await response.json()
    return {
      status: 'success',
      message: MESSAGE.user.GET_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const fetchCurrentUser = async (): Promise<IApiResponse<IUser>> => {
  try {
    const token = authStore.getState().token?.token
    if (!token) {
      return {
        status: 'error',
        message: MESSAGE.auth.REQUIRE
      }
    }
    const response = await fetch(`${baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.user.GET_FAILED
      }
    }

    const data = await response.json()
    return {
      status: 'success',
      message: MESSAGE.user.GET_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const addUser = async (newUser: TRegisterUserRequest): Promise<IApiResponse<IUser>> => {
  try {
    const token = authStore.getState().token?.token
    if (!token) {
      return {
        status: 'error',
        message: MESSAGE.auth.REQUIRE
      }
    }
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newUser)
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.user.ADD_FAILED
      }
    }

    const data = await response.json()
    return {
      status: 'success',
      message: MESSAGE.user.ADD_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const updateUser = async (newUser: IUser): Promise<IApiResponse<IUser>> => {
  try {
    const token = authStore.getState().token?.token
    if (!token) {
      return {
        status: 'error',
        message: MESSAGE.auth.REQUIRE
      }
    }
    const response = await fetch(`${baseUrl}/${newUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newUser)
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.user.EDIT_FAILED
      }
    }

    const data = await response.json()
    return {
      status: 'success',
      message: MESSAGE.user.EDIT_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const deleteUser = async (id: string): Promise<IApiResponse<IUser>> => {
  try {
    const token = authStore.getState().token?.token
    if (!token) {
      return {
        status: 'error',
        message: MESSAGE.auth.REQUIRE
      }
    }
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.user.DELETE_FAILED
      }
    }

    const data = await response.json()
    return {
      status: 'success',
      message: MESSAGE.user.DELETE_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const upgradeUser = async (id: string): Promise<IApiResponse<IUser>> => {
  try {
    const token = authStore.getState().token?.token
    if (!token) {
      return {
        status: 'error',
        message: MESSAGE.auth.REQUIRE
      }
    }
    const response = await fetch(`${baseUrl}/upgrade/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.user.UPGRADE_FAILED
      }
    }

    const data = await response.json()
    return {
      status: 'success',
      message: MESSAGE.user.UPGRADE_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}
