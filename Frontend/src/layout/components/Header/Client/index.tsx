import { Flex, Heading, Stack } from '@chakra-ui/react'
import BaseHeader from '../Base'
import ThumnailImage from '@assets/images/just-home-thumnail.png'
import { CheckboxPopover, CustomSelect, Filter, RangeFilter } from '@components'
import { FILTER_OPTION, SORT_PROPERTY_OPTION } from '@constants/option'
import { propertyFilterStore } from '@stores'
import { CategoryName, Unit } from '@type/models'
import { useLocation, useNavigate } from 'react-router-dom'

const ClientHeader = () => {
  const { propertyFilterCriteria, setPropertyFilterCriteria, resetFilters } = propertyFilterStore()
  const { searchQuery, sortBy, setSearchQuery, setSortBy } = propertyFilterStore()
  const location = useLocation()
  const navigate = useNavigate()

  const selectConfig = {
    width: 'unset',
    variant: 'filled',
    bgColor: 'rgba(255, 255, 255, 0.44)',
    color: 'white',
    h: '40px',
    borderRadius: 80,
    sx: {
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }
  }

  const ensureOnPropertyListings = () => {
    if (location.pathname !== '/property-listings') {
      navigate('/property-listings')
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetFilters()
    setPropertyFilterCriteria({
      category: Number.parseInt(e.target.value)
    })
    ensureOnPropertyListings()
  }

  const handleFilterFeatureChange = (value: string, filterType: CategoryName) => {
    const numericValue = Number.parseInt(value)
    const currentFeatures =
      filterType === CategoryName.LAND
        ? propertyFilterCriteria.landCharacteristics || []
        : propertyFilterCriteria.houseCharacteristics || []

    const newFeatures = currentFeatures.includes(numericValue)
      ? currentFeatures.filter((id) => id !== numericValue)
      : [...currentFeatures, numericValue]

    setPropertyFilterCriteria({
      [filterType === CategoryName.LAND ? 'landCharacteristics' : 'houseCharacteristics']: newFeatures
    })
    ensureOnPropertyListings()
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyFilterCriteria({
      location: {
        province: e.target.value
      }
    })
    ensureOnPropertyListings()
  }

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyFilterCriteria({
      direction: Number.parseInt(e.target.value)
    })
    ensureOnPropertyListings()
  }

  const handleLandTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyFilterCriteria({
      landType: Number.parseInt(e.target.value)
    })
    ensureOnPropertyListings()
  }

  const handleHouseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyFilterCriteria({
      houseType: Number.parseInt(e.target.value)
    })
    ensureOnPropertyListings()
  }

  const handleBedroomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyFilterCriteria({
      bedrooms: Number.parseInt(e.target.value)
    })
    ensureOnPropertyListings()
  }

  return (
    <Stack
      as='header'
      bgImage={`linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${ThumnailImage})`}
      bgSize='cover'
      bgRepeat='no-repeat'
      bgPosition='bottom'
      px={4}
      height='60vh'
    >
      <BaseHeader />
      <Stack alignItems='center' justifyContent='center' gap={4} height='100%'>
        <Heading variant='primary' color='brand.white'>
          Đặt niềm tin vào chúng tôi
        </Heading>
        <Filter
          sortOptions={SORT_PROPERTY_OPTION}
          searchQuery={searchQuery}
          sortBy={sortBy}
          setSearchQuery={setSearchQuery}
          setSortBy={setSortBy}
        />
        <Flex gap={2} mt={4} flexWrap='wrap' justifyContent='center'>
          <CustomSelect
            {...selectConfig}
            options={FILTER_OPTION.location}
            placeholder='Đà Nẵng'
            value={propertyFilterCriteria.location?.province || ''}
            onChange={handleLocationChange}
          />

          <CustomSelect
            {...selectConfig}
            options={FILTER_OPTION.category}
            placeholder={
              FILTER_OPTION.category.find((option) => option.value === propertyFilterCriteria.category)?.label ||
              'Chọn loại'
            }
            value={propertyFilterCriteria.category?.toString() || ''}
            onChange={handleCategoryChange}
          />

          <RangeFilter
            {...selectConfig}
            label='Giá'
            unit={Unit.BILLION}
            values={{ min: propertyFilterCriteria?.minPrice, max: propertyFilterCriteria.maxPrice }}
            onRangeChange={(values) => setPropertyFilterCriteria({ minPrice: values.min, maxPrice: values.max })}
          />

          <RangeFilter
            {...selectConfig}
            label='Diện tích'
            unit={Unit.SQUARE_METERS}
            values={{ min: propertyFilterCriteria.minArea, max: propertyFilterCriteria.maxArea }}
            onRangeChange={(values) => setPropertyFilterCriteria({ minArea: values.min, maxArea: values.max })}
          />

          <CustomSelect
            {...selectConfig}
            options={FILTER_OPTION.direction}
            placeholder='Hướng'
            value={propertyFilterCriteria.direction?.toString() || ''}
            onChange={handleDirectionChange}
          />

          {propertyFilterCriteria.category === 1 ? (
            <>
              <CheckboxPopover
                {...selectConfig}
                options={FILTER_OPTION.landCharacteristics}
                selectedValues={propertyFilterCriteria.landCharacteristics?.map((id) => id.toString()) || []}
                filterType={CategoryName.LAND}
                title='Đặc điểm đất'
                onValueChange={handleFilterFeatureChange}
              />

              <CustomSelect
                {...selectConfig}
                options={FILTER_OPTION.landType}
                placeholder='Loại đất'
                value={propertyFilterCriteria.landType?.toString() || ''}
                onChange={handleLandTypeChange}
              />
            </>
          ) : propertyFilterCriteria.category === 2 ? (
            <>
              <CustomSelect
                {...selectConfig}
                options={FILTER_OPTION.houseType}
                placeholder='Loại nhà'
                value={propertyFilterCriteria.houseType?.toString() || ''}
                onChange={handleHouseTypeChange}
              />

              <CustomSelect
                {...selectConfig}
                options={FILTER_OPTION.bedrooms}
                placeholder='Số phòng ngủ'
                value={propertyFilterCriteria.bedrooms?.toString() || ''}
                onChange={handleBedroomsChange}
              />

              <CustomSelect
                {...selectConfig}
                options={FILTER_OPTION.toilets}
                placeholder='Số phòng vệ sinh'
                value={propertyFilterCriteria.toilets?.toString() || ''}
                onChange={handleBedroomsChange}
              />

              <CheckboxPopover
                options={FILTER_OPTION.houseCharacteristics}
                selectedValues={
                  propertyFilterCriteria.houseCharacteristics?.map(
                    (id) => FILTER_OPTION.houseCharacteristics.find((opt) => opt.value === id)?.label || ''
                  ) || []
                }
                filterType={CategoryName.HOUSE}
                title='Đặc điểm nhà'
                onValueChange={handleFilterFeatureChange}
              />
            </>
          ) : (
            <></>
          )}
        </Flex>
      </Stack>
    </Stack>
  )
}

export default ClientHeader
