import { useForm, Controller } from 'react-hook-form'
import { Button, Flex, FormControl, FormLabel, Heading, Stack, Textarea, FormErrorMessage } from '@chakra-ui/react'
import { AddressSelector, CheckboxGroup, CustomSelect, ImageUploader, TextField } from '@components'
import { FILTER_OPTION } from '@constants/option'
import { CategoryName, TPostProperty } from '@type/models'
import { useCustomToast } from '@hooks'
import { useAddProperty } from '@hooks/UseProperty/useAddProperty'
import colors from '@styles/variables/colors'
import { useGetCoordinates } from '@hooks/UseCoordinates/useGetCoordinates'

export type LandFormData = Omit<TPostProperty, 'house'> & {
  images: File[]
  landCharacteristics?: number[]
  landType: number
}

const LandForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LandFormData>({
    defaultValues: {
      landCharacteristics: [],
      category: { id: 1, name: CategoryName.LAND },
      region: '',
      wardName: '',
      streetName: ''
    }
  })
  const { showToast } = useCustomToast()
  const { transformLandData, addPropertyMutation, isLoading } = useAddProperty()
  const { getCoordinatesMutation, isError: isGetCoordinatesError } = useGetCoordinates()
  const region = watch('region')
  const districtName = watch('districtName')
  const wardName = watch('wardName')

  const handleChangeStreetName = (streetName: string) => {
    if (region && districtName && wardName && streetName) {
      const fullAddress = `${streetName}, ${wardName}, ${districtName}, ${region}, Vietnam`
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

  const onSubmit = (data: LandFormData) => {
    if (!data.images || data.images.length < 3) {
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
    if (!landFormData) return
    addPropertyMutation.mutate(landFormData)
  }

  const handleImageUpload = (files: File[]) => {
    setValue('images', files)
  }

  return (
    <Flex w='100%' gap={4} as='form' onSubmit={handleSubmit(onSubmit)}>
      <FormControl flex={1}>
        <ImageUploader label='Hình ảnh sản phẩm' onUpload={handleImageUpload} isLoading={isLoading} />
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
              isLoading={isLoading}
              onStreetNameChange={handleChangeStreetName}
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
                  isDisabled={isLoading}
                  options={FILTER_OPTION.landType}
                  sx={{ width: '100%' }}
                  borderRadius='md'
                  border='full'
                  placeholder='Chọn loại đất'
                />
              )}
            />
            <FormErrorMessage>{errors.landType && errors.landType.message}</FormErrorMessage>
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
                  isDisabled={isLoading}
                  options={FILTER_OPTION.direction}
                  sx={{ width: '100%' }}
                  borderRadius='md'
                  border='full'
                  placeholder='Chọn hướng đất'
                />
              )}
            />
            <FormErrorMessage>{errors.direction && errors.direction.message}</FormErrorMessage>
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
                  isDisabled={isLoading}
                  options={FILTER_OPTION.propertyLegalDocuments}
                  sx={{ width: '100%' }}
                  borderRadius='md'
                  border='full'
                  placeholder='Chọn loại giấy tờ'
                  value={field.value?.id}
                />
              )}
            />
            <FormErrorMessage>{errors.propertyLegalDocument && errors.propertyLegalDocument.message}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Đặc điểm đất</FormLabel>
            <Controller
              name='landCharacteristics'
              control={control}
              render={({ field: { value, onChange } }) => (
                <CheckboxGroup
                  isLoading={isLoading}
                  options={FILTER_OPTION.landCharacteristics}
                  selectedValues={value?.map(String) || []}
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
              )}
            />
          </FormControl>
        </Stack>

        <Stack gap={3}>
          <Heading variant='secondary'>Diện tích và giá</Heading>
          <FormControl isInvalid={!!errors.area}>
            <FormLabel>Diện tích đất</FormLabel>
            <Controller
              name='area'
              control={control}
              rules={{
                required: 'Vui lòng nhập diện tích',
                min: { value: 0, message: 'Diện tích phải lớn hơn 0' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  size='md'
                  type='number'
                  placeholder='m²'
                  variant='outline'
                  isDisabled={isLoading}
                />
              )}
            />
            <FormErrorMessage>{errors.area && errors.area.message}</FormErrorMessage>
          </FormControl>

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
                    isDisabled={isLoading}
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
                    isDisabled={isLoading}
                  />
                )}
              />
              <FormErrorMessage>{errors.length && errors.length.message}</FormErrorMessage>
            </FormControl>
          </Flex>

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
                  type='number'
                  placeholder='VNĐ'
                  variant='outline'
                  isDisabled={isLoading}
                />
              )}
            />
            <FormErrorMessage>{errors.price && errors.price.message}</FormErrorMessage>
          </FormControl>

          <Button
            variant='primary'
            my={6}
            alignSelf='flex-end'
            isLoading={isLoading}
            isDisabled={isGetCoordinatesError}
          >
            Định giá
          </Button>
        </Stack>

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
                <TextField {...field} size='md' placeholder='Nhập tiêu đề' variant='outline' isDisabled={isLoading} />
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
                  borderColor={colors.brand.sliver}
                  placeholder='Nhập mô tả'
                  rows={5}
                  sx={{ _hover: { borderColor: colors.brand.sliver } }}
                  isDisabled={isLoading}
                />
              )}
            />
            <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        <Button
          variant='primary'
          type='submit'
          my={6}
          alignSelf='flex-end'
          isLoading={isLoading}
          isDisabled={isGetCoordinatesError}
        >
          Đăng tin
        </Button>
      </Stack>
    </Flex>
  )
}

export default LandForm
