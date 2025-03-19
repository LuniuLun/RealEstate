import { Flex, Stack } from '@chakra-ui/react'
import { InfoGroup, PropertyCard } from '@components'

const ListingProperty = () => {
  return (
    <Stack my={10} mb={20}>
      <Stack justifyContent='center' alignItems='center' gap={6}>
        <InfoGroup heading='Mua Bán Nhà Đất Chính Chủ, Giá Rẻ' description='Tháng 3/2025' size='lg' />
        <Flex gap={4} flexWrap='wrap' margin='auto' maxW={{ sm: '368px', lg: '740px', xl: '1112px' }}>
          <PropertyCard
            imageUrl='https://example.com/image.jpg'
            title='Bán nhà trung tâm quận Hải Châu, gần cầu Rồng'
            description='3 PN • Hướng Tây Nam • Nhà ngõ, hẻm'
            price='3,65 tỷ'
            areaInfo='55 tr/m² • 66 m²'
            location='Quận Hải Châu'
            time='14 giờ trước'
          />
          <PropertyCard
            imageUrl='https://example.com/image.jpg'
            title='Bán nhà trung tâm quận Hải Châu, gần cầu Rồng'
            description='3 PN • Hướng Tây Nam • Nhà ngõ, hẻm'
            price='3,65 tỷ'
            areaInfo='55 tr/m² • 66 m²'
            location='Quận Hải Châu'
            time='14 giờ trước'
          />
          <PropertyCard
            imageUrl='https://example.com/image.jpg'
            title='Bán nhà trung tâm quận Hải Châu, gần cầu Rồng'
            description='3 PN • Hướng Tây Nam • Nhà ngõ, hẻm'
            price='3,65 tỷ'
            areaInfo='55 tr/m² • 66 m²'
            location='Quận Hải Châu'
            time='14 giờ trước'
          />
          <PropertyCard
            imageUrl='https://example.com/image.jpg'
            title='Bán nhà trung tâm quận Hải Châu, gần cầu Rồng'
            description='3 PN • Hướng Tây Nam • Nhà ngõ, hẻm'
            price='3,65 tỷ'
            areaInfo='55 tr/m² • 66 m²'
            location='Quận Hải Châu'
            time='14 giờ trước'
          />
        </Flex>
      </Stack>
    </Stack>
  )
}

export default ListingProperty
