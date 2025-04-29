import {
  Box,
  Button,
  Text,
  Grid,
  GridItem,
  CardHeader,
  CardBody,
  Card,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage
} from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import { AddressSelector, CheckboxGroup, CustomSelect, TextField } from '@components'
import { PERIOD_OPTION, FILTER_OPTION } from '@constants/option'
import { ForecastRequest } from '@type/models/forecast'

export interface FormValues extends ForecastRequest {
  city: string
  ward: string
  street: string
}

interface ForecastFormProps {
  onSubmit: (data: FormValues) => Promise<void>
  isLoading: boolean
}

const ForecastForm = ({ onSubmit, isLoading }: ForecastFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      floors: 0,
      furnishingId: 0,
      rooms: 0,
      toilets: 0,
      landTypeId: 0,
      landCharacteristics: []
    }
  })

  const categoryId = watch('categoryId')
  const isLand = categoryId === 1
  const isHouse = categoryId === 2

  return (
    <Card mb={6} boxShadow='md' bgColor={'brand.white'} color={'brand.blackTextPrimary'}>
      <CardHeader>
        <Heading size='md'>Thông Tin Dự Báo</Heading>
      </CardHeader>
      <CardBody>
        <Box as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
            <GridItem>
              <Box mb={4}>
                <Text mb={2} fontWeight='medium'>
                  Địa Chỉ
                </Text>
                <AddressSelector
                  control={control}
                  cityName='city'
                  districtName='district'
                  wardName='ward'
                  streetName='street'
                  isLoading={isLoading}
                  showWard={false}
                  showStreet={false}
                />
              </Box>
            </GridItem>

            <GridItem>
              <Box mb={4}>
                <Text mb={2} fontWeight='medium'>
                  Khoảng Thời Gian Dự Báo
                </Text>
                <FormControl isInvalid={!!errors.periodDays}>
                  <Controller
                    name='periodDays'
                    control={control}
                    rules={{
                      required: 'Vui lòng chọn khoảng thời gian'
                    }}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        placeholder='Chọn khoảng thời gian'
                        options={PERIOD_OPTION}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        isDisabled={isLoading}
                        sx={{ width: '100%' }}
                        borderRadius={'md'}
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.periodDays && errors.periodDays.message}</FormErrorMessage>
                </FormControl>
              </Box>
            </GridItem>

            <GridItem>
              <Box mb={4}>
                <Text mb={2} fontWeight='medium'>
                  Loại Bất Động Sản
                </Text>
                <FormControl isInvalid={!!errors.categoryId}>
                  <Controller
                    name='categoryId'
                    control={control}
                    rules={{
                      required: 'Vui lòng chọn loại bất động sản'
                    }}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        placeholder='Chọn loại bất động sản'
                        options={FILTER_OPTION.category.filter((opt) => opt.value !== -1)}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          field.onChange(value)
                        }}
                        isDisabled={isLoading}
                        sx={{ width: '100%' }}
                        borderRadius={'md'}
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.categoryId && errors.categoryId.message}</FormErrorMessage>
                </FormControl>
              </Box>

              {isLand && (
                <Box mb={4}>
                  <Text mb={2} fontWeight='medium'>
                    Loại đất
                  </Text>
                  <FormControl isInvalid={!!errors.landTypeId}>
                    <Controller
                      name='landTypeId'
                      control={control}
                      rules={{
                        required: isHouse ? 'Vui lòng chọn loại đất' : false
                      }}
                      render={({ field }) => (
                        <CustomSelect
                          {...field}
                          placeholder='Chọn loại đất'
                          options={FILTER_OPTION.landType}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          isDisabled={isLoading}
                          sx={{ width: '100%' }}
                          borderRadius={'md'}
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.landTypeId && errors.landTypeId.message}</FormErrorMessage>
                  </FormControl>
                </Box>
              )}

              {isLand && (
                <Box mb={4}>
                  <FormControl isInvalid={!!errors.landCharacteristics}>
                    <FormLabel>Đặc điểm đất</FormLabel>
                    <Controller
                      name='landCharacteristics'
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <CheckboxGroup
                            options={FILTER_OPTION.landCharacteristics}
                            selectedValues={(value || []).map(String)}
                            filterType='landCharacteristics'
                            onValueChange={(val) => {
                              const currentValues = Array.isArray(value) ? value : []
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
                    <FormErrorMessage>
                      {errors.landCharacteristics && errors.landCharacteristics.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              )}

              {isHouse && (
                <Box mb={4}>
                  <Text mb={2} fontWeight='medium'>
                    Số tầng
                  </Text>
                  <FormControl isInvalid={!!errors.floors}>
                    <Controller
                      name='floors'
                      control={control}
                      rules={{
                        required: isHouse ? 'Vui lòng chọn số tầng' : false
                      }}
                      render={({ field }) => (
                        <CustomSelect
                          {...field}
                          placeholder='Chọn số tầng'
                          options={Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `${i + 1} tầng` }))}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          isDisabled={isLoading}
                          sx={{ width: '100%' }}
                          borderRadius={'md'}
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.floors && errors.floors.message}</FormErrorMessage>
                  </FormControl>
                </Box>
              )}

              {isHouse && (
                <Grid templateColumns='1fr 1fr' gap={3}>
                  <Box mb={4}>
                    <Text mb={2} fontWeight='medium'>
                      Số phòng ngủ
                    </Text>
                    <FormControl isInvalid={!!errors.rooms}>
                      <Controller
                        name='rooms'
                        control={control}
                        rules={{
                          required: isHouse ? 'Vui lòng chọn số phòng ngủ' : false
                        }}
                        render={({ field }) => (
                          <CustomSelect
                            {...field}
                            placeholder='Chọn số phòng ngủ'
                            options={FILTER_OPTION.bedrooms}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            isDisabled={isLoading}
                            sx={{ width: '100%' }}
                            borderRadius={'md'}
                          />
                        )}
                      />
                      <FormErrorMessage>{errors.rooms && errors.rooms.message}</FormErrorMessage>
                    </FormControl>
                  </Box>

                  <Box mb={4}>
                    <Text mb={2} fontWeight='medium'>
                      Số phòng vệ sinh
                    </Text>
                    <FormControl isInvalid={!!errors.toilets}>
                      <Controller
                        name='toilets'
                        control={control}
                        rules={{
                          required: isHouse ? 'Vui lòng chọn số phòng vệ sinh' : false
                        }}
                        render={({ field }) => (
                          <CustomSelect
                            {...field}
                            placeholder='Chọn số phòng vệ sinh'
                            options={FILTER_OPTION.toilets}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            isDisabled={isLoading}
                            sx={{ width: '100%' }}
                            borderRadius={'md'}
                          />
                        )}
                      />
                      <FormErrorMessage>{errors.toilets && errors.toilets.message}</FormErrorMessage>
                    </FormControl>
                  </Box>
                </Grid>
              )}

              {isHouse && (
                <Box mb={4}>
                  <Text mb={2} fontWeight='medium'>
                    Tình trạng nội thất
                  </Text>
                  <FormControl isInvalid={!!errors.furnishingId}>
                    <Controller
                      name='furnishingId'
                      control={control}
                      rules={{
                        required: isHouse ? 'Vui lòng chọn tình trạng nội thất' : false
                      }}
                      render={({ field }) => (
                        <CustomSelect
                          {...field}
                          placeholder='Chọn tình trạng nội thất'
                          options={FILTER_OPTION.furnishedStatus}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          isDisabled={isLoading}
                          sx={{ width: '100%' }}
                          borderRadius={'md'}
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.furnishingId && errors.furnishingId.message}</FormErrorMessage>
                  </FormControl>
                </Box>
              )}
            </GridItem>

            <GridItem>
              <Box mb={4}>
                <Text mb={2} fontWeight='medium'>
                  Hướng
                </Text>
                <FormControl isInvalid={!!errors.directionId}>
                  <Controller
                    name='directionId'
                    control={control}
                    rules={{
                      required: 'Vui lòng chọn hướng'
                    }}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        placeholder='Chọn hướng'
                        options={FILTER_OPTION.direction.filter((opt) => opt.value !== -1)}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        isDisabled={isLoading}
                        sx={{ width: '100%' }}
                        borderRadius={'md'}
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.directionId && errors.directionId.message}</FormErrorMessage>
                </FormControl>
              </Box>

              <Box mb={4}>
                <Grid templateColumns='1fr 1fr' gap={3}>
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
                        <TextField {...field} size='md' type='number' placeholder='m' variant='outline' />
                      )}
                    />
                    <FormErrorMessage>{errors.length && errors.length.message}</FormErrorMessage>
                  </FormControl>
                </Grid>
              </Box>

              <Box textAlign='right' mt={6}>
                <Button
                  type='submit'
                  colorScheme='blue'
                  isLoading={isLoading}
                  loadingText='Đang dự báo...'
                  size='md'
                  px={8}
                >
                  Dự Báo Giá
                </Button>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </CardBody>
    </Card>
  )
}

export default ForecastForm
