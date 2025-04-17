import { Box, Flex, Heading, Stack, useDisclosure } from '@chakra-ui/react'
import { FILTER_OPTION, ITEM_PER_PAGE, SORT_PROPERTY_OPTION } from '@constants/option'
import {
  useCustomToast,
  useDeleteProperty,
  useGetProperty,
  usePropertyStatistic,
  useGetPropertyById,
  useUpdateStatusProperty
} from '@hooks'
import { propertyFilterStore } from '@stores'
import { useShallow } from 'zustand/shallow'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CustomTable, Filter, Pagination, WarningModal, StatisticCard, CustomSelect, PropertyModal } from '@components'
import { propertySummaryTable } from '@utils'
import { PropertyStatus } from '@type/models'
import { FilterIcon } from '@assets/icons'
import { useQueryClient } from '@tanstack/react-query'

const AllPosts = () => {
  const queryClient = useQueryClient()
  const { itemsPerPage, currentPage, searchQuery, sortBy, propertyFilterCriteria } = propertyFilterStore(
    useShallow((state) => ({
      itemsPerPage: state.itemsPerPage,
      currentPage: state.currentPage,
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      propertyFilterCriteria: state.propertyFilterCriteria
    }))
  )
  const { setItemsPerPage, setCurrentPage, setSearchQuery, setSortBy, setPropertyFilterCriteria } =
    propertyFilterStore()
  const { properties, propertiesQuery, totalProperties, isError, infinitePropertyQueryKey } = useGetProperty()
  const { deletePropertyMutation } = useDeleteProperty(infinitePropertyQueryKey)
  const { isOpen: isWarningModalOpen, onOpen: onOpenWarningModal, onClose: onCloseWarningModal } = useDisclosure()
  const { isOpen: isPropertyModalOpen, onOpen: onOpenPropertyModal, onClose: onClosePropertyModal } = useDisclosure()
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const { showToast } = useCustomToast()
  const { propertyStatistics, isLoading: isLoadingStats } = usePropertyStatistic()
  const {
    property,
    isLoading: isLoadingProperty,
    isError: isErrorProperty
  } = useGetPropertyById(currentId, queryClient, 'properties')
  const { updateStatusPropertyMutation, isLoading: isUpdatingStatus } =
    useUpdateStatusProperty(infinitePropertyQueryKey)

  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }
  }, [])

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyFilterCriteria({
      status: e.target.value as PropertyStatus
    })
  }

  const handleEdit = (propertyId: number) => {
    setCurrentId(propertyId)
    onOpenPropertyModal()
  }

  const handleClosePropertyModal = () => {
    setCurrentId(undefined)
    onClosePropertyModal()
  }

  const handleRefuseProperty = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!currentId) {
      showToast({ status: 'error', title: 'Bài viết không tồn tại' })
      return
    }

    updateStatusPropertyMutation.mutate(
      { id: currentId, status: PropertyStatus.CANCELED },
      {
        onSuccess: () => {
          handleClosePropertyModal()
        }
      }
    )
  }

  const handleApprovalProperty = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentId) {
      showToast({ status: 'error', title: 'Bài viết không tồn tại' })
      return
    }

    updateStatusPropertyMutation.mutate(
      { id: currentId, status: PropertyStatus.APPROVAL },
      {
        onSuccess: () => {
          handleClosePropertyModal()
        }
      }
    )
  }

  const handleDelete = (propertyId: number) => {
    setCurrentId(propertyId)
    onOpenWarningModal()
  }

  const handleCloseWarningModal = () => {
    setCurrentId(undefined)
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
        Không tìm thấy bài viết
      </Heading>
    )
  }

  if (isErrorProperty) {
    showToast({ status: 'error', title: 'Không tìm thấy bài viết' })
  }

  return (
    <Stack mt={6} gap={6}>
      <Flex align='center' gap={4}>
        <Filter
          sortOptions={SORT_PROPERTY_OPTION}
          searchQuery={searchQuery}
          sortBy={sortBy}
          setSearchQuery={setSearchQuery}
          setSortBy={setSortBy}
          w='100%'
        />
        <CustomSelect
          options={FILTER_OPTION.status}
          placeholder={
            FILTER_OPTION.status.find((option) => option.value === propertyFilterCriteria.status)?.label ||
            'Chọn trạng thái'
          }
          value={propertyFilterCriteria.status?.toString() || ''}
          onChange={handleStatusChange}
          w='unset'
          bgColor='brand.white'
        />
        <Box w='19px'>
          <FilterIcon />
        </Box>
      </Flex>

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
          title='Bài viết'
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

      {property && (
        <PropertyModal
          isModalOpen={isPropertyModalOpen}
          onClose={handleClosePropertyModal}
          title='Duyệt bài viết'
          property={property}
          handleSubmit={handleApprovalProperty}
          handleClose={handleRefuseProperty}
          isSubmitting={isUpdatingStatus || deletePropertyMutation.isPending}
          isLoading={isLoadingProperty}
        />
      )}
    </Stack>
  )
}

export default AllPosts
