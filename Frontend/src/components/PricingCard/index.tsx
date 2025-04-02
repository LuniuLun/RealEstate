import { CloseIcon } from '@assets/icons'
import { Box, Button, Divider, Flex, Heading, Text, VStack, Badge, Icon } from '@chakra-ui/react'
import { PricingPlan } from '@type/upgradePackage'
import { formatCurrency } from '@utils'

interface IPricingCardProps extends PricingPlan {
  onSelect: () => void
}

const PricingCard = ({
  title,
  price,
  period,
  features,
  isAvailable = true,
  isPopular = false,
  onSelect
}: IPricingCardProps) => {
  const bgColor = isPopular ? 'orange.50' : 'white'
  const borderColor = isPopular ? 'orange.500' : 'brand.sliver'

  return (
    <Box
      borderWidth='1px'
      borderRadius='xl'
      borderColor={borderColor}
      bg={bgColor}
      p={6}
      position='relative'
      w='full'
      maxW='md'
    >
      {!isAvailable && (
        <Box
          position='absolute'
          top='0'
          left='0'
          right='0'
          bottom='0'
          bg='rgba(0, 0, 0, 0.10)'
          backdropFilter='blur(.3px)'
          borderRadius='xl'
          zIndex='1'
        />
      )}

      {(isPopular || !isAvailable) && (
        <Badge
          position='absolute'
          top='-1px'
          right='50%'
          transform='translateX(50%)'
          px={3}
          py={1}
          bg='orange.500'
          color='white'
          fontWeight='bold'
          fontSize='sm'
          borderBottomRadius='md'
          zIndex={2}
        >
          {isPopular && 'Bán chạy nhất'}
          {!isAvailable && 'Comming soon'}
        </Badge>
      )}

      <VStack spacing={4} align='start' mt={1}>
        <Heading size='md'>{title}</Heading>
        <Text height='3rem'>{price.description}</Text>

        <Box w='full'>
          <Text fontSize='md' color='brand.blackTextPrimary'>
            Chỉ từ
          </Text>
          <Flex align='baseline' mt={1}>
            <Text fontWeight='bold' fontSize='2xl'>
              {formatCurrency(price.amount)}đ
            </Text>
            <Text fontSize='md' color='brand.blackTextPrimary' ml={2}>
              / {period}
            </Text>
          </Flex>
          {price.savings && (
            <Text fontSize='sm' color='brand.blackTextPrimary' mt={1}>
              {price.savings}
            </Text>
          )}
        </Box>

        <Button w='full' variant='primary' onClick={onSelect} size='lg' mt={2}>
          Mua ngay
        </Button>

        {features.summary && (
          <Flex align='center' mt={2}>
            <Text fontWeight='medium'>{features.summary}</Text>
          </Flex>
        )}
      </VStack>

      <Divider my={6} />

      <VStack spacing={3} align='start'>
        {features.list.map((feature, index) => (
          <Flex key={index} align='flex-start'>
            <Icon
              as={feature.available ? undefined : CloseIcon}
              color={feature.available ? 'orange.500' : 'brand.blackTextSecondary'}
              w={4}
              h={4}
              mr={2}
              mt={1}
            />
            <Text color={feature.available ? 'inherit' : 'brand.blackTextSecondary'}>{feature.text}</Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  )
}

export default PricingCard
