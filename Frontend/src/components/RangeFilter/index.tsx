import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Button, useDisclosure, Flex } from '@chakra-ui/react'
import RangeInput from '@components/RangeInput'
import { Unit } from '@type/models'
import { useState } from 'react'

interface IRangeValues {
  min: number
  max: number
}

interface IRangeIFilterProps {
  label: string
  unit: Unit
  values: IRangeValues
  onRangeChange: (values: IRangeValues) => void
}

const RangeFilter = ({ label, unit, values, onRangeChange }: IRangeIFilterProps) => {
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
          <RangeInput
            min={tempValues.min.toString()}
            max={tempValues.max.toString()}
            unit={unit}
            onChange={handleChange}
          />
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
