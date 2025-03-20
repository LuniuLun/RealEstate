import { useState, useEffect } from 'react'
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

const CheckboxPopover = ({
  options,
  selectedValues,
  filterType,
  onValueChange,
  title,
  ...props
}: ICheckboxPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localSelectedValues, setLocalSelectedValues] = useState<string[]>(selectedValues)

  useEffect(() => {
    setLocalSelectedValues(selectedValues)
  }, [selectedValues])

  const getDisplayText = (): string => {
    if (localSelectedValues.length === 0) {
      return title || filterType
    }

    const selectedLabels = options
      .filter((option) => localSelectedValues.includes(String(option.value)))
      .map((option) => option.label)
      .join(', ')

    return selectedLabels || title || filterType
  }

  const handleLocalValueChange = (value: string) => {
    setLocalSelectedValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const handleApply = () => {
    localSelectedValues.forEach((value) => {
      const wasSelected = selectedValues.includes(value)
      const isSelected = localSelectedValues.includes(value)

      if (wasSelected !== isSelected) {
        onValueChange(value, filterType as CategoryName)
      }
    })

    selectedValues.forEach((value) => {
      if (!localSelectedValues.includes(value)) {
        onValueChange(value, filterType as CategoryName)
      }
    })

    setIsOpen(false)
  }

  return (
    <Popover placement='bottom' closeOnBlur={true} isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <Button variant='quaternary' textAlign='left' onClick={() => setIsOpen(!isOpen)} {...props}>
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
            selectedValues={localSelectedValues}
            filterType={filterType}
            onValueChange={handleLocalValueChange}
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
