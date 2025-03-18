import { ComponentStyleConfig } from '@chakra-ui/react'

const ButtonStyles: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 'semibold'
  },
  sizes: {
    sm: {
      borderRadius: 'md',
      fontSize: 'sm',
      px: 6,
      py: 2
    },
    md: {
      borderRadius: 'lg',
      fontSize: 'md',
      px: 6,
      py: 4
    }
  },
  variants: {
    primary: {
      bg: 'brand.primary',
      color: 'white',
      _hover: {
        border: 'none',
        bg: 'brand.hoverBtnColor',
        transform: 'scale(1.02)',
        boxShadow: 'md'
      }
    },
    secondary: {
      bg: 'brand.secondary',
      color: 'brand.blackTextSecondary',
      _hover: {
        border: 'none',
        bg: 'brand.red  ',
        transform: 'scale(1.02)',
        color: 'brand.white',
        boxShadow: 'md'
      }
    },
    tertiary: {
      bg: 'brand.white',
      border: '1px solid',
      borderColor: 'brand.black',
      borderRadius: '2xl',
      color: 'brand.blackTextPrimary',
      _hover: {
        borderColor: 'brand.hoverBtnColor',
        bg: 'brand.primary',
        transform: 'scale(1.02)',
        color: 'brand.white',
        boxShadow: 'md'
      }
    },
    quaternary: {
      width: 'unset',
      variant: 'filled',
      bgColor: 'rgba(255, 255, 255, 0.44)',
      color: 'white',
      h: '40px',
      borderRadius: 80,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      _hover: {
        bgColor: 'brand.hoverBtnColor',
        transform: 'scale(1.02)',
        color: 'brand.white',
        boxShadow: 'md'
      }
    }
  },
  defaultProps: {
    size: 'sm',
    variant: 'primary'
  }
}

export default ButtonStyles
