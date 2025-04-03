import { IApiResponse } from '@type/apiResponse'
import MESSAGE from '@constants/message'
import { IFilterOptions } from '@type/filterOptions'
import { authStore } from '@stores'
import { ITransaction, TPostTransaction } from '@type/models/transaction'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_TRANSACTION_ENDPOINT}`

export const fetchTransactionsHistory = async (
  params: IFilterOptions = {
    page: '1',
    limit: '10',
    typeOfSort: 'desc'
  }
): Promise<IApiResponse<ITransaction[]>> => {
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
        message: MESSAGE.transaction.GET_FAILED
      }
    }

    const data = await response.json()

    return {
      status: 'success',
      message: MESSAGE.transaction.GET_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const fetchTransactionsHistoryByUser = async (
  params: IFilterOptions = {
    page: '1',
    limit: '12',
    typeOfSort: 'desc'
  },
  userId: number
): Promise<IApiResponse<ITransaction[]>> => {
  try {
    const { property = '', value = '', sortBy = '', typeOfSort = 'desc', limit = '10', page = '1' } = params
    const token = authStore.getState().token?.token
    if (!token) {
      return {
        status: 'error',
        message: MESSAGE.auth.REQUIRE
      }
    }
    const calledUrl = new URL(`${baseUrl}/user/${userId}`)
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
        message: MESSAGE.transaction.GET_FAILED
      }
    }

    const data = await response.json()

    return {
      status: 'success',
      message: MESSAGE.transaction.GET_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const fetchTransactionsHistoryById = async (id: string): Promise<IApiResponse<ITransaction>> => {
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
        message: MESSAGE.transaction.GET_FAILED
      }
    }

    const data = await response.json()
    return {
      status: 'success',
      message: MESSAGE.transaction.GET_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}

export const addTransactionsHistory = async (
  newTransactionsHistory: TPostTransaction
): Promise<IApiResponse<ITransaction>> => {
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
      body: JSON.stringify(newTransactionsHistory)
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: MESSAGE.transaction.ADD_FAILED
      }
    }

    const data = await response.json()
    return {
      status: 'success',
      message: MESSAGE.transaction.ADD_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}
