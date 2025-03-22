import { IApiResponse } from '@type/apiResponse'
import MESSAGE from '@constants/message'
import { IToken, IUser, TLoginUserRequest, TRegisterUserRequest } from '@type/models'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_AUTH_ENDPOINT}`

export const registerUser = async (newUser: TRegisterUserRequest): Promise<IApiResponse<IUser>> => {
  try {
    const response = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    const data = await response.json()

    if (!response.ok) {
      return {
        status: 'error',
        message: data?.message || MESSAGE.auth.REGISTER_FAILED
      }
    }

    return {
      status: 'success',
      message: MESSAGE.auth.REGISTER_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const login = async (newUser: TLoginUserRequest): Promise<IApiResponse<IToken>> => {
  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    const data = await response.json()

    if (!response.ok) {
      return {
        status: 'error',
        message: data?.message || MESSAGE.auth.LOGIN_FAILED
      }
    }

    return {
      status: 'success',
      message: MESSAGE.auth.LOGIN_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}
