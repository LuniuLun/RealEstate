import { REGEX } from '@constants/regex'

const formatCurrency = (number: number): string => {
  return number.toString().replace(REGEX.currencyFormat, '.')
}

export default formatCurrency
