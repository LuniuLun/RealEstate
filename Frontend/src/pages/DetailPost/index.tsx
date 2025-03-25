import { useParams } from 'react-router-dom'
import { Box, Flex, Heading, Text, Stack, IconButton, Spinner } from '@chakra-ui/react'
import { HeartIcon, LocationIcon } from '@assets/icons'
import { ContactInfo, PropertyDetails } from '@components'
import colors from '@styles/variables/colors'
import useGetPropertyById from '@hooks/UseProperty/useGetPropertyById'
import ImageGallery from '@components/ImageGallery'

const DetailPost = () => {
  const { id } = useParams()
  const { property, isLoading, isError } = useGetPropertyById(id ?? '')

  if (isLoading || isError || !property) {
    return (
      <Flex justify='center' align='center' h='50vh'>
        {isLoading ? (
          <Spinner size='xl' color={colors.brand.primary} />
        ) : (
          <Text>Không thể tải thông tin. Vui lòng thử lại sau.</Text>
        )}
      </Flex>
    )
  }

  const propertyImages = property.images?.split(',') ?? []
  const address = [property.streetName, property.wardName, property.region].filter(Boolean).join(', ')
  const contactInfo = {
    name: property.user?.fullName ?? 'Chưa cập nhật',
    role: property.user?.role?.name ?? 'Chưa cập nhật',
    phone: property.user?.phone ?? 'Chưa cập nhật'
  }

  return (
    <Flex maxW='1000px' w='100%' mx='auto' my={5}>
      <Stack px={4} flex='2'>
        <ImageGallery images={propertyImages} alt={property.title} />

        <Box bg='white' p={5} shadow='md' mt={4} borderRadius='lg'>
          <Box mb={4}>
            <Flex justify='space-between' align='flex-start'>
              <Heading variant='primary'>{property.title}</Heading>
              <IconButton
                size='sm'
                icon={<HeartIcon />}
                aria-label='save'
                bg={colors.brand.white}
                borderRadius='full'
              />
            </Flex>
            <Flex mt={2} align='center' gap={2}>
              <LocationIcon />
              <Text fontSize='sm' color={colors.brand.blackTextPrimary}>
                {address}
              </Text>
            </Flex>
          </Box>

          <PropertyDetails property={property} />

          <Box>
            <Heading variant='secondary' mb={2}>
              Mô tả chi tiết
            </Heading>
            <Text>{property.description}</Text>
          </Box>
        </Box>
      </Stack>

      <ContactInfo {...contactInfo} />
    </Flex>
  )
}

export default DetailPost
