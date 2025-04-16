import { Box, Button, Text, Grid, GridItem, CardHeader, CardBody, Card, Heading } from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import { AddressSelector, CustomSelect } from '@components'
import { PERIOD_OPTION } from '@constants/option'

export interface FormValues {
  city: string
  district: string
  ward: string
  street: string
  periodDays: number
}

interface ForecastFormProps {
  onSubmit: (data: FormValues) => Promise<void>
  isLoading: boolean
}

const ForecastForm = ({ onSubmit, isLoading }: ForecastFormProps) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      city: '',
      district: '',
      ward: '',
      street: '',
      periodDays: 30
    }
  })

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
                      border='full'
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
