import { Flex, Heading, Stack } from '@chakra-ui/react'
import BaseHeader from '../Base'
import ThumnailImage from '@assets/images/just-home-thumnail.png'
import { CheckboxPopover, CustomSelect, Filter, RangeFilter } from '@components'
import colors from '@styles/variables/colors'
import { FILTER_OPTION, SORT_USER_OPTION } from '@constants/option'
import { filterStore } from '@stores'
import { CategoryName, Unit } from '@type/models'
import { useLocation, useNavigate } from 'react-router-dom'

const ClientHeader = () => {
  const { filterCriteria, setFilterCriteria, resetFilters } = filterStore()
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
    setFilterCriteria({
      category: Number.parseInt(e.target.value)
    })
    ensureOnPropertyListings()
  }

  const handleFilterFeatureChange = (value: string, filterType: CategoryName) => {
    const numericValue = Number.parseInt(value)
    const currentFeatures =
      filterType === CategoryName.LAND
        ? filterCriteria.landCharacteristics || []
        : filterCriteria.houseCharacteristics || []

    const newFeatures = currentFeatures.includes(numericValue)
      ? currentFeatures.filter((id) => id !== numericValue)
      : [...currentFeatures, numericValue]

    setFilterCriteria({
      [filterType === CategoryName.LAND ? 'landCharacteristics' : 'houseCharacteristics']: newFeatures
    })
    ensureOnPropertyListings()
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCriteria({
      location: {
        province: e.target.value
      }
    })
    ensureOnPropertyListings()
  }

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCriteria({
      direction: Number.parseInt(e.target.value)
    })
    ensureOnPropertyListings()
  }

  const handleLandTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCriteria({
      landType: Number.parseInt(e.target.value)
    })
    ensureOnPropertyListings()
  }

  const handleBedroomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCriteria({
      bedrooms: Number.parseInt(e.target.value)
    })
    ensureOnPropertyListings()
  }

  return (
    <Stack
      bgImage={`linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${ThumnailImage})`}
      bgSize='cover'
      bgRepeat='no-repeat'
      bgPosition='bottom'
      px={4}
      height='60vh'
    >
      <BaseHeader />
      <Stack alignItems='center' justifyContent='center' gap={4} height='100%'>
        <Heading variant='primary' color={colors.brand.white}>
          Đặt niềm tin vào chúng tôi
        </Heading>
        <Filter sortOptions={SORT_USER_OPTION} />
        <Flex gap={2} mt={4} flexWrap='wrap' justifyContent='center'>
          <CustomSelect
            {...selectConfig}
            options={FILTER_OPTION.location}
            placeholder='Đà Nẵng'
            value={filterCriteria.location?.province || ''}
            onChange={handleLocationChange}
          />

          <CustomSelect
            {...selectConfig}
            options={FILTER_OPTION.category}
            placeholder={
              FILTER_OPTION.category.find((option) => option.value === filterCriteria.category)?.label || 'Chọn loại'
            }
            value={filterCriteria.category?.toString() || ''}
            onChange={handleCategoryChange}
          />

          <RangeFilter
            {...selectConfig}
            label='Giá'
            unit={Unit.BILLION}
            values={{ min: filterCriteria?.minPrice, max: filterCriteria.maxPrice }}
            onRangeChange={(values) => setFilterCriteria({ minPrice: values.min, maxPrice: values.max })}
          />

          <RangeFilter
            {...selectConfig}
            label='Diện tích'
            unit={Unit.SQUARE_METERS}
            values={{ min: filterCriteria.minArea, max: filterCriteria.maxArea }}
            onRangeChange={(values) => setFilterCriteria({ minArea: values.min, maxArea: values.max })}
          />

          <CustomSelect
            {...selectConfig}
            options={FILTER_OPTION.direction}
            placeholder='Hướng'
            value={filterCriteria.direction?.toString() || ''}
            onChange={handleDirectionChange}
          />

          {filterCriteria.category === 1 ? (
            <>
              <CheckboxPopover
                {...selectConfig}
                options={FILTER_OPTION.landCharacteristics}
                selectedValues={filterCriteria.landCharacteristics?.map((id) => id.toString()) || []}
                filterType={CategoryName.LAND}
                title='Đặc điểm đất'
                onValueChange={handleFilterFeatureChange}
              />

              <CustomSelect
                {...selectConfig}
                options={FILTER_OPTION.landType}
                placeholder='Loại đất'
                value={filterCriteria.landType?.toString() || ''}
                onChange={handleLandTypeChange}
              />
            </>
          ) : filterCriteria.category === 2 ? (
            <>
              <CustomSelect
                {...selectConfig}
                options={FILTER_OPTION.bedrooms}
                placeholder='Số phòng ngủ'
                value={filterCriteria.bedrooms?.toString() || ''}
                onChange={handleBedroomsChange}
              />

              <CustomSelect
                {...selectConfig}
                options={FILTER_OPTION.toilets}
                placeholder='Số phòng vệ sinh'
                value={filterCriteria.toilets?.toString() || ''}
                onChange={handleBedroomsChange}
              />

              <CheckboxPopover
                options={FILTER_OPTION.houseCharacteristics}
                selectedValues={
                  filterCriteria.houseCharacteristics?.map(
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
