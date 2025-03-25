import { Box, Flex, Text, Stack, Badge } from '@chakra-ui/react'
import { BedIcon, ToiletIcon, FloorIcon, FurnishingIcon, ArchitectureIcon } from '@assets/icons'
import { PropertyDetailItem } from '@components'
import { IProperty } from '@type/models'
import { FILTER_OPTION } from '@constants/option'
import { memo } from 'react'

interface HouseDetailsProps {
  property: IProperty
}

const HouseDetails = ({ property }: HouseDetailsProps) => {
  if (!property.house) return null

  const getLabel = (options: { value: number; label: string }[], id?: number) =>
    options.find((item) => item.value === id)?.label ?? 'Đang cập nhật'

  const { house } = property

  return (
    <Stack wrap='wrap' gap={2}>
      <PropertyDetailItem
        label='Loại hình bất động sản'
        value={getLabel(FILTER_OPTION.houseType, house.houseType?.id)}
        icon={<ArchitectureIcon />}
        badge
      />
      <PropertyDetailItem label='Phòng ngủ' value={`${house.bedrooms}`} icon={<BedIcon />} />
      <PropertyDetailItem label='Toilet' value={`${house.toilets}`} icon={<ToiletIcon />} />
      <PropertyDetailItem label='Số tầng' value={`${house.floors}`} icon={<FloorIcon />} />
      <PropertyDetailItem
        label='Tình trạng nội thất'
        value={getLabel(FILTER_OPTION.furnishedStatus, house.furnishedStatus?.id)}
        icon={<FurnishingIcon />}
        badge
      />

      {!!house.houseCharacteristicMappings.length && (
        <Box mt={2}>
          <Text fontWeight='normal' mb={1}>
            Đặc điểm bất động sản:
          </Text>
          <Flex gap={2} flexWrap='wrap'>
            {house.houseCharacteristicMappings.map(({ id, houseCharacteristic }) => (
              <Badge key={id} colorScheme='blue'>
                {getLabel(FILTER_OPTION.houseCharacteristics, houseCharacteristic.id)}
              </Badge>
            ))}
          </Flex>
        </Box>
      )}
    </Stack>
  )
}

export default memo(HouseDetails)
