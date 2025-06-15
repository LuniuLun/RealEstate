import { IApiResponse } from '@type/apiResponse'
import { IPaymentRequest, IPaymentResponse } from '@type/models/payment'
import MESSAGE from '@constants/message'
import { authStore } from '@stores'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_PAYMENT_ENDPOINT}`

export const getVNPayUrl = async (requestPayment: IPaymentRequest): Promise<IApiResponse<IPaymentResponse>> => {
  try {
    const token = authStore.getState().token?.token

    const response = await fetch(`${baseUrl}/create-vnpay-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(requestPayment)
    })
    const data = await response.json()

    if (!response.ok) {
      return {
        status: 'error',
        message: data?.message || MESSAGE.payment.GET_FAILED
      }
    }

    return {
      status: 'success',
      message: MESSAGE.payment.GET_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}
