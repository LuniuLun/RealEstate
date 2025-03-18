import { ComponentStyleConfig } from '@chakra-ui/react'

const SelectStyles: ComponentStyleConfig = {
  baseStyle: {
    field: {
      '> option': {
        borderBottom: '1px solid',
        borderColor: 'brand.secondary',
        backgroundColor: 'brand.secondary',
        color: 'brand.blackTextPrimary'
      },
      '> option:hover': {
        backgroundColor: 'brand.hoverBtnColor',
        color: 'brand.white'
      }
    }
  }
}

export default SelectStyles
