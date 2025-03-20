import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Input,
  Flex,
  Text,
  Button,
  useDisclosure
} from '@chakra-ui/react'
import { Unit } from '@type/models'
import { useState } from 'react'

interface RangeValues {
  min: number
  max: number
}

interface RangeFilterProps {
  label: string
  unit: Unit
  values: RangeValues
  onRangeChange: (values: RangeValues) => void
}

const RangeFilter = ({ label, unit, values, onRangeChange }: RangeFilterProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tempValues, setTempValues] = useState(values)

  const handleChange = (key: 'min' | 'max', value: string) => {
    setTempValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onRangeChange(tempValues)
    onClose()
  }

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom' closeOnBlur>
      <PopoverTrigger>
        <Button
          variant='quaternary'
          textAlign='left'
          sx={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          _hover={{ opacity: 0.9 }}
        >
          {values.min || values.max ? `${values.min} - ${values.max} ${unit === Unit.BILLION ? 'Tỷ' : 'm²'}` : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent bg='white' borderRadius='md' boxShadow='lg' width='250px'>
        <PopoverBody>
          <Flex gap={2} alignItems='center'>
            <Input
              placeholder={`Min ${unit === Unit.BILLION ? 'Tỷ' : 'm²'}`}
              value={tempValues.min || ''}
              onChange={(e) => handleChange('min', e.target.value)}
              size='sm'
            />
            <Text>-</Text>
            <Input
              placeholder={`Max ${unit === Unit.BILLION ? 'Tỷ' : 'm²'}`}
              value={tempValues.max || ''}
              onChange={(e) => handleChange('max', e.target.value)}
              size='sm'
            />
            <Text>{unit === Unit.BILLION ? 'Tỷ' : 'm²'}</Text>
          </Flex>
          <Flex justifyContent='flex-end' mt={2}>
            <Button size='sm' colorScheme='blue' onClick={handleApply}>
              Áp dụng
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default RangeFilter
