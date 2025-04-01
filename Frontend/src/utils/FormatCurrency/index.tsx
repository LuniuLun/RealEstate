export const formatCurrency = (value: number | string): string => {
  if (value === undefined || value === null || value === '') return ''
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value
  if (isNaN(numValue)) return ''

  return new Intl.NumberFormat('vi-VN').format(numValue)
}

export const parsePrice = (formattedPrice: string | number): number => {
  if (typeof formattedPrice === 'number') return formattedPrice
  if (!formattedPrice) return 0
  const numericString = String(formattedPrice).replace(/[^\d]/g, '')
  const numericValue = Number(numericString)

  return isNaN(numericValue) ? 0 : numericValue
}
