import { ComponentStyleConfig } from '@chakra-ui/react'

const CheckboxStyles: ComponentStyleConfig = {
  baseStyle: {
    control: {
      border: '2px solid',
      borderColor: 'brand.primary',
      _checked: {
        bg: 'brand.primary',
        borderColor: 'brand.primary',
        _disabled: {
          borderColor: 'brand.primary',
          bg: 'brand.primary',
          cursor: 'default'
        },
        _hover: {
          bg: 'brand.primary',
          borderColor: 'brand.primary'
        }
      },
      _disabled: {
        borderColor: 'brand.black',
        bg: 'brand.white',
        cursor: 'default'
      }
    },
    icon: {
      color: 'brand.white'
    }
  }
}

export default CheckboxStyles
