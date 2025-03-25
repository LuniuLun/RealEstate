import { Flex, Input, Text } from '@chakra-ui/react'
import { Unit } from '@type/models'
import { REGEX } from '@constants/regex'

interface IRangeInputProps {
  min: string
  max: string
  unit: Unit
  onChange: (key: 'min' | 'max', value: string) => void
}

const RangeInput = ({ min, max, unit, onChange }: IRangeInputProps) => {
  const handleInputChange = (key: 'min' | 'max') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (REGEX.positiveNumber.test(value)) {
      onChange(key, value)
    }
  }

  return (
    <Flex gap={2} alignItems='center'>
      <Input placeholder='Thấp nhất' value={min} onChange={handleInputChange('min')} size='sm' textAlign='center' />
      <Text>-</Text>
      <Input placeholder='Cao nhất' value={max} onChange={handleInputChange('max')} size='sm' textAlign='center' />
      <Text>{unit === Unit.BILLION ? 'Tỷ' : 'm²'}</Text>
    </Flex>
  )
}

export default RangeInput
