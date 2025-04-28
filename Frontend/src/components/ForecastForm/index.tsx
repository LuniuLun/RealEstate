import { Box, Button, Text, Grid, GridItem, CardHeader, CardBody, Card, Heading } from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import { AddressSelector, CustomSelect } from '@components'
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
  const { control, handleSubmit, watch } = useForm<FormValues>()

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
                <Controller
                  name='periodDays'
                  control={control}
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
              </Box>
            </GridItem>

            <GridItem>
              <Box mb={4}>
                <Text mb={2} fontWeight='medium'>
                  Loại Bất Động Sản
                </Text>
                <Controller
                  name='categoryId'
                  control={control}
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
              </Box>
              {isLand && (
                <Box mb={4}>
                  <Text mb={2} fontWeight='medium'>
                    Đặc điểm đất
                  </Text>
                  <Controller
                    name='landCharacteristics'
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        placeholder='Chọn đặc điểm đất'
                        options={FILTER_OPTION.landCharacteristics}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        isDisabled={isLoading}
                        sx={{ width: '100%' }}
                        borderRadius={'md'}
                      />
                    )}
                  />
                </Box>
              )}

              {isHouse && (
                <Box mb={4}>
                  <Text mb={2} fontWeight='medium'>
                    Số tầng
                  </Text>
                  <Controller
                    name='floors'
                    control={control}
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
                </Box>
              )}

              {isHouse && (
                <Grid templateColumns='1fr 1fr' gap={3}>
                  <Box mb={4}>
                    <Text mb={2} fontWeight='medium'>
                      Số phòng ngủ
                    </Text>
                    <Controller
                      name='rooms'
                      control={control}
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
                  </Box>

                  <Box mb={4}>
                    <Text mb={2} fontWeight='medium'>
                      Số phòng vệ sinh
                    </Text>
                    <Controller
                      name='toilets'
                      control={control}
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
                  </Box>
                </Grid>
              )}

              {isHouse && (
                <Box mb={4}>
                  <Text mb={2} fontWeight='medium'>
                    Tình trạng nội thất
                  </Text>
                  <Controller
                    name='furnishingId'
                    control={control}
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
                </Box>
              )}
            </GridItem>

            <GridItem>
              <Box mb={4}>
                <Text mb={2} fontWeight='medium'>
                  Hướng
                </Text>
                <Controller
                  name='directionId'
                  control={control}
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
              </Box>

              <Box mb={4}>
                <Text mb={2} fontWeight='medium'>
                  Kích thước (m)
                </Text>
                <Grid templateColumns='1fr 1fr' gap={3}>
                  <Controller
                    name='width'
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        placeholder='Chiều rộng'
                        options={Array.from({ length: 20 }, (_, i) => ({ value: i + 1, label: `${i + 1}m` }))}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        isDisabled={isLoading}
                        sx={{ width: '100%' }}
                        borderRadius={'md'}
                      />
                    )}
                  />
                  <Controller
                    name='length'
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        placeholder='Chiều dài'
                        options={Array.from({ length: 50 }, (_, i) => ({ value: i + 1, label: `${i + 1}m` }))}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        isDisabled={isLoading}
                        sx={{ width: '100%' }}
                        borderRadius={'md'}
                      />
                    )}
                  />
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
