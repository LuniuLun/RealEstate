export const REGEX = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^[0-9]{9,11}$/,
  password: /^(?=.*[A-Z])(?=.*\W).{8,}$/,
  positiveNumber: /^[0-9]+$/,
  imageExtensions: /\.(jpg|jpeg|png|gif|webp)$/i,
  currencyFormat: /\B(?=(\d{3})+(?!\d))/g
}
