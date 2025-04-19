import { Box, Flex, Heading, Stack, useDisclosure } from '@chakra-ui/react'
import { ITEM_PER_PAGE, SORT_USER_OPTION, STATUS_USER } from '@constants/option'
import { useUpdateStatusUser, useCustomToast, useGetUser, useGetUserById, useUpdateUser } from '@hooks'
import { userFilterStore } from '@stores'
import { useShallow } from 'zustand/shallow'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CustomTable, Filter, Pagination, WarningModal, UserModal, CustomSelect } from '@components'
import { userSummaryTable } from '@utils'
import { FilterIcon } from '@assets/icons'
import { IUser } from '@type/models'

const Users = () => {
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const { itemsPerPage, currentPage, searchQuery, sortBy, userFilterCriteria } = userFilterStore(
    useShallow((state) => ({
      itemsPerPage: state.itemsPerPage,
      currentPage: state.currentPage,
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      userFilterCriteria: state.userFilterCriteria
    }))
  )
  const { setItemsPerPage, setCurrentPage, setSearchQuery, setSortBy, setUserFilterCriteria } = userFilterStore()
  const { users, usersQuery, totalUsers, isError, infiniteUserQueryKey } = useGetUser()
  const { isOpen: isWarningModalOpen, onOpen: onOpenWarningModal, onClose: onCloseWarningModal } = useDisclosure()
  const { isOpen: isUserModalOpen, onOpen: onOpenUserModal, onClose: onCloseUserModal } = useDisclosure()
  const { showToast } = useCustomToast()
  const { user: currentUser, isError: isErrorUser } = useGetUserById(currentId, 'users')
  const { updateUserMutation, isLoading: isUpdatingStatus } = useUpdateUser(infiniteUserQueryKey)
  const { updateStatusUserMutation, isLoading: isBlockingStatus } = useUpdateStatusUser(infiniteUserQueryKey)

  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }
  }, [])

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserFilterCriteria({
      isEnabled: e.target.value as unknown as number
    })
  }

  const handleEdit = (userId: number) => {
    setCurrentId(userId)
    onOpenUserModal()
  }

  const handleCloseUserModal = () => {
    setCurrentId(undefined)
    onCloseUserModal()
  }

  const handleDelete = (userId: number) => {
    setCurrentId(userId)
    onOpenWarningModal()
  }

  const handleCloseWarningModal = () => {
    setCurrentId(undefined)
    onCloseWarningModal()
  }

  const handleWarningSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentId) {
      showToast({ status: 'error', title: 'Người dùng không tồn tại' })
      return
    }
    updateStatusUserMutation.mutate(currentId, {
      onSuccess: () => {
        handleCloseWarningModal()
      }
    })
  }

  const handleSubmit = (data: IUser) => {
    if (currentUser?.id) {
      updateUserMutation.mutate(data, {
        onSuccess: () => {
          handleCloseUserModal()
        }
      })
    } else {
      // addUserMutation.mutate(data, {
      //   onSuccess: (response) => {
      //     showToast({ status: 'success', title: response.message })
      //     handleCloseUserModal()
      //     setIsSubmitting(false)
      //   },
      //   onError: (response) => {
      //     showToast({ status: 'error', title: response.message })
      //     setIsSubmitting(false)
      //   }
      // })
    }
  }

  const dataTable = useMemo(() => {
    const transformedData = users?.map(userSummaryTable) || []

    return transformedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  }, [users, currentPage, itemsPerPage])

  if (isError) {
    return (
      <Heading variant='secondary' color='brand.red' p={10}>
        Không tìm thấy người dùng
      </Heading>
    )
  }

  if (isErrorUser) {
    showToast({ status: 'error', title: 'Không tìm thấy người dùng' })
  }

  return (
    <Stack mt={6} gap={6}>
      <Flex align='center' gap={4}>
        <Filter
          sortOptions={SORT_USER_OPTION}
          searchQuery={searchQuery}
          sortBy={sortBy}
          setSearchQuery={setSearchQuery}
          setSortBy={setSortBy}
          placeholder={'Nhập tên người, email hoặc số điện thoại'}
          w='100%'
        />
        <CustomSelect
          options={STATUS_USER}
          placeholder={
            STATUS_USER.find((option) => option.value === userFilterCriteria.isEnabled)?.label || 'Chọn trạng thái'
          }
          value={userFilterCriteria.isEnabled}
          onChange={handleStatusChange}
          w='unset'
          bgColor='brand.white'
        />
        <Box w='19px'>
          <FilterIcon />
        </Box>
      </Flex>

      {/* <Flex gap={4} flexDirection={{ base: 'column', md: 'row' }}>
        <Flex gap={4} w='100%'>
          <StatisticCard label='Chờ duyệt' value={userStatistics?.pending || 0} isLoaded={!isLoadingStats} />
          <StatisticCard label='Đã duyệt' value={userStatistics?.approved || 0} isLoaded={!isLoadingStats} />
        </Flex>
        <Flex gap={4} w='100%'>
          <StatisticCard label='Bị hủy' value={userStatistics?.canceled || 0} isLoaded={!isLoadingStats} />
          <StatisticCard label='Tổng người dùng' value={totalUsers} isLoaded={!usersQuery.isFetching} />
        </Flex>
      </Flex> */}
      <Box>
        <CustomTable
          data={dataTable}
          title='Người dùng'
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoaded={!usersQuery.isFetching}
        />

        <Flex justifyContent='center' mt={4}>
          <Pagination
            totalItems={totalUsers}
            fetchNextPage={usersQuery.fetchNextPage}
            hasNextPage={usersQuery.hasNextPage}
            itemsPerPageOptions={ITEM_PER_PAGE}
            isLoaded={!usersQuery.isFetching || !usersQuery.isFetchingNextPage}
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
        message={
          currentUser?.isEnabled
            ? 'Hành động này sẽ khoá người dùng. Bạn có muốn tiếp tục?'
            : 'Bạn có chắc muốn mở khoá người dùng này không?'
        }
        handleSubmit={handleWarningSubmit}
        isSubmitting={isBlockingStatus}
      />

      <UserModal
        selectedUser={currentUser}
        isModalOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        handleSubmit={handleSubmit}
        isSubmitting={isUpdatingStatus}
      />
    </Stack>
  )
}

export default Users
