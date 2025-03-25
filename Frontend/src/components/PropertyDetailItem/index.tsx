import { Text, Badge, Stack, Flex } from '@chakra-ui/react'
import colors from '@styles/variables/colors'
import { memo, ReactNode } from 'react'

interface PropertyDetailItemProps {
  label: string
  value: string
  icon: ReactNode
  highlight?: boolean
  badge?: boolean
}

const PropertyDetailItem = ({ label, value, icon, highlight, badge }: PropertyDetailItemProps) => {
  return (
    <Stack align='flex-start'>
      <Flex alignItems='center' gap={2}>
        {icon}
        <Text color={colors.brand.blackTextPrimary} fontSize='sm'>
          {label}
        </Text>
        {badge ? (
          <Badge colorScheme='blue' p={1} borderRadius='md'>
            {value}
          </Badge>
        ) : (
          <Text
            fontWeight={highlight ? 'bold' : 'normal'}
            fontSize='md'
            color={highlight ? colors.brand.red : colors.brand.blackTextPrimary}
          >
            {value}
          </Text>
        )}
      </Flex>
    </Stack>
  )
}

export default memo(PropertyDetailItem)
