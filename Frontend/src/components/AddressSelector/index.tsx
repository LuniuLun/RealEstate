/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react'
import { Controller, Control, FieldValues, Path, useWatch } from 'react-hook-form'
import { Stack, FormControl, FormErrorMessage } from '@chakra-ui/react'
import { debounce } from '@utils'
import axios from 'axios'
import TextField from '@components/TextField'
import { ISelectOption } from '@components/CustomSelect'
import SearchableSelect from '@components/SearchableSelect'

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
  wardName?: Path<T>
  streetName?: Path<T>
  isLoading?: boolean
  onStreetNameChange?: (streetName: string) => void
  showWard?: boolean
  showStreet?: boolean
}

const AddressSelector = <T extends FieldValues>({
  control,
  cityName,
  districtName,
  wardName,
  streetName,
  isLoading,
  onStreetNameChange,
  showWard = true,
  showStreet = true
}: AddressSelectorProps<T>) => {
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Location[]>([])
  const [currentCity, setCurrentCity] = useState<string>('')
  const [currentDistrict, setCurrentDistrict] = useState<string>('')
  const [currentWard, setCurrentWard] = useState<string>('')
  const cityValue = useWatch({ control, name: cityName })
  const districtValue = useWatch({ control, name: districtName })
  const wardValue = wardName ? useWatch({ control, name: wardName }) : undefined

  const debouncedStreetNameChange = useCallback(
    debounce((value: string) => {
      onStreetNameChange?.(value)
    }, 1500),
    [onStreetNameChange]
  )

  const cityOptions: ISelectOption<string>[] = cities.map((city) => ({ value: city.Id, label: city.Name }))
  const districtOptions: ISelectOption<string>[] = districts.map((district) => ({
    value: district.Id,
    label: district.Name
  }))
  const wardOptions: ISelectOption<string>[] = wards.map((ward) => ({ value: ward.Id, label: ward.Name }))

  useEffect(() => {
    axios
      .get<City[]>('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
      .then((response) => {
        setCities(response.data)
        if (cityValue) {
          const selectedCity = response.data.find((city) => city.Name === cityValue)
          if (selectedCity) {
            setCurrentCity(selectedCity.Id)
            setDistricts(selectedCity.Districts)
            if (districtValue) {
              const selectedDistrict = selectedCity.Districts.find((district) => district.Name === districtValue)
              if (selectedDistrict) {
                setCurrentDistrict(selectedDistrict.Id)
                if (showWard && wardName && wardValue) {
                  setWards(selectedDistrict.Wards)
                  const selectedWard = selectedDistrict.Wards.find((ward) => ward.Name === wardValue)
                  if (selectedWard) {
                    setCurrentWard(selectedWard.Id)
                  }
                }
              }
            }
          }
        }
      })
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
            <SearchableSelect
              value={currentCity}
              isDisabled={isLoading}
              placeholder='Chọn tỉnh thành'
              options={cityOptions}
              onChange={(value, label) => {
                const selectedCity = cities.find((city) => city.Id === value)
                field.onChange(label)
                setCurrentCity(value)
                setDistricts(selectedCity?.Districts || [])
                setCurrentDistrict('')
                setWards([])
                setCurrentWard('')
              }}
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
            <SearchableSelect
              value={currentDistrict}
              placeholder='Chọn quận huyện'
              options={districtOptions}
              onChange={(value, label) => {
                const selectedDistrict = districts.find((district) => district.Id === value)
                field.onChange(label)
                setCurrentDistrict(value)
                setWards(selectedDistrict?.Wards || [])
                setCurrentWard('')
              }}
              isDisabled={districts.length === 0 || isLoading}
            />
            <FormErrorMessage>{error && error.message}</FormErrorMessage>
          </FormControl>
        )}
      />

      {showWard && wardName && (
        <Controller
          name={wardName}
          control={control}
          rules={{ required: showWard ? 'Vui lòng chọn phường xã' : false }}
          render={({ field, fieldState: { error } }) => (
            <FormControl isInvalid={!!error}>
              <SearchableSelect
                value={currentWard}
                placeholder='Chọn phường xã'
                options={wardOptions}
                onChange={(value, label) => {
                  field.onChange(label)
                  setCurrentWard(value)
                }}
                isDisabled={wards.length === 0 || isLoading}
              />
              <FormErrorMessage>{error && error.message}</FormErrorMessage>
            </FormControl>
          )}
        />
      )}

      {showStreet && streetName && (
        <Controller
          name={streetName}
          control={control}
          render={({ field }) => (
            <FormControl>
              <TextField
                {...field}
                variant='outline'
                size='md'
                placeholder='Nhập số nhà, tên đường'
                isDisabled={isLoading}
                onChange={(e) => {
                  const value = e.target.value
                  field.onChange(e)
                  debouncedStreetNameChange(value)
                }}
              />
            </FormControl>
          )}
        />
      )}
    </Stack>
  )
}

export default AddressSelector
