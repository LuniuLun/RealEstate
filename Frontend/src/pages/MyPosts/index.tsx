import { Box, Flex, Stack } from '@chakra-ui/react'
import { FILTER_OPTION, ITEM_PER_PAGE, SORT_PROPERTY_OPTION } from '@constants/option'
import { useGetPropertyByUser } from '@hooks'
import { personalPropertyFilterStore } from '@stores'
import { useShallow } from 'zustand/shallow'
import { useEffect } from 'react'
import { CustomTable, Filter, Pagination } from '@components'
import { transformPriceUnit } from '@utils'
import { useNavigate } from 'react-router-dom'

const MyPosts = () => {
  const { itemsPerPage, currentPage } = personalPropertyFilterStore(
    useShallow((state) => ({
      itemsPerPage: state.itemsPerPage,
      currentPage: state.currentPage
    }))
  )
  const { setItemsPerPage, setCurrentPage, searchQuery, sortBy, setSearchQuery, setSortBy } =
    personalPropertyFilterStore()
  const { properties, propertiesQuery, totalProperties, reCallQuery, isError } = useGetPropertyByUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }
  }, [])

  const handleEdit = (propertyId: number) => {
    navigate(`/my-posts/update/${propertyId}`)
  }

  const handleDelete = async (propertyId: number) => {
    try {
      console.log(propertyId)

      reCallQuery()
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  const dataTable =
    properties?.map((property) => ({
      id: property.id,
      'Loại hình': FILTER_OPTION.category[property.category.id - 1].label,
      'Tiêu đề': property.title,
      'Vị trí': `${property.streetName}, ${property.wardName}, ${property.districtName}, ${property.region}`,
      'Diện tích': property.area,
      Giá: transformPriceUnit(property.price),
      'Trạng thái': property.status,
      'Cập nhập': new Date(property.createdAt).toLocaleDateString()
    })) || []

  if (isError) {
    return <Box>Error loading properties. Please try again.</Box>
  }

  return (
    <Stack mt={6} gap={6}>
      <Filter
        sortOptions={SORT_PROPERTY_OPTION}
        searchQuery={searchQuery}
        sortBy={sortBy}
        setSearchQuery={setSearchQuery}
        setSortBy={setSortBy}
      />
      <Box>
        <CustomTable
          data={dataTable}
          title='Bài viết của tôi'
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoaded={!propertiesQuery.isFetching}
        />

        <Flex justifyContent='center' mt={4}>
          <Pagination
            totalItems={totalProperties}
            fetchNextPage={propertiesQuery.fetchNextPage}
            hasNextPage={propertiesQuery.hasNextPage}
            itemsPerPageOptions={ITEM_PER_PAGE}
            isLoaded={!propertiesQuery.isFetching || !propertiesQuery.isFetchingNextPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </Flex>
      </Box>
    </Stack>
  )
}

export default MyPosts
