import { useMemo } from 'react'
import { Stack, Flex, Spinner, Text, Center, Heading } from '@chakra-ui/react'
import { PropertyCard, Pagination } from '@components'
import { propertyFilterStore } from '@stores'
import { FILTER_OPTION, ITEM_PER_PAGE } from '@constants/option'
import { useGetProperty, useCustomToast } from '@hooks'
import { useShallow } from 'zustand/shallow'
import { calculatePricePerSquareMeter, transformPriceUnit } from '@utils'

const ListingProperty = () => {
  const { showToast } = useCustomToast()
  const { itemsPerPage, currentPage } = propertyFilterStore(
    useShallow((state) => ({
      itemsPerPage: state.itemsPerPage,
      currentPage: state.currentPage
    }))
  )
  const { setItemsPerPage, setCurrentPage } = propertyFilterStore()
  const { properties, propertiesQuery, totalProperties, isLoading, isError } = useGetProperty()

  const paginatedProperties = useMemo(() => {
    if (!properties) return []
    return properties.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  }, [properties, currentPage, itemsPerPage])
  if (isError) {
    showToast({
      status: 'error',
      title: 'Không thể tải dữ liệu, vui lòng thử lại!'
    })
  }
  return (
    <Stack my={10} mb={20}>
      <Stack justifyContent='center' alignItems='center' gap={6}>
        <Heading size='2xl' color='brand.yellowHeading'>
          Mua Bán Nhà Đất Chính Chủ, Giá Rẻ
        </Heading>

        {isLoading ? (
          <Center p={10}>
            <Spinner size='xl' />
          </Center>
        ) : paginatedProperties.length > 0 ? (
          <Flex gap={4} flexWrap='wrap' margin='auto' maxW={{ sm: '368px', lg: '740px', xl: '1112px' }}>
            {paginatedProperties.map((property) => {
              const propertyImage = property.images?.split(',')[0] ?? ''
              const directionLabel = FILTER_OPTION.direction[property.direction - 1]?.label ?? 'Không xác định'
              const landTypeLabel =
                property.land?.landType?.id !== undefined
                  ? FILTER_OPTION.landType[property.land.landType.id - 1]?.label
                  : null
              const furnishedStatusLabel =
                property.house?.furnishedStatus?.id !== undefined
                  ? FILTER_OPTION.furnishedStatus[property.house.furnishedStatus.id - 1]?.label
                  : null

              const description = [
                property.house?.bedrooms ? `${property.house.bedrooms} PN` : '',
                `Hướng ${directionLabel}`,
                landTypeLabel ?? furnishedStatusLabel ?? ''
              ]
                .filter(Boolean)
                .join(' • ')

              return (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  imageUrl={propertyImage}
                  title={property.title}
                  description={description}
                  price={transformPriceUnit(property.price)}
                  areaInfo={`${calculatePricePerSquareMeter(property.price, property.area)} • ${property.area} m²`}
                  location={property.wardName}
                  time={new Date(property.createdAt).toLocaleDateString('vi-VN')}
                />
              )
            })}
          </Flex>
        ) : (
          <Center p={10}>
            <Text>Không tìm thấy bất động sản nào</Text>
          </Center>
        )}

        {totalProperties > 0 && (
          <Flex justifyContent='center'>
            <Pagination
              totalItems={totalProperties}
              fetchNextPage={propertiesQuery.fetchNextPage}
              hasNextPage={propertiesQuery.hasNextPage}
              itemsPerPageOptions={ITEM_PER_PAGE}
              isLoaded={!propertiesQuery.isFetching || !propertiesQuery.isFetchingNextPage}
              currentPage={currentPage}
              setCurrentPage={setItemsPerPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setCurrentPage}
            />
          </Flex>
        )}
      </Stack>
    </Stack>
  )
}

export default ListingProperty
