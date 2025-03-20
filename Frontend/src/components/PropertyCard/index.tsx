import { Box, Text, Stack, Flex } from '@chakra-ui/react'
import InfoGroup from '@components/InfoGroup'
import defaultImage from '@assets/images/default-image.jpg'
import colors from '@styles/variables/colors'
import { useState } from 'react'

interface IPropertyCardProps {
  imageUrl: string
  title: string
  description: string
  price: string
  areaInfo: string
  location: string
  time: string
}

const PropertyCard = ({ imageUrl, title, description, price, areaInfo, location, time }: IPropertyCardProps) => {
  const [bgSrc, setBgSrc] = useState(imageUrl || defaultImage)

  return (
    <Box
      display='flex'
      alignItems='flex-end'
      border='1px solid #E2E8F0'
      borderRadius='lg'
      boxShadow='md'
      p={4}
      bg='white'
      w='360px'
      height='400px'
      bgImage={`url(${bgSrc})`}
      bgSize='cover'
      bgPosition='center'
    >
      <img src={imageUrl} alt='' style={{ display: 'none' }} onError={() => setBgSrc(defaultImage)} />
      <Stack
        justifyContent='space-between'
        spacing={2}
        bgColor={colors.brand.white}
        p={4}
        borderRadius='xl'
        h={'160px'}
        w='100%'
        border='1px solid'
        borderColor={colors.brand.grey}
        boxShadow='sm'
      >
        <InfoGroup heading={title} description={description} size='md' />

        <Stack>
          <Flex align='center' justify='space-between'>
            <Text fontSize='lg' fontWeight='bold' color={colors.brand.red}>
              {price}
            </Text>
            <Text fontSize='sm' color={colors.brand.blackTextSecondary}>
              {areaInfo}
            </Text>
          </Flex>

          <Flex fontSize='sm' color={colors.brand.blackTextPrimary}>
            <Text>
              {location} • {time}
            </Text>
          </Flex>
        </Stack>
      </Stack>
    </Box>
  )
}

export default PropertyCard
