export interface IApiResponse<T> {
  status: 'info' | 'warning' | 'success' | 'error' | 'loading'
  data?: T
  message: string
}
