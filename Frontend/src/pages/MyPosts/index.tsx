import { Box, Flex, Heading, Stack, useDisclosure } from '@chakra-ui/react'
import { ITEM_PER_PAGE, SORT_PROPERTY_OPTION } from '@constants/option'
import { useCustomToast, useDeleteProperty, useGetPropertyByUser, usePropertyByUserStatistic } from '@hooks'
import { personalPropertyFilterStore } from '@stores'
import { useShallow } from 'zustand/shallow'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CustomTable, Filter, Pagination, WarningModal, StatisticCard } from '@components'
import { propertySummaryTable } from '@utils'
import { useNavigate } from 'react-router-dom'

const MyPosts = () => {
  const { itemsPerPage, currentPage, searchQuery, sortBy } = personalPropertyFilterStore(
    useShallow((state) => ({
      itemsPerPage: state.itemsPerPage,
      currentPage: state.currentPage,
      searchQuery: state.searchQuery,
      sortBy: state.sortBy
    }))
  )
  const { setItemsPerPage, setCurrentPage, setSearchQuery, setSortBy } = personalPropertyFilterStore()
  const { properties, propertiesQuery, totalProperties, isError, infinitePropertyQueryKey } = useGetPropertyByUser()
  const { deletePropertyMutation } = useDeleteProperty(infinitePropertyQueryKey)
  const { isOpen: isWarningModalOpen, onOpen: onOpenWarningModal, onClose: onCloseWarningModal } = useDisclosure()
  const [currentId, setCurrentId] = useState<number | null>(null)
  const { showToast } = useCustomToast()
  const { propertyStatistics, isLoading: isLoadingStats } = usePropertyByUserStatistic()
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
    const transformedData = properties?.map(propertySummaryTable) || []

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
      <Flex gap={4} flexDirection={{ base: 'column', md: 'row' }}>
        <Flex gap={4} w='100%'>
          <StatisticCard label='Chờ duyệt' value={propertyStatistics?.pending || 0} isLoaded={!isLoadingStats} />
          <StatisticCard label='Đã duyệt' value={propertyStatistics?.approved || 0} isLoaded={!isLoadingStats} />
        </Flex>
        <Flex gap={4} w='100%'>
          <StatisticCard label='Bị hủy' value={propertyStatistics?.canceled || 0} isLoaded={!isLoadingStats} />
          <StatisticCard label='Tổng bài viết' value={totalProperties} isLoaded={!propertiesQuery.isFetching} />
        </Flex>
      </Flex>
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
