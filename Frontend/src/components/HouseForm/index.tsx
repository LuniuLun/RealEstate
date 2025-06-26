import { useForm, Controller } from 'react-hook-form'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Stack,
  Textarea,
  Text,
  Card,
  CardBody,
  Skeleton
} from '@chakra-ui/react'
import { AddressSelector, CheckboxGroup, CustomSelect, ForecastChart, ImageUploader, TextField } from '@components'
import { FILTER_OPTION, PERIOD_OPTION } from '@constants/option'
import { CategoryName, IProperty, RoleName, TPostProperty } from '@type/models'
import { useCustomToast, useForecastPrice, useTransformForecastedData, useUpdateProperty } from '@hooks'
import { useAddProperty } from '@hooks/UseProperty/useAddProperty'
import { useGetCoordinates } from '@hooks/UseCoordinates/useGetCoordinates'
import { useCallback, useEffect, useState } from 'react'
import { useConvertPropertyData } from '@hooks/UseProperty/useConvertProperty'
import { formatCurrency } from '@utils'
import useAuthStore from '@stores/Authentication'
import { ViewMode } from '@components/ForecastChart'
import { ForecastResponse } from '@type/models/forecast'

export type THouseFormData = Omit<TPostProperty, 'house'> & {
  images: File[]
  houseCharacteristics?: number[]
  houseType: number
  bedrooms: number
  floors: number
  toilets: number
  furnishedStatus: number
  houseId?: number
  propertyLegalDocument: number
  initialImages: string
}

interface IHouseFormProps {
  initialData?: IProperty | undefined
}

