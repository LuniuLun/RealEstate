import { memo } from 'react'
import { Text, Stack, BoxProps } from '@chakra-ui/react'
import { TSizeInfoGroup } from '@type/variant'

interface IInfoGroupProps extends BoxProps {
  heading: string
  description: string
  size?: TSizeInfoGroup
}

const InfoGroup = ({ heading, description, size = 'sm', ...props }: IInfoGroupProps) => {
  return (
    <Stack align='start' gap={0} maxW='inherit' {...props}>
      <Text
        fontWeight='500'
        fontSize={size === 'sm' ? '0.875rem' : size === 'md' ? '1rem' : '1.5rem'}
        color='brand.black'
        maxW='inherit'
        sx={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: size === 'sm' ? 1 : 2,
          overflow: 'hidden'
        }}
      >
        {heading}
      </Text>
      <Text
        fontWeight='400'
        fontSize={size === 'sm' ? '0.75rem' : size === 'md' ? '0.875rem' : '1rem'}
        color='brand.blackTextSecondary'
        maxW='inherit'
        sx={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: size === 'sm' ? 1 : 2,
          overflow: 'hidden'
        }}
      >
        {description}
      </Text>
    </Stack>
  )
}

export default memo(InfoGroup)
