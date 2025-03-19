import { useState } from 'react'
import { Flex, Heading, Stack } from '@chakra-ui/react'
import BaseHeader from '../Base'
import ThumnailImage from '@assets/images/just-home-thumnail.png'
import { CustomSelect, Filter, FilterPopover, RangeFilter } from '@components'
import colors from '@styles/variables/colors'
import { FILTER_OPTION, SORT_USER_OPTION } from '@constants/option'

interface RangeValues {
  min: string
  max: string
}

const ClientHeader: React.FC = () => {
  const [priceRange, setPriceRange] = useState<RangeValues>({ min: '', max: '' })
  const [areaRange, setAreaRange] = useState<RangeValues>({ min: '', max: '' })
  const [selectedCategory, setSelectedCategory] = useState<number>(1)
  const [selectedLandFeatures, setSelectedLandFeatures] = useState<string[]>([])
  const [selectedHouseFeatures, setSelectedHouseFeatures] = useState<string[]>([])

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
    setSelectedCategory(Number.parseInt(e.target.value))
    setPriceRange({ min: '', max: '' })
    setAreaRange({ min: '', max: '' })
    setSelectedLandFeatures([])
    setSelectedHouseFeatures([])
  }

  const handleFilterValueChange = (value: string, filterType: string) => {
    if (filterType === 'land') {
      setSelectedLandFeatures((prev) => (prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]))
    } else if (filterType === 'house') {
      setSelectedHouseFeatures((prev) => (prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]))
    }
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
            placeholder={FILTER_OPTION.category[selectedCategory - 1]?.label || 'Chọn loại'}
            value={selectedCategory.toString()}
            onChange={handleCategoryChange}
          />

          <RangeFilter {...selectConfig} label='Giá' unit='đ' values={priceRange} onRangeChange={setPriceRange} />

          <RangeFilter {...selectConfig} label='Diện tích' unit='m²' values={areaRange} onRangeChange={setAreaRange} />

          <CustomSelect {...selectConfig} options={FILTER_OPTION.direction} placeholder='Hướng' />

          {selectedCategory === 1 ? (
            <>
              <FilterPopover
                options={FILTER_OPTION.features}
                selectedValues={selectedLandFeatures}
                filterType='land'
                title='Đặc điểm đất'
                onValueChange={handleFilterValueChange}
              />

              <CustomSelect {...selectConfig} options={FILTER_OPTION.landType} placeholder='Loại đất' />
            </>
          ) : (
            <>
              <CustomSelect {...selectConfig} options={FILTER_OPTION.bedrooms} placeholder='Số phòng ngủ' />

              <CustomSelect {...selectConfig} options={FILTER_OPTION.bathrooms} placeholder='Số nhà vệ sinh' />

              <FilterPopover
                options={FILTER_OPTION.houseFeatures}
                selectedValues={selectedHouseFeatures}
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