const HouseForm = ({ initialData }: IHouseFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors }
  } = useForm<THouseFormData>({
    defaultValues: initialData
      ? {
          ...initialData,
          bedrooms: initialData.house?.bedrooms,
          floors: initialData.house?.floors,
          toilets: initialData.house?.toilets,
          furnishedStatus: initialData.house?.furnishedStatus?.id,
          houseType: initialData.house?.houseType?.id,
          propertyLegalDocument: initialData.propertyLegalDocument?.id,
          houseId: initialData.house?.id,
          houseCharacteristics:
            initialData.house?.houseCharacteristicMappings?.map((char) => char.houseCharacteristic.id) || [],
          images: [],
          initialImages: initialData.images
        }
      : {
          houseCharacteristics: [],
          category: { id: 2, name: CategoryName.HOUSE },
          region: '',
          wardName: '',
          streetName: ''
        }
  })

  const region = watch('region')
  const districtName = watch('districtName')
  const wardName = watch('wardName')
  const length = watch('length')
  const width = watch('width')
  const area = watch('area')
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly')
  const [imagesValid, setImagesValid] = useState<boolean>(true)
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null)
  const [estimatePrice, setEstimatePrice] = useState<number>()
  const [periodDays, setPeriodDays] = useState<number>(1)
  const { token } = useAuthStore()
  const { convertHouseData } = useConvertPropertyData()
  const { updatePropertyMutation, isLoading: isUpdating } = useUpdateProperty()
  const { forecastPriceMutation: forecastMutation, isLoading: isForecastLoading } = useForecastPrice()
  const { forecastPriceMutation: estimateMutation, isLoading: isEstimateLoading } = useForecastPrice()
  const { data, minY, maxY } = useTransformForecastedData({ forecastData, viewMode, area })
  const { showToast } = useCustomToast()
  const { transformHouseData, addPropertyMutation, isLoading: isAdding } = useAddProperty()
  const {
    getCoordinatesMutation,
    isError: isGetCoordinatesError,
    isLoading: isGetCoordinatesLoading
  } = useGetCoordinates()
  const role = token?.user?.role?.name
  const isOverUser = role === RoleName.BROKER || role === RoleName.ADMIN
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
  }, [])

  useEffect(() => {
    if (region && districtName && wardName) {
      fetchCoordinates(watch('streetName'))
    }
  }, [wardName])

  useEffect(() => {
    if (width && length) {
      const numWidth = Number(width)
      const numLength = Number(length)

      if (!isNaN(numWidth) && !isNaN(numLength)) {
        setValue('area', numWidth * numLength)
      }
    }
  }, [width, length])

  const handleImageValidationChange = (isValid: boolean) => {
    setImagesValid(isValid)
  }

  const fetchCoordinates = (streetName?: string) => {
    let fullAddress = streetName ? `${streetName}, ` : ''
    if (region && districtName && wardName) {
      // fullAddress += `${wardName}, ${districtName}, ${region}, Vietnam`
      fullAddress += `${wardName}, ${region}, Vietnam`

      getCoordinatesMutation.mutate(fullAddress, {
        onSuccess: (response) => {
          if (response?.data?.lat && response?.data?.lon) {
            setValue('latitude', response.data.lat)
            setValue('longitude', response.data.lon)
          }
        }
      })
    }
  }

  const onSubmit = (data: THouseFormData) => {
    if ((!data.images || data.images.length < 3) && !initialData?.images) {
      showToast({ title: 'Vui lòng tải lên ít nhất 3 hình ảnh', status: 'warning' })
      return
    }
    if (data.images.length > 10) {
      showToast({ title: 'Số hình ảnh không vượt quá 10 hình ảnh', status: 'warning' })
      return
    }
    const houseFormData = transformHouseData(data)
    if (!houseFormData) return
    if (initialData) {
      updatePropertyMutation.mutate({ id: initialData.id, newProperty: houseFormData })
      return
    }
    addPropertyMutation.mutate(houseFormData)
  }

  const handleImageUpload = (files: File[], remainingInitialImages: string) => {
    setValue('images', files)
    setValue('initialImages', remainingInitialImages)
  }

  const handleEstimatePropertyPrice = (data: THouseFormData) => {
    const houseFormData = convertHouseData(data)

    if (!houseFormData) {
      return
    }
    estimateMutation.mutate(
      { property: houseFormData, periodDays: 1 },
      {
        onSuccess: (response) => {
          if (response.data) {
            const price = response.data?.predictions[0]?.predictedPrice ?? 0
            const roundedPrice = (Math.round(price * houseFormData.area * 100) / 100) * 1_000_000
            setEstimatePrice(roundedPrice)
          }
        }
      }
    )
  }

  const handleForecastPropertyPrice = (data: THouseFormData) => {
    const houseFormData = convertHouseData(data)
    if (!houseFormData) {
      return
    }
    if (periodDays <= 1) {
      showToast({ status: 'warning', title: 'Vui lòng chọn khoảng thời gian' })
      return
    }
    forecastMutation.mutate(
      { property: houseFormData, periodDays },
      {
        onSuccess: (response) => {
          if (response.data) {
            response.data.predictions.forEach((prediction) => {
              prediction.predictedPrice = prediction.predictedPrice * area
            })
            setForecastData(response.data)
          }
        }
      }
    )
  }

  return (
    <Stack w='100%' gap={4} as='form' onSubmit={handleSubmit(onSubmit)}>
      <Flex gap={4}>
        <FormControl flex={1} isInvalid={!!errors.images}>
          <ImageUploader
            label='Hình ảnh sản phẩm'
            initialImages={initialData?.images}
            onUpload={handleImageUpload}
            onValidationChange={handleImageValidationChange}
            isLoading={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
          />
          <FormErrorMessage>{errors.images?.message}</FormErrorMessage>
        </FormControl>

        <Stack flex={2} gap={4}>
          <Stack gap={3}>
            <Heading variant='secondary'>Vị trí bất động sản</Heading>
            <FormControl>
              <AddressSelector
                control={control}
                cityName='region'
                districtName='districtName'
                wardName='wardName'
                streetName='streetName'
                isLoading={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                onStreetNameChange={fetchCoordinates}
              />
            </FormControl>
          </Stack>

          <Stack gap={3}>
            <Heading variant='secondary'>Thông tin chi tiết</Heading>

            <FormControl isInvalid={!!errors.houseType}>
              <FormLabel>Loại hình nhà ở</FormLabel>
              <Controller
                name='houseType'
                control={control}
                rules={{ required: 'Vui lòng chọn loại nhà ở' }}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                    options={FILTER_OPTION.houseType}
                    sx={{ width: '100%' }}
                    borderRadius='md'
                    placeholder='Chọn loại nhà ở'
                  />
                )}
              />
              <FormErrorMessage>{errors.houseType?.message}</FormErrorMessage>
            </FormControl>

            <Flex gap={4}>
              <FormControl isInvalid={!!errors.bedrooms}>
                <FormLabel>Số phòng ngủ</FormLabel>
                <Controller
                  name='bedrooms'
                  control={control}
                  rules={{ required: 'Vui lòng chọn số phòng ngủ' }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                      options={FILTER_OPTION.bedrooms}
                      sx={{ width: '100%' }}
                      borderRadius='md'
                      placeholder='Chọn số phòng ngủ'
                    />
                  )}
                />
                <FormErrorMessage>{errors.bedrooms?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.toilets}>
                <FormLabel>Số nhà vệ sinh</FormLabel>
                <Controller
                  name='toilets'
                  control={control}
                  rules={{ required: 'Vui lòng chọn số nhà vệ sinh' }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                      options={FILTER_OPTION.toilets}
                      sx={{ width: '100%' }}
                      borderRadius='md'
                      placeholder='Chọn số nhà vệ sinh'
                    />
                  )}
                />
                <FormErrorMessage>{errors.toilets?.message}</FormErrorMessage>
              </FormControl>
            </Flex>

            <Flex gap={4}>
              <FormControl isInvalid={!!errors.direction}>
                <FormLabel>Hướng chính</FormLabel>
                <Controller
                  name='direction'
                  control={control}
                  rules={{ required: 'Vui lòng chọn hướng' }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                      options={FILTER_OPTION.direction}
                      sx={{ width: '100%' }}
                      borderRadius='md'
                      placeholder='Chọn hướng'
                    />
                  )}
                />
                <FormErrorMessage>{errors.direction?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.floors}>
                <FormLabel>Tổng số tầng</FormLabel>
                <Controller
                  name='floors'
                  control={control}
                  rules={{ required: 'Vui lòng nhập tổng số tầng' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size='md'
                      type='number'
                      placeholder='Tổng số tầng'
                      variant='outline'
                      isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                    />
                  )}
                />
                <FormErrorMessage>{errors.floors?.message}</FormErrorMessage>
              </FormControl>
            </Flex>

            <Stack gap={3}>
              <Heading variant='secondary'>Thông tin khác</Heading>

              <Flex gap={4}>
                <FormControl isInvalid={!!errors.propertyLegalDocument}>
                  <FormLabel>Giấy tờ pháp lý</FormLabel>
                  <Controller
                    name='propertyLegalDocument'
                    control={control}
                    rules={{ required: 'Vui lòng chọn loại giấy tờ' }}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                        options={FILTER_OPTION.propertyLegalDocuments}
                        sx={{ width: '100%' }}
                        borderRadius='md'
                        placeholder='Chọn loại giấy tờ'
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.propertyLegalDocument?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.furnishedStatus}>
                  <FormLabel>Tình trạng nội thất</FormLabel>
                  <Controller
                    name='furnishedStatus'
                    control={control}
                    rules={{ required: 'Vui lòng chọn loại giấy tờ' }}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                        options={FILTER_OPTION.furnishedStatus}
                        sx={{ width: '100%' }}
                        borderRadius='md'
                        placeholder='Tình trạng'
                        value={field.value}
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.furnishedStatus?.message}</FormErrorMessage>
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel>Đặc điểm nhà</FormLabel>
                <Controller
                  name='houseCharacteristics'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CheckboxGroup
                      isLoading={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                      options={FILTER_OPTION.houseCharacteristics}
                      selectedValues={value?.map(String) || []}
                      filterType='houseCharacteristics'
                      onValueChange={(val) => {
                        const currentValues = value || []
                        const numVal = Number(val)
                        onChange(
                          currentValues.includes(numVal)
                            ? currentValues.filter((v: number) => v !== numVal)
                            : [...currentValues, numVal]
                        )
                      }}
                    />
                  )}
                />
              </FormControl>
            </Stack>
          </Stack>

          <Stack gap={3}>
            <Heading variant='secondary'>Diện tích và giá</Heading>

            <Flex gap={4}>
              <FormControl isInvalid={!!errors.width}>
                <FormLabel>Chiều ngang</FormLabel>
                <Controller
                  name='width'
                  control={control}
                  rules={{
                    required: 'Vui lòng nhập chiều ngang',
                    min: { value: 0, message: 'Chiều ngang phải lớn hơn 0' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size='md'
                      type='number'
                      placeholder='m'
                      variant='outline'
                      isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                    />
                  )}
                />
                <FormErrorMessage>{errors.width?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.length}>
                <FormLabel>Chiều dài</FormLabel>
                <Controller
                  name='length'
                  control={control}
                  rules={{
                    required: 'Vui lòng nhập chiều dài',
                    min: { value: 0, message: 'Chiều dài phải lớn hơn 0' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size='md'
                      type='number'
                      placeholder='m'
                      variant='outline'
                      isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                    />
                  )}
                />
                <FormErrorMessage>{errors.length?.message}</FormErrorMessage>
              </FormControl>
            </Flex>

            <FormControl isInvalid={!!errors.area}>
              <FormLabel>Diện tích đất</FormLabel>
              <Controller
                name='area'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size='md'
                    type='number'
                    placeholder='m²'
                    variant='outline'
                    isDisabled={true}
                    value={width && length ? Number(width) * Number(length) : 0}
                  />
                )}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.price}>
              <FormLabel>Giá bán</FormLabel>
              <Controller
                name='price'
                control={control}
                rules={{
                  required: 'Vui lòng nhập giá bán',
                  min: { value: 0, message: 'Giá bán phải lớn hơn 0' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size='md'
                    type='price'
                    placeholder='VNĐ'
                    variant='outline'
                    isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                  />
                )}
              />
              <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
            </FormControl>

            <Flex alignItems='center' justifyContent='space-between'>
              <Flex gap={4}>
                {estimatePrice && (
                  <>
                    <Heading variant='secondary'>Dự đoán giá của hệ thống: </Heading>
                    <Text color='brand.green' fontWeight='semibold'>
                      {formatCurrency(estimatePrice)} VNĐ
                    </Text>
                  </>
                )}
              </Flex>
              <Button
                variant='primary'
                type='button'
                my={6}
                alignSelf='flex-end'
                justifySelf='flex-end'
                isLoading={isAdding || isUpdating || isEstimateLoading || isForecastLoading || isGetCoordinatesLoading}
                isDisabled={isGetCoordinatesError}
                onClick={() => handleEstimatePropertyPrice(getValues())}
              >
                Định giá
              </Button>
            </Flex>
          </Stack>
        </Stack>
      </Flex>

      {isOverUser ? (
        <Flex align='center' justifyContent='space-between'>
          <CustomSelect
            maxW='200px'
            onChange={(e) => setPeriodDays(Number(e.target.value))}
            isDisabled={isForecastLoading || isEstimateLoading || isAdding || isUpdating}
            sx={{ width: '100%' }}
            borderRadius={'md'}
            options={PERIOD_OPTION}
            placeholder='Khoaảng thời gian'
          />

          <Button
            onClick={() => handleForecastPropertyPrice(getValues())}
            isLoading={isAdding || isUpdating || isEstimateLoading || isGetCoordinatesLoading}
            isDisabled={isGetCoordinatesError}
          >
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
            district={''}
            minY={minY}
            maxY={maxY}
            onViewModeChange={handleViewModeChange}
          />
        </Card>
      ) : null}
      <Stack gap={3}>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>Tiêu đề tin đăng</FormLabel>
          <Controller
            name='title'
            control={control}
            rules={{
              required: 'Vui lòng nhập tiêu đề',
              minLength: { value: 10, message: 'Tiêu đề phải có ít nhất 10 ký tự' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                size='md'
                placeholder='Nhập tiêu đề'
                variant='outline'
                isDisabled={isAdding || isUpdating}
              />
            )}
          />
          <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Mô tả chi tiết</FormLabel>
          <Controller
            name='description'
            control={control}
            rules={{
              required: 'Vui lòng nhập mô tả',
              minLength: { value: 20, message: 'Mô tả phải có ít nhất 20 ký tự' }
            }}
            render={({ field }) => (
              <Textarea
                {...field}
                border='1px solid'
                borderColor='brand.sliver'
                placeholder='Nhập mô tả'
                rows={5}
                sx={{ _hover: { borderColor: 'brand.sliver' } }}
                isDisabled={isAdding || isUpdating}
              />
            )}
          />
          <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
        </FormControl>

        <Button
          variant='primary'
          type='submit'
          my={6}
          alignSelf='flex-end'
          isLoading={isAdding || isUpdating || isEstimateLoading || isForecastLoading || isGetCoordinatesLoading}
          isDisabled={isGetCoordinatesError || !imagesValid}
        >
          Đăng tin
        </Button>
      </Stack>
    </Stack>
  )
}

export default HouseForm
