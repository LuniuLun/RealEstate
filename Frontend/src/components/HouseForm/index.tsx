import { useForm, Controller } from 'react-hook-form'
import { Button, Flex, FormControl, FormLabel, FormErrorMessage, Heading, Stack, Textarea } from '@chakra-ui/react'
import { AddressSelector, CheckboxGroup, CustomSelect, ImageUploader, TextField } from '@components'
import { FILTER_OPTION } from '@constants/option'
import { CategoryName, TPostProperty } from '@type/models'
import { useCustomToast } from '@hooks'
import { useAddProperty } from '@hooks/UseProperty/useAddProperty'
import colors from '@styles/variables/colors'

export type HouseFormData = Omit<TPostProperty, 'land'> & {
  images: File[]
  houseCharacteristics?: number[]
  houseType: number
  bedrooms: number
  floors: number
  toilets: number
  furnishedStatus: number
}

const HouseForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<HouseFormData>({
    defaultValues: {
      houseCharacteristics: [],
      category: { id: 2, name: CategoryName.HOUSE },
      region: '',
      wardName: '',
      streetName: ''
    }
  })
  const { showToast } = useCustomToast()
  const { tranformHouseData, addPropertyMutation } = useAddProperty()

  const onSubmit = (data: HouseFormData) => {
    if (!data.images || data.images.length < 3) {
      showToast({ title: 'Vui lòng tải lên ít nhất 3 hình ảnh', status: 'warning' })
      return
    }
    if (data.images.length > 10) {
      showToast({ title: 'Số hình ảnh không vượt quá 10 hình ảnh', status: 'warning' })
      return
    }
    const landFormData = tranformHouseData(data)
    addPropertyMutation.mutate(landFormData)
  }

  const handleImageUpload = (files: File[]) => {
    setValue('images', files)
  }

  return (
    <Flex w='100%' gap={4} as='form' onSubmit={handleSubmit(onSubmit)}>
      <FormControl flex={1} isInvalid={!!errors.images}>
        <ImageUploader label='Hình ảnh sản phẩm' onUpload={handleImageUpload} />
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
                  options={FILTER_OPTION.houseType}
                  sx={{ width: '100%' }}
                  borderRadius='md'
                  border='full'
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
                    options={FILTER_OPTION.bedrooms}
                    sx={{ width: '100%' }}
                    borderRadius='md'
                    border='full'
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
                    options={FILTER_OPTION.toilets}
                    sx={{ width: '100%' }}
                    borderRadius='md'
                    border='full'
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
                    options={FILTER_OPTION.direction}
                    sx={{ width: '100%' }}
                    borderRadius='md'
                    border='full'
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
                  <TextField {...field} size='md' type='number' placeholder='Tổng số tầng' variant='outline' />
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
                      options={FILTER_OPTION.propertyLegalDocuments}
                      sx={{ width: '100%' }}
                      borderRadius='md'
                      border='full'
                      placeholder='Chọn loại giấy tờ'
                      value={field.value?.id}
                    />
                  )}
                />
                <FormErrorMessage>
                  {errors.propertyLegalDocument && errors.propertyLegalDocument.message}
                </FormErrorMessage>
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
                      options={FILTER_OPTION.furnishedStatus}
                      sx={{ width: '100%' }}
                      borderRadius='md'
                      border='full'
                      placeholder='Tình trạng'
                      value={field.value}
                    />
                  )}
                />
                <FormErrorMessage>
                  {errors.propertyLegalDocument && errors.propertyLegalDocument.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <FormControl>
              <FormLabel>Đặc điểm nhà</FormLabel>
              <Controller
                name='houseCharacteristics'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CheckboxGroup
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
                <TextField {...field} size='md' type='number' placeholder='m²' variant='outline' />
              )}
            />
            <FormErrorMessage>{errors.area?.message}</FormErrorMessage>
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
                  <TextField {...field} size='md' type='number' placeholder='m' variant='outline' />
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
                  <TextField {...field} size='md' type='number' placeholder='m' variant='outline' />
                )}
              />
              <FormErrorMessage>{errors.length?.message}</FormErrorMessage>
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
                <TextField {...field} size='md' type='number' placeholder='VNĐ' variant='outline' />
              )}
            />
            <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
          </FormControl>

          <Button variant='primary' my={6} alignSelf='flex-end'>
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
              render={({ field }) => <TextField {...field} size='md' placeholder='Nhập tiêu đề' variant='outline' />}
            />
            <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
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
                />
              )}
            />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        <Button variant='primary' type='submit' my={6} alignSelf='flex-end'>
          Đăng tin
        </Button>
      </Stack>
    </Flex>
  )
}

export default HouseForm
