import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Button, useDisclosure, Flex } from '@chakra-ui/react'
import { Unit } from '@type/models'
import { useState, useCallback, useEffect, useMemo } from 'react'
import RangeInput from '@components/RangeInput'

interface IRangeValues {
  min: number
  max: number
}

interface IRangeFilterProps {
  label: string
  unit: Unit
  values: IRangeValues
  onRangeChange: (values: IRangeValues) => void
}

const RangeFilter = ({ label, unit, values, onRangeChange }: IRangeFilterProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tempValues, setTempValues] = useState(values)

  useEffect(() => {
    setTempValues(values)
  }, [values])

  const handleChange = useCallback((key: keyof IRangeValues, value: string) => {
    setTempValues((prev) => ({ ...prev, [key]: Number(value) || 0 }))
  }, [])

  const handleApply = useCallback(() => {
    onRangeChange(tempValues)
    onClose()
  }, [onRangeChange, tempValues, onClose])

  const displayText = useMemo(() => {
    return tempValues.min || tempValues.max
      ? `${tempValues.min} - ${tempValues.max} ${unit === Unit.BILLION ? 'Tỷ' : 'm²'}`
      : label
  }, [tempValues, unit, label])

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom' closeOnBlur>
      <PopoverTrigger>
        <Button
          variant='quaternary'
          textAlign='left'
          sx={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          _hover={{ opacity: 0.9 }}
        >
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent bg='white' borderRadius='md' boxShadow='lg' width='250px'>
        <PopoverBody>
          <RangeInput
            min={String(tempValues.min ?? '')}
            max={String(tempValues.max ?? '')}
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
