import { useForm, Controller } from 'react-hook-form'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Textarea,
  FormErrorMessage,
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
import { useConvertPropertyData } from '@hooks/UseProperty/useConvertProperty'
import { formatCurrency } from '@utils'
import { useState, useEffect, useCallback } from 'react'
import useAuthStore from '@stores/Authentication'
import { ForecastResponse } from '@type/models/forecast'
import { ViewMode } from '@components/ForecastChart'

export type TLandFormData = Omit<TPostProperty, 'house'> & {
  images: File[]
  landCharacteristics?: number[]
  landType: number
  landId?: number
  propertyLegalDocument: number
  initialImages: string
}

interface ILandFormProps {
  initialData: IProperty | undefined
}

const LandForm = ({ initialData }: ILandFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors }
  } = useForm<TLandFormData>({
    defaultValues: initialData
      ? {
          ...initialData,
          landType: initialData.land?.landType?.id,
          propertyLegalDocument: initialData.propertyLegalDocument?.id,
          landId: initialData.land?.id,
          landCharacteristics:
            initialData.land?.landCharacteristicMappings?.map((char) => char.landCharacteristic.id) || [],
          images: [],
          initialImages: initialData.images
        }
      : {
          landCharacteristics: [],
          category: { id: 1, name: CategoryName.LAND },
          region: '',
          wardName: '',
          streetName: ''
        }
  })
  const [estimatePrice, setEstimatePrice] = useState<number>()
  const [imagesValid, setImagesValid] = useState<boolean>(true)
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null)
  const [periodDays, setPeriodDays] = useState<number>(1)
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly')
  const { token } = useAuthStore()
  const { showToast } = useCustomToast()
  const { transformLandData, addPropertyMutation, isLoading: isAdding } = useAddProperty()
  const { updatePropertyMutation, isLoading: isUpdating } = useUpdateProperty()
  const { forecastPriceMutation: forecastMutation, isLoading: isForecastLoading } = useForecastPrice()
  const { forecastPriceMutation: estimateMutation, isLoading: isEstimateLoading } = useForecastPrice()
  const { convertLandData } = useConvertPropertyData()
  const { data, minY, maxY } = useTransformForecastedData({ forecastData, viewMode })
  const {
    getCoordinatesMutation,
    isError: isGetCoordinatesError,
    isLoading: isGetCoordinatesLoading
  } = useGetCoordinates()
  const isOverUser = token && token.user && token.user.role ? token?.user?.role.name === RoleName.BROKER : false
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
  }, [])
  const region = watch('region')
  const districtName = watch('districtName')
  const wardName = watch('wardName')
  const length = watch('length')
  const width = watch('width')

  useEffect(() => {
    if (width && length) {
      const numWidth = Number(width)
      const numLength = Number(length)

      if (!isNaN(numWidth) && !isNaN(numLength)) {
        setValue('area', numWidth * numLength)
      }
    }
  }, [width, length])

  useEffect(() => {
    if (region && districtName && wardName) {
      fetchCoordinates()
    }
  }, [wardName])

  const handleImageValidationChange = (isValid: boolean) => {
    setImagesValid(isValid)
  }

  const fetchCoordinates = (streetName?: string) => {
    let fullAddress = streetName ? `${streetName}, ` : ''
    if (region && districtName && wardName) {
      fullAddress += `${wardName}, ${districtName}, ${region}, Vietnam`

      getCoordinatesMutation.mutate(fullAddress, {
        onSuccess: (response) => {
          if (response?.data?.lat && response?.data?.lon) {
            setValue('latitude', response.data.lat)
            setValue('longitude', response.data.lon)
            console.log(response.data.lat, response.data.lon)
          }
        }
      })
    }
  }

  const onSubmit = async (data: TLandFormData) => {
    if ((!data.images || data.images.length < 3) && !initialData?.images) {
      showToast({
        title: 'Vui lòng tải lên ít nhất 3 hình ảnh',
        status: 'error'
      })
      return
    }

    if (data.images.length > 10) {
      showToast({
        title: 'Số hình ảnh không vượt quá 10 hình ảnh',
        status: 'error'
      })
      return
    }

    const landFormData = transformLandData(data)
    if (!landFormData) {
      return
    }

    if (initialData) {
      updatePropertyMutation.mutate({ id: initialData.id, newProperty: landFormData })
    } else {
      addPropertyMutation.mutate(landFormData)
    }
  }

  const handleImageUpload = (files: File[], remainingInitialImages: string) => {
    setValue('images', files)
    setValue('initialImages', remainingInitialImages)
  }

  const handleEstimatePropertyPrice = (data: TLandFormData) => {
    const landFormData = convertLandData(data)
    console.log(landFormData)

    if (!landFormData) {
      return
    }
    estimateMutation.mutate(
      { property: landFormData, periodDays: 1 },
      {
        onSuccess: (response) => {
          if (response.data) {
            const price = response.data?.predictions[0]?.predictedPrice ?? 0
            const roundedPrice = (Math.round(price * landFormData.area * 100) / 100) * 1_000_000
            setEstimatePrice(roundedPrice)
          }
        }
      }
    )
  }

  const handleForecastPropertyPrice = (data: TLandFormData) => {
    const landFormData = convertLandData(data)
    if (!landFormData) {
      return
    }
    if (periodDays <= 1) {
      showToast({ status: 'warning', title: 'Vui lòng chọn khoảng thời gian' })
      return
    }
    forecastMutation.mutate(
      { property: landFormData, periodDays },
      {
        onSuccess: (response) => {
          if (response.data) {
            setForecastData(response.data)
          }
        }
      }
    )
  }

  return (
    <Stack w='100%' gap={4} as='form' onSubmit={handleSubmit(onSubmit)}>
      <Flex gap={4}>
        <FormControl flex={1}>
          <ImageUploader
            label='Hình ảnh sản phẩm'
            initialImages={initialData?.images}
            onUpload={handleImageUpload}
            onValidationChange={handleImageValidationChange}
            isLoading={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
          />
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

            <FormControl isInvalid={!!errors.landType}>
              <FormLabel>Loại hình đất</FormLabel>
              <Controller
                name='landType'
                control={control}
                rules={{ required: 'Vui lòng chọn loại đất' }}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                    options={FILTER_OPTION.landType}
                    sx={{ width: '100%' }}
                    borderRadius='md'
                    placeholder='Chọn loại đất'
                  />
                )}
              />
              <FormErrorMessage>{errors.landType?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.direction}>
              <FormLabel>Hướng</FormLabel>
              <Controller
                name='direction'
                control={control}
                rules={{ required: 'Vui lòng chọn hướng đất' }}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    isDisabled={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                    options={FILTER_OPTION.direction}
                    sx={{ width: '100%' }}
                    borderRadius='md'
                    placeholder='Chọn hướng đất'
                  />
                )}
              />
              <FormErrorMessage>{errors.direction?.message}</FormErrorMessage>
            </FormControl>
          </Stack>

          <Stack gap={3}>
            <Heading variant='secondary'>Thông tin khác</Heading>

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

            <FormControl>
              <FormLabel>Đặc điểm đất</FormLabel>
              <Controller
                name='landCharacteristics'
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <CheckboxGroup
                      isLoading={isAdding || isUpdating || isEstimateLoading || isForecastLoading}
                      options={FILTER_OPTION.landCharacteristics}
                      selectedValues={(value || []).map(String)}
                      filterType='landCharacteristics'
                      onValueChange={(val) => {
                        const currentValues = value || []
                        const numVal = Number(val)
                        onChange(
                          currentValues.includes(numVal)
                            ? currentValues.filter((v) => v !== numVal)
                            : [...currentValues, numVal]
                        )
                      }}
                    />
                  )
                }}
              />
            </FormControl>
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
                <FormErrorMessage>{errors.width && errors.width.message}</FormErrorMessage>
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
                <FormErrorMessage>{errors.length && errors.length.message}</FormErrorMessage>
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
            isLoading={isAdding || isUpdating || isEstimateLoading || isForecastLoading || isGetCoordinatesLoading}
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
          {initialData ? 'Cập nhật' : 'Đăng tin'}
        </Button>
      </Stack>
    </Stack>
  )
}

export default LandForm
