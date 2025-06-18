import { ComponentStyleConfig } from '@chakra-ui/react'

const HeadingStyles: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 'bold'
  },
  variants: {
    primary: {
      fontSize: 'xl',
      color: 'brand.primary',
      lineHeight: '1.5rem'
    },
    secondary: {
      fontSize: '1.0625rem',
      color: 'brand.blackTextPrimary'
    }
  },
  defaultProps: {
    variant: 'primary'
  }
}

export default HeadingStyles
