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
  Box,
  Skeleton
} from '@chakra-ui/react'
import { EyeIcon, CloseEyeIcon } from '@assets/icons'
import { formatCurrency, parsePrice } from '@utils'

export interface ITextFieldProps extends InputProps {
  icon?: React.ReactElement
  errorMessage?: string
  isLoaded?: boolean
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
      isLoaded = true,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const getDisplayValue = () => {
      if (type === 'price' && value) {
        return formatCurrency(parsePrice(value as string))
      }
      return value as string
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return

      if (type === 'price') {
        const numericValue = e.target.value.replace(/\D/g, '')
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: numericValue
          }
        }

        onChange(syntheticEvent)
      } else {
        onChange(e)
      }
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
              <Skeleton isLoaded={isLoaded} startColor='gray.100' endColor='gray.300' borderRadius='full'>
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
              </Skeleton>
            </InputLeftElement>
          )}

          <Skeleton isLoaded={isLoaded} startColor='gray.100' endColor='gray.300' width='100%' borderRadius='md'>
            <Input
              errorBorderColor='red.300'
              paddingLeft={icon ? '50px' : '12px'}
              ref={ref}
              placeholder={placeholder}
              variant={variant}
              size={size}
              value={getDisplayValue()}
              onChange={handleChange}
              disabled={isDisabled}
              type={type === 'password' ? (!showPassword ? 'password' : 'text') : 'text'}
              {...props}
            />
          </Skeleton>

          {type === 'password' && (
            <InputRightElement width='4.5rem' height='100%'>
              <Skeleton isLoaded={isLoaded} startColor='gray.100' endColor='gray.300'>
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <EyeIcon /> : <CloseEyeIcon />}
                  variant='link'
                  onClick={togglePasswordVisibility}
                  size='sm'
                  color='gray.500'
                />
              </Skeleton>
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
