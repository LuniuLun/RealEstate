import { useEffect, useState } from 'react'
import axios from 'axios'
import { Controller, Control, FieldValues, Path } from 'react-hook-form'
import CustomSelect from '@components/CustomSelect'
import TextField from '@components/TextField'
import { Stack, FormControl, FormErrorMessage } from '@chakra-ui/react'

interface Location {
  Id: string
  Name: string
}

interface District extends Location {
  Wards: Location[]
}

interface City extends Location {
  Districts: District[]
}

interface AddressSelectorProps<T extends FieldValues> {
  control: Control<T>
  cityName: Path<T>
  districtName: Path<T>
  wardName: Path<T>
  streetName: Path<T>
  isLoading?: boolean
}

const AddressSelector = <T extends FieldValues>({
  control,
  cityName,
  districtName,
  wardName,
  streetName,
  isLoading
}: AddressSelectorProps<T>) => {
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Location[]>([])

  useEffect(() => {
    axios
      .get<City[]>('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
      .then((response) => setCities(response.data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  return (
    <Stack gap={4}>
      <Controller
        name={cityName}
        control={control}
        rules={{ required: 'Vui lòng chọn tỉnh thành' }}
        render={({ field, fieldState: { error } }) => (
          <FormControl isInvalid={!!error}>
            <CustomSelect
              {...field}
              isDisabled={isLoading}
              sx={{ width: '100%' }}
              borderRadius='md'
              border='full'
              placeholder='Chọn tỉnh thành'
              onChange={(e) => {
                const cityId = e.target.value
                const selected = cities.find((city) => city.Id === cityId)
                field.onChange(selected?.Name || '')
                setDistricts(selected?.Districts || [])
              }}
              options={cities.map((city) => ({ value: city.Id, label: city.Name }))}
            />
            <FormErrorMessage>{error && error.message}</FormErrorMessage>
          </FormControl>
        )}
      />

      <Controller
        name={districtName}
        control={control}
        rules={{ required: 'Vui lòng chọn quận huyện' }}
        render={({ field, fieldState: { error } }) => (
          <FormControl isInvalid={!!error}>
            <CustomSelect
              {...field}
              sx={{ width: '100%' }}
              borderRadius='md'
              border='full'
              placeholder='Chọn quận huyện'
              onChange={(e) => {
                const districtId = e.target.value
                const selected = districts.find((district) => district.Id === districtId)
                field.onChange(selected?.Name || '')
                setWards(selected?.Wards || [])
              }}
              options={districts.map((district) => ({ value: district.Id, label: district.Name }))}
              isDisabled={districts.length === 0 || isLoading}
            />
            <FormErrorMessage>{error && error.message}</FormErrorMessage>
          </FormControl>
        )}
      />

      <Controller
        name={wardName}
        control={control}
        rules={{ required: 'Vui lòng chọn phường xã' }}
        render={({ field, fieldState: { error } }) => (
          <FormControl isInvalid={!!error}>
            <CustomSelect
              {...field}
              sx={{ width: '100%' }}
              borderRadius='md'
              border='full'
              placeholder='Chọn phường xã'
              onChange={(e) => {
                const wardId = e.target.value
                const selected = wards.find((ward) => ward.Id === wardId)
                field.onChange(selected?.Name || '')
              }}
              options={wards.map((ward) => ({ value: ward.Id, label: ward.Name }))}
              isDisabled={wards.length === 0 || isLoading}
            />
            <FormErrorMessage>{error && error.message}</FormErrorMessage>
          </FormControl>
        )}
      />

      <Controller
        name={streetName}
        control={control}
        rules={{
          required: 'Vui lòng nhập số nhà, tên đường',
          validate: (value) => {
            return value.trim() !== '' || 'Số nhà, tên đường không được để trống'
          }
        }}
        render={({ field, fieldState: { error } }) => (
          <FormControl isInvalid={!!error}>
            <TextField
              {...field}
              variant='outline'
              size='md'
              placeholder='Nhập số nhà, tên đường'
              isDisabled={isLoading}
            />
            <FormErrorMessage>{error && error.message}</FormErrorMessage>
          </FormControl>
        )}
      />
    </Stack>
  )
}

export default AddressSelector
