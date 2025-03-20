import { useState } from 'react'
import { Button, Popover, PopoverTrigger, PopoverContent, PopoverBody, Text, Flex } from '@chakra-ui/react'
import CheckboxGroup from '@components/CheckboxGroup'
import { ISelectOption } from '@components/CustomSelect'
import { CategoryName } from '@type/models'

interface ICheckboxPopoverProps {
  options: ISelectOption<number>[]
  selectedValues: string[]
  filterType: string
  onValueChange: (value: string, filterType: CategoryName) => void
  title?: string
}

const CheckboxPopover = ({ options, selectedValues, filterType, onValueChange, title }: ICheckboxPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const getDisplayText = (): string => {
    if (selectedValues.length === 0) {
      return title || filterType
    }
    return (
      options
        .filter((option) => selectedValues.includes(String(option.value)))
        .map((option) => option.label)
        .join(', ') ||
      title ||
      filterType
    )
  }

  const handleApply = () => {
    setIsOpen(false)
  }

  return (
    <Popover placement='bottom' closeOnBlur={true} isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <Button variant='quaternary' textAlign='left' onClick={() => setIsOpen(!isOpen)}>
          {getDisplayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent bg='white' borderRadius='md' boxShadow='lg' p={3} width='300px'>
        <PopoverBody>
          <Text fontWeight='medium' mb={3}>
            {title || filterType}
          </Text>
          <CheckboxGroup
            options={options}
            selectedValues={selectedValues}
            filterType={filterType}
            onValueChange={onValueChange}
          />
          <Flex justifyContent='flex-end' mt={3}>
            <Button size='sm' colorScheme='blue' onClick={handleApply}>
              Áp dụng
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default CheckboxPopover
