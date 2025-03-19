import { ComponentStyleConfig } from '@chakra-ui/react'

const CheckboxStyles: ComponentStyleConfig = {
  baseStyle: {
    control: {
      border: '2px solid',
      borderColor: 'brand.black',
      _checked: {
        bg: 'brand.black',
        borderColor: 'brand.black',
        _disabled: {
          borderColor: 'brand.black',
          bg: 'brand.black',
          cursor: 'default'
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
