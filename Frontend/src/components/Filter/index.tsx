import React, { ReactNode, useState, useCallback, memo, useMemo } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { CustomSelect, TextField } from '@components'
import { FilterIcon, SearchIcon } from '@assets/icons'
import { debounce } from '@utils'
import { filterStore } from '@stores'
import { ISelectOption } from '@components/CustomSelect'

interface IFilterProps {
  children?: ReactNode
  isLoaded?: boolean
  sortOptions: ISelectOption<string | number>[]
}

const Filter = ({ isLoaded = true, sortOptions, children }: IFilterProps) => {
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
          options={sortOptions}
          placeholder='Sắp xếp theo'
          value={sortBy}
          onChange={handleSortChange}
          maxW={{ base: '100%', md: '150px' }}
          isDisabled={!isLoaded}
          aria-label='sort'
          bgColor='brand.white'
        />
        <Box w='19px'>
          <FilterIcon />
        </Box>
      </Flex>
    </Flex>
  )
}

const areEqual = (prevProps: IFilterProps, nextProps: IFilterProps) => {
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
