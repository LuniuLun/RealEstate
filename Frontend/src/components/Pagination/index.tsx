import { memo, useCallback } from 'react'
import { Flex, Text, Skeleton, IconButton } from '@chakra-ui/react'
import { LeftArrowIcon, RightArrowIcon } from '@assets/icons'
import CustomSelect from '@components/CustomSelect'

export interface IPaginationProps {
  totalItems: number
  itemsPerPageOptions: number[]
  fetchNextPage: () => void
  hasNextPage: boolean
  isLoaded?: boolean
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  setItemsPerPage: (itemsPerPage: number) => void
}

const Pagination = ({
  totalItems,
  itemsPerPageOptions,
  fetchNextPage,
  hasNextPage,
  isLoaded = true,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage
}: IPaginationProps) => {
  const handleItemsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newItemsPerPage = parseInt(e.target.value)
      if (newItemsPerPage !== itemsPerPage) {
        setItemsPerPage(newItemsPerPage)
      }
    },
    [itemsPerPage, setItemsPerPage]
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
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
      if (hasNextPage) fetchNextPage()
    }
  }

  const startItem = totalItems === 0 ? 0 : currentPage * itemsPerPage + 1
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems)

  return (
    <Flex
      align='center'
      gap='26px'
      flexDirection={{ base: 'column', md: 'row' }}
      p={4}
      color='brand.blackTextQuaternary'
      fontSize='xs'
    >
      <Skeleton isLoaded={isLoaded} startColor='gray.100' endColor='gray.300' minH='25px'>
        <Flex align='center' gap='26px'>
          <Flex align='center' gap='26px'>
            <Text whiteSpace='nowrap'>Số lượng trên 1 trang:</Text>
            <CustomSelect
              variant='flushed'
              borderRadius='unset'
              fontSize='xs'
              sx={{ _hover: { bgColor: 'transparent' } }}
              placeholder={itemsPerPage.toString()}
              onChange={handleItemsPerPageChange}
              options={ISelectOptions}
              aria-label='items-per-page'
            />
          </Flex>
          <Text>{`${startItem} - ${endItem} trong ${totalItems}`}</Text>
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
            isDisabled={currentPage + 1 >= totalPages || !hasNextPage}
            aria-label='next-page'
          ></IconButton>
        </Flex>
      </Skeleton>
    </Flex>
  )
}

export default memo(Pagination)
