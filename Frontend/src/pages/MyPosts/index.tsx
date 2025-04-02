import { Box, Flex, Heading, Stack, useDisclosure } from '@chakra-ui/react'
import { FILTER_OPTION, ITEM_PER_PAGE, SORT_PROPERTY_OPTION } from '@constants/option'
import { useCustomToast, useDeleteProperty, useGetPropertyByUser } from '@hooks'
import { personalPropertyFilterStore } from '@stores'
import { useShallow } from 'zustand/shallow'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CustomTable, Filter, Pagination, WarningModal } from '@components'
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
  const { properties, propertiesQuery, totalProperties, isError, infinitePropertyQueryKey } = useGetPropertyByUser()
  const { deletePropertyMutation } = useDeleteProperty(infinitePropertyQueryKey)
  const { isOpen: isWarningModalOpen, onOpen: onOpenWarningModal, onClose: onCloseWarningModal } = useDisclosure()
  const [currentId, setCurrentId] = useState<number | null>(null)
  const { showToast } = useCustomToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }
  }, [])

  const handleEdit = (propertyId: number) => {
    navigate(`/my-posts/update/${propertyId}`)
  }

  const handleDelete = (propertyId: number) => {
    setCurrentId(propertyId)
    onOpenWarningModal()
  }

  const handleCloseWarningModal = () => {
    setCurrentId(null)
    onCloseWarningModal()
  }

  const handleWarningSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentId) {
      showToast({ status: 'error', title: 'Bài viết không tồn tại' })
      return
    }

    deletePropertyMutation.mutate(currentId, {
      onSuccess: (response) => {
        showToast({
          status: response.status,
          title: response.message
        })

        handleCloseWarningModal()
      },
      onError: (error) => {
        showToast({
          status: 'error',
          title: error.message || 'Có lỗi xảy ra khi xóa bài viết'
        })
      }
    })
  }

  const dataTable = useMemo(() => {
    const transformedData =
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

    return transformedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  }, [properties, currentPage, itemsPerPage])

  if (isError) {
    return (
      <Heading variant='secondary' color='brand.red' p={10}>
        Không tìm thấy bài viết cá nhân
      </Heading>
    )
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

      <WarningModal
        isModalOpen={isWarningModalOpen}
        onClose={handleCloseWarningModal}
        title='WARNING'
        message='Hành động này sẽ xóa vĩnh viễn bài viết. Bạn có muốn tiếp tục không?'
        handleSubmit={handleWarningSubmit}
        isSubmitting={deletePropertyMutation.isPending}
      />
    </Stack>
  )
}

export default MyPosts
