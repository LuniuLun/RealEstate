import { Checkbox, SimpleGrid } from '@chakra-ui/react'
import { ISelectOption } from '@components/CustomSelect'
import colors from '@styles/variables/colors'
import { CategoryName } from '@type/models'

interface ICheckboxGroupProps {
  options: ISelectOption<number>[]
  selectedValues: string[]
  filterType: string
  onValueChange: (value: string, filterType: CategoryName) => void
}

const CheckboxGroup = ({ options, selectedValues, filterType, onValueChange }: ICheckboxGroupProps) => (
  <SimpleGrid columns={2} spacing={2}>
    {options.map((option) => (
      <Checkbox
        key={option.value}
        isChecked={selectedValues.includes(String(option.value))}
        onChange={() => onValueChange(String(option.value), String(filterType) as CategoryName)}
        colorScheme={colors.brand.primary}
        size='sm'
        alignItems='unset'
        sx={{ '& span:first-of-type': { marginTop: '4px' } }}
      >
        {option.label}
      </Checkbox>
    ))}
  </SimpleGrid>
)

export default CheckboxGroup
