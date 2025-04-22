import { Box, List, ListItem, Text } from '@chakra-ui/react'
import { ISelectOption } from '@components/CustomSelect'
import TextField from '@components/TextField'
import { useEffect, useRef, useState } from 'react'

interface SearchableSelectProps<T> {
  options: ISelectOption<T>[]
  value: string
  onChange: (value: T, label: string) => void
  placeholder: string
  isDisabled?: boolean
}

const SearchableSelect = <T,>({ options, value, onChange, placeholder, isDisabled }: SearchableSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((option) => option.value === value)
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <Box position='relative' ref={wrapperRef}>
      <TextField
        variant='outline'
        size='md'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={selectedOption ? selectedOption.label : placeholder}
        onClick={() => !isDisabled && setIsOpen(true)}
        isDisabled={isDisabled}
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        backgroundColor={isDisabled ? 'gray.100' : 'white'}
      />

      {isOpen && !isDisabled && (
        <List
          position='absolute'
          top='100%'
          left={0}
          right={0}
          maxH='200px'
          overflowY='auto'
          backgroundColor='white'
          boxShadow='md'
          borderRadius='md'
          zIndex={10}
          mt={1}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <ListItem
                key={index}
                py={2}
                px={3}
                cursor='pointer'
                _hover={{ backgroundColor: 'gray.100' }}
                onClick={() => {
                  onChange(option.value, option.label)
                  setSearchTerm(option.label)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </ListItem>
            ))
          ) : (
            <ListItem py={2} px={3}>
              <Text color='gray.500'>Không có kết quả phù hợp</Text>
            </ListItem>
          )}
        </List>
      )}
    </Box>
  )
}

export default SearchableSelect
