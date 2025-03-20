import { Flex, Input, Text } from '@chakra-ui/react'
import { Unit } from '@type/models'

interface IRangeInputProps {
  min: string
  max: string
  unit: Unit
  onChange: (key: 'min' | 'max', value: string) => void
}

const RangeInput = ({ min, max, unit, onChange }: IRangeInputProps) => {
  return (
    <Flex gap={2} alignItems='center'>
      <Input
        placeholder={`Min ${unit === Unit.BILLION ? 'Tỷ' : 'm²'}`}
        value={min}
        onChange={(e) => onChange('min', e.target.value)}
        size='sm'
      />
      <Text>-</Text>
      <Input
        placeholder={`Max ${unit === Unit.BILLION ? 'Tỷ' : 'm²'}`}
        value={max}
        onChange={(e) => onChange('max', e.target.value)}
        size='sm'
      />
      <Text>{unit === Unit.BILLION ? 'Tỷ' : 'm²'}</Text>
    </Flex>
  )
}

export default RangeInput
