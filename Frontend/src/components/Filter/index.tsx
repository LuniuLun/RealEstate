import React, { ReactNode, useState, useCallback, memo, useMemo } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { CustomSelect, TextField } from '@components'
import { FilterIcon, SearchIcon } from '@assets/icons'
import { SORT_OPTION } from '@constants/option'
import { debounce } from '@utils'
import { filterStore } from '@stores'
import colors from '@styles/variables/colors'

interface FilterProps {
  children?: ReactNode
  isLoaded?: boolean
}

const Filter = ({ isLoaded = true, children }: FilterProps) => {
  const { searchQuery, sortBy, setSearchQuery, setSortBy } = filterStore()
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  const debouncedSearchQuery = useMemo(() => debounce((value: string) => setSearchQuery(value), 700), [setSearchQuery])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isLoaded) {
        e.preventDefault()
        return
      }
      const value = e.target.value
      setLocalSearchQuery(value)
      debouncedSearchQuery(value)
    },
    [isLoaded, debouncedSearchQuery]
  )

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!isLoaded) {
        e.preventDefault()
        return
      }
      setSortBy(e.target.value)
    },
    [isLoaded, setSortBy]
  )

  return (
    <Flex gap={8} alignItems='center' flexDirection={{ base: 'column', md: 'row' }}>
      <TextField
        icon={<SearchIcon />}
        variant='outline'
        size='md'
        placeholder='Tìm kiếm'
        value={localSearchQuery}
        onChange={handleSearchChange}
        borderRadius={20}
        isDisabled={!isLoaded}
        minW='375px'
      />
      <Flex gap={8} alignItems='center' w={{ base: '100%', md: 'unset' }}>
        {children}
        <CustomSelect
          options={SORT_OPTION}
          placeholder='Sắp xếp theo'
          value={sortBy}
          onChange={handleSortChange}
          maxW={{ base: '100%', md: '150px' }}
          isDisabled={!isLoaded}
          aria-label='sort'
          bgColor={colors.brand.white}
        />
        <Box w='19px'>
          <FilterIcon />
        </Box>
      </Flex>
    </Flex>
  )
}

const areEqual = (prevProps: FilterProps, nextProps: FilterProps) => {
  if (prevProps.isLoaded !== nextProps.isLoaded) {
    return false
  }

  const areChildrenEqual =
    React.Children.count(prevProps.children) === React.Children.count(nextProps.children) &&
    React.Children.toArray(prevProps.children).every((child, index) => {
      const nextChild = React.Children.toArray(nextProps.children)[index]
      return React.isValidElement(child) && React.isValidElement(nextChild)
        ? child.key === nextChild.key
        : child === nextChild
    })

  return areChildrenEqual
}

export default memo(Filter, areEqual)
