import React, { forwardRef, memo } from 'react'
import {
  Text,
  InputProps,
  InputGroup,
  InputLeftElement,
  Input,
  Stack,
  IconButton,
  InputRightElement,
  Box
} from '@chakra-ui/react'
import { EyeIcon, CloseEyeIcon } from '@assets/icons'
import { formatCurrency } from '@utils'

export interface ITextFieldProps extends InputProps {
  icon?: React.ReactElement
  errorMessage?: string
}

const TextField = forwardRef<HTMLInputElement, ITextFieldProps>(
  (
    {
      value,
      onChange,
      placeholder,
      variant = 'unstyled',
      size = 'sm',
      errorMessage,
      icon,
      type = 'text',
      isDisabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value

      if (type === 'price') {
        const numericValue = newValue.replace(/\D/g, '')
        newValue = formatCurrency(Number(numericValue))
      }

      onChange?.({
        ...e,
        target: { ...e.target, value: newValue }
      })
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    return (
      <Stack
        flex={1}
        display='flex'
        gap='unset'
        alignItems='center'
        justifyContent='center'
        position='relative'
        backgroundColor='transparent'
        w='100%'
      >
        <InputGroup>
          {icon && (
            <InputLeftElement h='100%' w='40px' position='absolute' left={1}>
              <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                borderRadius='full'
                bgColor='brand.primary'
                h='30px'
                w='30px'
              >
                {React.cloneElement(icon)}
              </Box>
            </InputLeftElement>
          )}
          <Input
            errorBorderColor='red.300'
            paddingLeft={icon ? '50px' : '12px'}
            ref={ref}
            placeholder={placeholder}
            variant={variant}
            size={size}
            value={value}
            onChange={handleChange}
            disabled={isDisabled}
            type={type === 'password' ? (!showPassword ? 'password' : 'text') : 'text'}
            {...props}
          />
          {type === 'password' && (
            <InputRightElement width='4.5rem' height='100%'>
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <EyeIcon /> : <CloseEyeIcon />}
                variant='link'
                onClick={togglePasswordVisibility}
                size='sm'
                color='gray.500'
              />
            </InputRightElement>
          )}
        </InputGroup>
        <Text
          position='absolute'
          left='12px'
          bottom='-10px'
          color='brand.red'
          fontSize='xs'
          fontWeight='light'
          height='12px'
        >
          {errorMessage}
        </Text>
      </Stack>
    )
  }
)

export default memo(TextField)
