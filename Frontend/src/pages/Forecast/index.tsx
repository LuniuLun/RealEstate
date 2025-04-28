import { useState, useCallback } from 'react'
import { Container, Heading, Card, CardBody, Box, Stack, Skeleton } from '@chakra-ui/react'
import { ForecastRequest, ForecastResponse } from '@type/models/forecast'
import { useForecastPrice, useTransformForecastedData } from '@hooks'
import { CustomTable, ForecastChart, ForecastForm } from '@components'
import { ViewMode } from '@components/ForecastChart'
import { FormValues } from '@components/ForecastForm'
import { ITableRow } from '@components/CustomTable'

const Forecast = () => {
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('daily')
  const { ForecastPriceMutation, isLoading, isError } = useForecastPrice()
  const { data, minY, maxY } = useTransformForecastedData({ forecastData, viewMode })

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
  }, [])

  const handleSubmit = useCallback(
    async (formData: FormValues) => {
      const forecastRequest: ForecastRequest = {
        district: formData.district,
        periodDays: formData.periodDays,
        width: formData.width,
        length: formData.length,
        floors: formData.floors,
        rooms: formData.rooms,
        toilets: formData.toilets,
        landCharacteristics: formData.landCharacteristics,
        categoryId: formData.categoryId,
        directionId: formData.directionId,
        furnishingId: formData.furnishingId
      }

      try {
        const result = await ForecastPriceMutation.mutateAsync(forecastRequest)
        if (result.status === 'success' && result.data) {
          setForecastData(result.data)
        }
      } catch (error) {
        console.error('Forecast error:', error)
      }
    },
    [ForecastPriceMutation]
  )

  if (isError)
    return (
      <Heading variant='secondary' color='brand.red' p={10}>
        Đã có lỗi xảy ra trong quá trình dự đoán
      </Heading>
    )

  return (
    <Container maxW='container.xxl' py={8}>
      <Heading mb={6} textAlign='center'>
        Dự Báo Giá Bất Động Sản
      </Heading>

      <ForecastForm onSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading ? (
        <Card boxShadow='md' color={'brand.blackTextPrimary'} bg={'brand.white'}>
          <CardBody>
            <Stack>
              <Skeleton height='20px' startColor='gray.100' endColor='gray.300' />
              <Skeleton height='300px' startColor='gray.100' endColor='gray.300' />
              <Skeleton height='20px' startColor='gray.100' endColor='gray.300' />
            </Stack>
          </CardBody>
        </Card>
      ) : forecastData ? (
        <Card boxShadow='md' color={'brand.blackTextPrimary'} bg={'brand.white'}>
          <ForecastChart
            district={forecastData.district}
            periodDays={forecastData.periodDays}
            chartData={data}
            minY={minY}
            maxY={maxY}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
          <CardBody>
            <Box mt={6}>
              <Heading variant='secondary' mb={4}>
                {`Chi Tiết ${viewMode === 'daily' ? 'Theo Ngày' : 'Theo Tháng'}`}
              </Heading>
              <CustomTable data={data as unknown as ITableRow[]} isLoaded={!isLoading} />
            </Box>
          </CardBody>
        </Card>
      ) : null}
    </Container>
  )
}

export default Forecast
