import { Flex, Heading, Stack } from '@chakra-ui/react'
import BaseHeader from '../Base'
import ThumnailImage from '@assets/images/just-home-thumnail.png'
import { CustomSelect, Filter, FilterPopover, RangeFilter } from '@components'
import colors from '@styles/variables/colors'
import { FILTER_OPTION, SORT_USER_OPTION } from '@constants/option'
import { filterStore } from '@stores'
import { CategoryName, Unit } from '@type/models'

const ClientHeader: React.FC = () => {
  const { filterCriteria, setFilterCriteria } = filterStore()

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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCriteria({
      category: Number.parseInt(e.target.value),
      minPrice: 0,
      maxPrice: 0,
      minArea: 0,
      maxArea: 0,
      houseFeatures: [],
      landFeatures: []
    })
  }

  const handleFilterValueChange = (value: string, filterType: CategoryName) => {
    const numericValue = Number.parseInt(value)
    setFilterCriteria({
      [filterType === CategoryName.LAND ? 'landFeatures' : 'houseFeatures']: filterCriteria[
        filterType === CategoryName.LAND ? 'landFeatures' : 'houseFeatures'
      ]?.includes(numericValue)
        ? filterCriteria[filterType === CategoryName.LAND ? 'landFeatures' : 'houseFeatures']?.filter(
            (id) => id !== numericValue
          )
        : [...(filterCriteria[filterType === CategoryName.LAND ? 'landFeatures' : 'houseFeatures'] || []), numericValue]
    })
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
          <CustomSelect {...selectConfig} options={FILTER_OPTION.location} placeholder='Đà Nẵng' />

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

          <CustomSelect {...selectConfig} options={FILTER_OPTION.direction} placeholder='Hướng' />

          {filterCriteria.category === 1 ? (
            <>
              <FilterPopover
                options={FILTER_OPTION.landFeatures}
                selectedValues={
                  filterCriteria.landFeatures?.map(
                    (id) => FILTER_OPTION.landFeatures.find((opt) => opt.value === id)?.label || ''
                  ) || []
                }
                filterType='land'
                title='Đặc điểm đất'
                onValueChange={handleFilterValueChange}
              />

              <CustomSelect {...selectConfig} options={FILTER_OPTION.landType} placeholder='Loại đất' />
            </>
          ) : (
            <>
              <CustomSelect {...selectConfig} options={FILTER_OPTION.bedrooms} placeholder='Số phòng ngủ' />

              <FilterPopover
                options={FILTER_OPTION.houseFeatures}
                selectedValues={
                  filterCriteria.houseFeatures?.map(
                    (id) => FILTER_OPTION.houseFeatures.find((opt) => opt.value === id)?.label || ''
                  ) || []
                }
                filterType='house'
                title='Đặc điểm nhà'
                onValueChange={handleFilterValueChange}
              />
            </>
          )}
        </Flex>
      </Stack>
    </Stack>
  )
}

export default ClientHeader
