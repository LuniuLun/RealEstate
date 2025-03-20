import { memo, useCallback } from 'react'
import { Flex, Text, Skeleton, IconButton } from '@chakra-ui/react'
import { LeftArrowIcon, RightArrowIcon } from '@assets/icons'
import CustomSelect from '@components/CustomSelect'
import colors from '@styles/variables/colors'
import { filterStore } from '@stores'
import { useShallow } from 'zustand/shallow'

export interface IPaginationProps {
  totalItems: number
  itemsPerPageOptions: number[]
  fetchNextPage: () => void
  hasNextPage: boolean
  isLoaded?: boolean
}
const Pagination = ({ totalItems, itemsPerPageOptions, fetchNextPage, hasNextPage, isLoaded }: IPaginationProps) => {
  const { itemsPerPage, currentPage } = filterStore(
    useShallow((state) => ({
      itemsPerPage: state.itemsPerPage,
      currentPage: state.currentPage
    }))
  )
  const { setItemsPerPage, setCurrentPage } = filterStore()

  const handleItemsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newItemsPerPage = parseInt(e.target.value)
      if (newItemsPerPage !== itemsPerPage) {
        setItemsPerPage(newItemsPerPage)
      }
    },
    [itemsPerPage]
  )

  if ((totalItems === 0 || itemsPerPage === 0) && isLoaded) return null

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const ISelectOptions = itemsPerPageOptions.map((option) => ({
    value: option,
    label: option.toString()
  }))

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      if (hasNextPage) fetchNextPage()
    }
  }

  return (
    <Flex
      align='center'
      gap='26px'
      flexDirection={{ base: 'column', md: 'row' }}
      p={4}
      color={colors.brand.blackTextQuaternary}
      fontSize='xs'
    >
      <Skeleton isLoaded={isLoaded} startColor='gray.100' endColor='gray.300' minH='25px'>
        <Flex align='center' gap='26px'>
          <Flex align='center' gap='26px'>
            <Text whiteSpace='nowrap'>Số lượng trên 1 trang:</Text>
            <CustomSelect
              placeholder={itemsPerPage.toString()}
              fontSize='xs'
              onChange={handleItemsPerPageChange}
              options={ISelectOptions}
              aria-label='items-per-page'
            />
          </Flex>
          <Text>{`${currentPage * itemsPerPage + 1} - ${Math.min((currentPage + 1) * itemsPerPage, totalItems)} trong ${totalItems}`}</Text>
        </Flex>
      </Skeleton>
      <Skeleton isLoaded={isLoaded} startColor='gray.100' endColor='gray.300' minH='25px'>
        <Flex gap={2}>
          <IconButton
            icon={<LeftArrowIcon />}
            variant='unstyled'
            onClick={handlePrevious}
            isDisabled={currentPage < 1}
            aria-label='previous-page'
          />
          <IconButton
            icon={<RightArrowIcon />}
            variant='unstyled'
            onClick={handleNext}
            isDisabled={currentPage + 1 === totalPages || !hasNextPage}
            aria-label='next-page'
          ></IconButton>
        </Flex>
      </Skeleton>
    </Flex>
  )
}

export default memo(Pagination)
