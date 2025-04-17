import { Box, Flex, Heading, Stack, useDisclosure } from '@chakra-ui/react'
import { ITEM_PER_PAGE } from '@constants/option'
import { useCustomToast, useGetFavouriteProperty, useToggleFavouriteProperty } from '@hooks'
import { favouritePropertyFilterStore } from '@stores'
import { useShallow } from 'zustand/shallow'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CustomTable, Pagination, WarningModal } from '@components'
import { favouritePropertySummaryTable } from '@utils'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@stores/Authentication'

const SavedPosts = () => {
  const { itemsPerPage, currentPage } = favouritePropertyFilterStore(
    useShallow((state) => ({
      itemsPerPage: state.itemsPerPage,
      currentPage: state.currentPage
    }))
  )
  const { setItemsPerPage, setCurrentPage } = favouritePropertyFilterStore()
  const { properties, propertiesQuery, totalProperties, isError, infinitePropertyQueryKey } = useGetFavouriteProperty()
  const { toggleFavouritePropertyMutation } = useToggleFavouriteProperty(infinitePropertyQueryKey)
  const { isOpen: isWarningModalOpen, onOpen: onOpenWarningModal, onClose: onCloseWarningModal } = useDisclosure()
  const [currentId, setCurrentId] = useState<number | null>(null)
  const { showToast } = useCustomToast()
  const { token } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }
  }, [])

  const handleView = (propertyId: number) => {
    navigate(`/property-detail/${propertyId}`)
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
    const userId = token?.user.id
    if (!currentId || !userId) {
      showToast({ status: 'error', title: 'Bài viết không tồn tại hoặc không thể xác định người dùng' })
      return
    }

    toggleFavouritePropertyMutation.mutate(
      { userId, propertyId: currentId },
      {
        onSuccess: () => {
          handleCloseWarningModal()
        }
      }
    )
  }

  const dataTable = useMemo(() => {
    const transformedData = properties?.map(favouritePropertySummaryTable) || []

    return transformedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  }, [properties, currentPage, itemsPerPage])

  if (isError) {
    return (
      <Heading variant='secondary' color='brand.red' p={10}>
        Không tìm thấy danh sách yêu thích
      </Heading>
    )
  }

  return (
    <Stack mt={6} gap={6}>
      <Box>
        <CustomTable
          data={dataTable}
          title='Danh sách yêu thích'
          onEdit={handleView}
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
        message='Bạn có chắc chắn muốn xóa bài viết này khỏi danh sách yêu thích không?'
        handleSubmit={handleWarningSubmit}
        isSubmitting={toggleFavouritePropertyMutation.isPending}
      />
    </Stack>
  )
}

export default SavedPosts
