import { ComponentStyleConfig } from '@chakra-ui/react'

const InputStyles: ComponentStyleConfig = {
  baseStyle: {
    field: {
      borderRadius: 'md',
      width: '100%',
      fontSize: 'md',
      backgroundColor: 'brand.white',
      color: 'brand.blackTextPrimary',
      _placeholder: {
        color: 'brand.blackTextTertiary'
      }
    }
  },
  sizes: {
    sm: {
      field: {
        height: '34px'
      }
    }
  },
  variants: {
    outline: {
      field: {
        borderRadius: 'xl',
        width: '100%',
        fontSize: 'md',
        border: '1px solid',
        borderColor: 'brand.secondary',
        background: 'brand.white'
      }
    }
  },
  defaultProps: {
    size: 'sm'
  }
}

export default InputStyles
