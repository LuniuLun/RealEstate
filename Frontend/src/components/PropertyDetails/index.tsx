import { Box, Flex, Heading, Text, Stack } from '@chakra-ui/react'
import { PriceIcon, AreaIcon, WidthIcon, PaperIcon, DirectionIcon } from '@assets/icons'
import { HouseDetails, LandDetails, PropertyDetailItem } from '@components'
import { transformPriceUnit, calculatePricePerSquareMeter } from '@utils'
import { FILTER_OPTION } from '@constants/option'
import { IProperty } from '@type/models'
import { memo } from 'react'
import colors from '@styles/variables/colors'

interface BasePropertyDetailsProps {
  property: IProperty
}

const BasePropertyDetails = ({ property }: BasePropertyDetailsProps) => {
  const getLabel = (options: { value: number; label: string }[], id?: number) =>
    options.find((item) => item.value === id)?.label ?? 'Đang cập nhật'

  const certificate = getLabel(FILTER_OPTION.propertyLegalDocuments, property.propertyLegalDocument?.id)
  const direction = getLabel(FILTER_OPTION.direction, property.direction)
  const formattedDate = new Date(property.updatedAt).toLocaleDateString('vi-VN')

  return (
    <Box bg={colors.brand.secondary} p={4} borderRadius='lg' mb={6}>
      <Flex align='center' justifyContent='space-between' mb={4}>
        <Heading variant='secondary'>Thông tin chi tiết</Heading>
        <Text fontSize='sm' color={colors.brand.blackTextSecondary}>
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
          <Text fontSize='sm' color={colors.brand.blackTextPrimary}>
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
    </Box>
  )
}

export default memo(BasePropertyDetails)
