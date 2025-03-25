import { Box, Flex, Text, Stack, Badge } from '@chakra-ui/react'
import { ArchitectureIcon } from '@assets/icons'
import { PropertyDetailItem } from '@components'

import { IProperty } from '@type/models'
import { FILTER_OPTION } from '@constants/option'
import { memo } from 'react'

interface LandDetailsProps {
  property: IProperty
}

const LandDetails = ({ property }: LandDetailsProps) => {
  if (!property.land) return null

  const getLabel = (options: { value: number; label: string }[], id?: number) =>
    options.find((item) => item.value === id)?.label ?? 'Đang cập nhật'

  const landTypeLabel = getLabel(FILTER_OPTION.landType, property.land?.landType?.id)
  const landCharacteristicMappings = property.land.landCharacteristicMappings

  return (
    <Stack wrap='wrap' gap={2}>
      <PropertyDetailItem label='Loại đất' value={landTypeLabel} icon={<ArchitectureIcon />} badge />

      {landCharacteristicMappings.length > 0 && (
        <Box mt={2}>
          <Text fontWeight='normal' mb={1}>
            Đặc điểm bất động sản:
          </Text>
          <Flex gap={2} flexWrap='wrap'>
            {landCharacteristicMappings.map((mapping) => (
              <Badge key={mapping.id} colorScheme='blue'>
                {getLabel(FILTER_OPTION.landCharacteristics, mapping.landCharacteristic.id)}
              </Badge>
            ))}
          </Flex>
        </Box>
      )}
    </Stack>
  )
}

export default memo(LandDetails)
