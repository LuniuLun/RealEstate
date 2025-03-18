import { extendTheme } from '@chakra-ui/react'
import colors from './variables/colors'
import globalStyles from './globalStyles'
import {
  ButtonStyles as Button,
  HeadingStyles as Heading,
  InputStyles as Input,
  SelectStyles as Select,
  CheckboxStyles as Checkbox,
  AlertStyles as Alert
} from './components'

export const defaultTheme = extendTheme({
  colors,
  styles: globalStyles.styles,
  config: globalStyles.config,
  fonts: globalStyles.fonts,
  components: { Button, Heading, Input, Select, Checkbox, Alert }
})
