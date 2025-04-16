import { Checkbox, SimpleGrid } from '@chakra-ui/react'
import { ISelectOption } from '@components/CustomSelect'
import { CategoryName } from '@type/models'

interface ICheckboxGroupProps {
  options: ISelectOption<number>[]
  selectedValues: string[]
  filterType: string
  onValueChange: (value: string, filterType: string | CategoryName) => void
  isLoading?: boolean
}

const CheckboxGroup = ({ options, selectedValues, filterType, onValueChange, isLoading }: ICheckboxGroupProps) => {
  return (
    <SimpleGrid columns={2} spacing={2}>
      {options.map((option) => {
        const optionValueStr = String(option.value)
        const isChecked = selectedValues.includes(optionValueStr)
        return (
          <Checkbox
            key={optionValueStr}
            isDisabled={isLoading}
            isChecked={isChecked}
            onChange={() => onValueChange(optionValueStr, filterType)}
            colorScheme='brand.primary'
            size='sm'
            alignItems='unset'
            sx={{ '& span:first-of-type': { marginTop: '4px' } }}
          >
            {option.label}
          </Checkbox>
        )
      })}
    </SimpleGrid>
  )
}

export default CheckboxGroup
