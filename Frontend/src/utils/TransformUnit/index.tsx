export const transformPriceUnit = (amount: number): string => `${(amount / 1_000_000_000).toFixed(2)} tỷ`
export const calculatePricePerSquareMeter = (price: number, area: number): string => {
  if (area === 0) return 'N/A'
  return `${Math.round(price / area / 1_000_000).toLocaleString()} tr/m²`
}
