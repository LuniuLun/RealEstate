import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Flex, Heading, Text, Stack, Spinner, Badge, Button, Card, CardBody, Skeleton } from '@chakra-ui/react'
import { ContactInfo, PropertyDetails, ForecastChart, CustomSelect } from '@components'
import useGetPropertyById from '@hooks/UseProperty/useGetPropertyById'
import { useCustomToast, useForecastPrice, useTransformForecastedData } from '@hooks'
import ImageGallery from '@components/ImageGallery'
import { formatCurrency } from '@utils'
import { RoleName, TPostProperty } from '@type/models'
import { ForecastResponse } from '@type/models/forecast'
import { PERIOD_OPTION } from '@constants/option'
import { ViewMode } from '@components/ForecastChart'
import useAuthStore from '@stores/Authentication'

const DetailPost = () => {
  const { id } = useParams()
  const { token } = useAuthStore()
  const { property, isLoading, isError } = useGetPropertyById(Number(id), 'properties')
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null)
  const [periodDays, setPeriodDays] = useState<number>(1)
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly')
  const { forecastPriceMutation: forecastMutation, isLoading: isForecastLoading } = useForecastPrice()
  const { forecastPriceMutation: estimateMutation, isLoading: isEstimateLoading } = useForecastPrice()
  const { data, minY, maxY } = useTransformForecastedData({ forecastData, area: property?.area, viewMode })
  const { showToast } = useCustomToast()

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
  }, [])
  const role = token?.user?.role?.name
  const isOverUser = role === RoleName.BROKER || role === RoleName.ADMIN

  const handleEstimatePrice = () => {
    if (!property) return
    estimateMutation.mutate(
      { property: property as TPostProperty, periodDays: 1 },
      {
        onSuccess: (response) => {
          if (response.data) {
            const price = response.data?.predictions[0]?.predictedPrice ?? 0
            const roundedPrice = (Math.round(price * property.area * 100) / 100) * 1_000_000
            setEstimatedPrice(roundedPrice)
          }
        }
      }
    )
  }

  const handleForecastPrice = () => {
    if (!property) return
    if (periodDays <= 1) {
      showToast({ status: 'warning', title: 'Vui lòng chọn khoảng thời gian' })
      return
    }
    forecastMutation.mutate(
      { property: property as TPostProperty, periodDays },
      {
        onSuccess: (response) => {
          if (response.data) {
            setForecastData(response.data)
          }
        }
      }
    )
  }

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
    <Flex maxW='1200px' w='100%' mx='auto' my={5}>
      <Stack px={4} flex='2'>
        <ImageGallery images={propertyImages} alt={property.title} />
        <Box bg='white' p={5} shadow='md' mt={4} borderRadius='lg'>
          <Box mb={4}>
            <PropertyDetails property={property} />

            <Box mt={4} p={2} borderRadius='md'>
              <Flex align='center' justifyContent='space-between'>
                <Flex align='center' gap={2}>
                  <Text fontWeight='bold'>Hệ thống định giá</Text>
                  {isEstimateLoading ? (
                    <Skeleton height='24px' width='180px' startColor='gray.100' endColor='gray.300' />
                  ) : estimatedPrice ? (
                    <Badge colorScheme='red' fontSize='md' p={1}>
                      {formatCurrency(estimatedPrice)} VNĐ
                    </Badge>
                  ) : null}
                </Flex>
                <Button colorScheme='blue' onClick={handleEstimatePrice} isDisabled={!property || isEstimateLoading}>
                  Định Giá
                </Button>
              </Flex>
            </Box>
          </Box>
          {isOverUser ? (
            <Flex align='center' gap={4} mt={4} justifyContent='space-between' p={2}>
              <CustomSelect
                maxW='200px'
                onChange={(e) => setPeriodDays(Number(e.target.value))}
                isDisabled={isForecastLoading || isEstimateLoading}
                sx={{ width: '100%' }}
                borderRadius={'md'}
                options={PERIOD_OPTION}
                placeholder='Khoảng thời gian'
              />
              <Button onClick={handleForecastPrice} isDisabled={!property || isForecastLoading}>
                Dự đoán
              </Button>
            </Flex>
          ) : null}

          {isForecastLoading ? (
            <Card boxShadow='md' color={'brand.blackTextPrimary'} bg={'brand.white'} mt={6}>
              <CardBody>
                <Stack>
                  <Skeleton height='20px' startColor='gray.100' endColor='gray.300' />
                  <Skeleton height='300px' startColor='gray.100' endColor='gray.300' />
                  <Skeleton height='20px' startColor='gray.100' endColor='gray.300' />
                </Stack>
              </CardBody>
            </Card>
          ) : forecastData ? (
            <Card boxShadow='md' color={'brand.blackTextPrimary'} bg={'brand.white'} mt={6}>
              <ForecastChart
                periodDays={forecastData.periodDays}
                chartData={data}
                viewMode={viewMode}
                district={property.districtName}
                minY={minY}
                maxY={maxY}
                onViewModeChange={handleViewModeChange}
              />
            </Card>
          ) : null}
        </Box>
      </Stack>

      <ContactInfo {...contactInfo} />
    </Flex>
  )
}

export default DetailPost
