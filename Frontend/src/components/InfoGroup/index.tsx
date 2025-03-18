import { memo } from 'react'
import { Text, Stack } from '@chakra-ui/react'
import { TSizeInfoGroup } from '@type/variant'
import colors from '@styles/variables/colors'

interface IInfoGroupProps {
  heading: string
  description: string
  size?: TSizeInfoGroup
}

const InfoGroup = ({ heading, description, size = 'sm' }: IInfoGroupProps) => {
  return (
    <Stack align='center' alignItems={'start'} gap={0}>
      <Text
        fontWeight='500'
        fontSize={size === 'sm' ? '0.875rem' : '1rem'}
        color={colors.brand.black}
        maxW='200px'
        overflow='hidden'
        textOverflow='ellipsis'
        whiteSpace='nowrap'
      >
        {heading}
      </Text>
      <Text
        fontWeight='400'
        fontSize='0.75rem'
        color={size === 'sm' ? colors.brand.blackTextSecondary : colors.brand.blackTextTertiary}
        maxW='200px'
        overflow='hidden'
        textOverflow='ellipsis'
        whiteSpace='nowrap'
      >
        {description}
      </Text>
    </Stack>
  )
}

export default memo(InfoGroup)
