import { useMemo } from 'react'
import { Stack, Flex, Spinner, Text, Center } from '@chakra-ui/react'
import { InfoGroup, PropertyCard, Pagination } from '@components'
import { filterStore } from '@stores'
import { ITEM_PER_PAGE } from '@constants/option'
import { useGetProperty, useCustomToast } from '@hooks'
import { useShallow } from 'zustand/shallow'

const ListingProperty = () => {
  const { showToast } = useCustomToast()
  const { itemsPerPage, currentPage } = filterStore(
    useShallow((state) => ({
      itemsPerPage: state.itemsPerPage,
      currentPage: state.currentPage
    }))
  )

  const { properties, propertiesQuery, totalProperties, isLoading, isError } = useGetProperty()

  const paginatedProperties = useMemo(() => {
    if (!properties) return []
    return properties.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  }, [properties, currentPage, itemsPerPage])

  if (isError) {
    showToast({
      status: 'error',
      title: 'Error fetching properties'
    })
  }

  return (
    <Stack my={10} mb={20}>
      <Stack justifyContent='center' alignItems='center' gap={6}>
        <InfoGroup heading='Mua Bán Nhà Đất Chính Chủ, Giá Rẻ' description='Tháng 3/2025' size='lg' />

        {isLoading ? (
          <Center p={10}>
            <Spinner size='xl' />
          </Center>
        ) : paginatedProperties && paginatedProperties.length > 0 ? (
          <Flex gap={4} flexWrap='wrap' margin='auto' maxW={{ sm: '368px', lg: '740px', xl: '1112px' }}>
            {paginatedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                imageUrl={property.images.split(',')[0]}
                title={property.title}
                description={`${property.house?.bedrooms || 0} PN • Hướng ${property.direction} • ${property.description}`}
                price={`${property.price.toLocaleString()} tỷ`}
                areaInfo={`${Math.round(property.price / property.area).toLocaleString()} tr/m² • ${property.area} m²`}
                location={`${property.wardName}, ${property.region}`}
                time={new Date(property.createdAt).toLocaleDateString('vi-VN')}
              />
            ))}
          </Flex>
        ) : (
          <Center p={10}>
            <Text>Không tìm thấy bất động sản nào</Text>
          </Center>
        )}

        <Flex justifyContent='center'>
          <Pagination
            totalItems={totalProperties}
            fetchNextPage={propertiesQuery.fetchNextPage}
            hasNextPage={propertiesQuery.hasNextPage}
            itemsPerPageOptions={ITEM_PER_PAGE}
            isLoaded={!propertiesQuery.isFetching || !propertiesQuery.isFetchingNextPage}
          />
        </Flex>
      </Stack>
    </Stack>
  )
}

export default ListingProperty
