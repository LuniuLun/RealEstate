import { Box, Flex, Heading, Text, Stack } from '@chakra-ui/react'
import { PriceIcon, AreaIcon, WidthIcon, PaperIcon, DirectionIcon, LocationIcon } from '@assets/icons'
import { FavouritePropertyIcon, HouseDetails, LandDetails, PropertyDetailItem } from '@components'
import { transformPriceUnit, calculatePricePerSquareMeter } from '@utils'
import { FILTER_OPTION } from '@constants/option'
import { IProperty } from '@type/models'
import { memo } from 'react'

interface BasePropertyDetailsProps {
  property: IProperty
  isLoading?: boolean
}

const BasePropertyDetails = ({ property }: BasePropertyDetailsProps) => {
  const getLabel = (options: { value: number; label: string }[], id?: number) =>
    options.find((item) => item.value === id)?.label ?? 'Đang cập nhật'

  const certificate = getLabel(FILTER_OPTION.propertyLegalDocuments, property.propertyLegalDocument?.id)
  const direction = getLabel(
    FILTER_OPTION.direction.filter((option) => option.value !== null),
    property.direction
  )
  const formattedDate = new Date(property.updatedAt).toLocaleDateString('vi-VN')
  const address = [property.streetName, property.wardName, property.districtName, property.region]
    .filter(Boolean)
    .join(', ')
  return (
    <Box bg='brand.secondary' p={4} borderRadius='lg' mb={2}>
      <Box mb={4}>
        <Flex justify='space-between' align='flex-start'>
          <Heading variant='primary'>{property.title}</Heading>
          <FavouritePropertyIcon propertyId={property.id} />
        </Flex>
        <Flex mt={2} align='center' gap={2}>
          <LocationIcon />
          <Text fontSize='sm' color='brand.blackTextPrimary'>
            {address}
          </Text>
        </Flex>
      </Box>
      <Flex align='center' justifyContent='space-between' mb={4}>
        <Heading variant='secondary'>Thông tin chi tiết</Heading>
        <Text fontSize='sm' color='brand.blackTextSecondary'>
          Cập nhật {formattedDate}
        </Text>
      </Flex>

      <Stack wrap='wrap' gap={2}>
        <Flex align='center' gap={4}>
          <PropertyDetailItem
            label='Mức giá'
            value={transformPriceUnit(property.price)}
            icon={<PriceIcon />}
            highlight
          />
          <Text fontSize='sm' color='brand.blackTextPrimary'>
            {calculatePricePerSquareMeter(property.price, property.area)}
          </Text>
        </Flex>

        <PropertyDetailItem label='Diện tích' value={`${property.area} m²`} icon={<AreaIcon />} />
        <PropertyDetailItem label='Ngang' value={`${property.width} m`} icon={<WidthIcon />} />
        <PropertyDetailItem label='Giấy tờ' value={certificate} icon={<PaperIcon />} badge />
        <PropertyDetailItem label='Hướng chính' value={direction} icon={<DirectionIcon />} badge />

        {property.house && <HouseDetails property={property} />}
        {property.land && <LandDetails property={property} />}
      </Stack>

      <Heading variant='secondary' my={2}>
        Mô tả chi tiết
      </Heading>
      <Box whiteSpace='pre-wrap' p={2}>
        {property.description}
      </Box>
    </Box>
  )
}

export default memo(BasePropertyDetails)
