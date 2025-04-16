export interface IPaymentRequest {
  amount: number
  orderInfo: string
  vnpReturnUrl: string
}

export interface IPaymentResponse {
  paymentUrl: string
}
