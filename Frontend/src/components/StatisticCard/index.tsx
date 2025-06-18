import { Stack, Text } from '@chakra-ui/react'
import { Skeleton } from '@chakra-ui/react'
import { memo } from 'react'

interface IStatisticsCardProps {
  label: string
  value: number
  isLoaded?: boolean
}

const StatisticsCard = ({ isLoaded = true, label, value }: IStatisticsCardProps) => {
  return (
    <Stack flex={1} p={4} borderWidth={1} borderRadius='md' bg='white' borderColor='brand.secondary'>
      <Skeleton isLoaded={isLoaded} startColor='gray.100' endColor='gray.300'>
        <Text fontSize='sm' fontWeight='medium' color='brand.blackTextSecondary'>
          {label}
        </Text>
      </Skeleton>
      <Skeleton isLoaded={isLoaded} startColor='gray.100' endColor='gray.300'>
        <Text fontSize='xl' fontWeight='semibold' color='brand.blackTextPrimary'>
          {value}
        </Text>
      </Skeleton>
    </Stack>
  )
}

export default memo(StatisticsCard)
