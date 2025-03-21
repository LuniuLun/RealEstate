import { alertAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(alertAnatomy.keys)

const AlertStyles = defineMultiStyleConfig({
  baseStyle: {
    container: {
      '&[data-status="error"]': {
        background: 'brand.red',
        borderColor: 'brand.red'
      },
      '&[data-status="success"]': {
        background: 'brand.green',
        borderColor: 'brand.green'
      }
    },
    description: {
      color: 'brand.secondary '
    },
    title: {
      color: 'brand.white '
    },
    icon: {
      color: 'brand.white '
    }
  }
})

export default AlertStyles
