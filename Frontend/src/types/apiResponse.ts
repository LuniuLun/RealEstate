export interface IApiResponse<T> {
  status: string
  data?: T
  message: string
}
