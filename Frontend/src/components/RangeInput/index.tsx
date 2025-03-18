import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import { useState } from 'react'

export interface RangeValues {
  min: number | ''
  max: number | ''
}

export interface RangeInputsProps {
  type?: 'price' | 'area'
  defaultValues?: RangeValues
  onChange?: (values: RangeValues) => void
}

const RangeInputs: React.FC<RangeInputsProps> = ({
  type = 'price',
  defaultValues = { min: '', max: '' },
  onChange
}) => {
  const [values, setValues] = useState<RangeValues>(defaultValues)

  const isPrice = type === 'price'
  const title = isPrice ? 'Giá' : 'Diện tích'
  const unit = isPrice ? 'đ' : 'm²'

  const handleChange = (key: 'min' | 'max', value: string) => {
    const numericValue = value === '' ? '' : Number(value)
    const updatedValues = { ...values, [key]: numericValue }
    setValues(updatedValues)
    onChange?.(updatedValues)
  }

  return (
    <Box p={3}>
      <Text color='gray.700' fontWeight='medium' mb={2}>
        {title}
      </Text>
      <Flex gap={2} alignItems='center'>
        <Input
          placeholder={`Min ${unit}`}
          type='number'
          value={values.min}
          onChange={(e) => handleChange('min', e.target.value)}
          size='sm'
        />
        <Text>-</Text>
        <Input
          placeholder={`Max ${unit}`}
          type='number'
          value={values.max}
          onChange={(e) => handleChange('max', e.target.value)}
          size='sm'
        />
      </Flex>
      <Flex justifyContent='flex-end' mt={2}>
        <Button size='sm' colorScheme='blue'>
          Áp dụng
        </Button>
      </Flex>
    </Box>
  )
}

export default RangeInputs
