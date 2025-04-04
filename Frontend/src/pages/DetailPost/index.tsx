import { useParams } from 'react-router-dom'
import { Box, Flex, Heading, Text, Stack, Spinner, Badge } from '@chakra-ui/react'
import { ContactInfo, PropertyDetails } from '@components'
import { useEstimatePropertyPrice } from '@hooks/UseProperty/useEstimatePropertyPrice'
import { useEffect, useState } from 'react'
import { RoleName } from '@type/models'
import { formatCurrency } from '@utils'
import useGetPropertyById from '@hooks/UseProperty/useGetPropertyById'
import ImageGallery from '@components/ImageGallery'
import useAuthStore from '@stores/Authentication'

const DetailPost = () => {
  const { id } = useParams()
  const { property, isLoading, isError } = useGetPropertyById(Number(id))
  const { token } = useAuthStore()
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)

  const {
    estimatePropertyPriceMutation,
    isError: isErrorEstimate,
    isLoading: isEstimateLoading
  } = useEstimatePropertyPrice()

  useEffect(() => {
    if (property && token && (token.user.role.name === RoleName.BROKER || token.user.role.name === RoleName.ADMIN)) {
      estimatePropertyPriceMutation.mutate(property, {
        onSuccess: (response) => {
          if (response.data) {
            const roundedPrice = Math.round(response.data?.estimatedPrice)
            setEstimatedPrice(roundedPrice)
          }
        }
      })
    }
  }, [property, token])

  if (isLoading || isError || !property) {
    return (
      <Flex justify='center' align='center' h='50vh'>
        {isLoading ? (
          <Spinner size='xl' color='brand.primary' />
        ) : (
          <Heading variant='secondary' color='brand.red' p={10}>
            Không tìm thấy thông tin bài viết
          </Heading>
        )}
      </Flex>
    )
  }

  const propertyImages = property.images?.split(',') ?? []

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
            <PropertyDetails property={property} />

            <Box mb={4} p={2} borderRadius='md' bg='gray.50'>
              <Flex align='center' gap={2}>
                <Text fontWeight='bold'>Hệ thống định giá:</Text>
                {token?.user.role.name === RoleName.BROKER || token?.user.role.name === RoleName.ADMIN ? (
                  isEstimateLoading ? (
                    <Text>Hệ thống đang định giá...</Text>
                  ) : estimatedPrice ? (
                    <Badge colorScheme='red' fontSize='md' p={1}>
                      {formatCurrency(estimatedPrice)} VNĐ
                    </Badge>
                  ) : isErrorEstimate ? (
                    <Text color='red.500'>Lỗi định giá</Text>
                  ) : null
                ) : (
                  <Text>Nâng cấp tài khoản để sử dụng chức năng này</Text>
                )}
              </Flex>
            </Box>
          </Box>
        </Box>
      </Stack>

      <ContactInfo {...contactInfo} />
    </Flex>
  )
}

export default DetailPost
