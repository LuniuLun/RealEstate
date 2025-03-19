import { alertAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(alertAnatomy.keys)

const successCustom = definePartsStyle({
  container: {
    border: '1px solid',
    borderColor: 'brand.green',
    background: 'brand.green'
  }
})

const errorCustom = definePartsStyle({
  container: {
    border: '1px solid',
    borderColor: 'brand.red',
    background: 'brand.red'
  }
})

const AlertStyles = defineMultiStyleConfig({
  baseStyle: {
    description: {
      color: 'brand.secondary'
    },
    title: {
      color: 'brand.white'
    },
    icon: {
      color: 'brand.white'
    }
  },
  variants: { successCustom, errorCustom }
})

export default AlertStyles
