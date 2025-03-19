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

interface RangeValues {
  min: number
  max: number
}

interface RangeFilterProps {
  label: string
  unit: string
  values: RangeValues
  onRangeChange: (values: RangeValues) => void
}

const RangeFilter = ({ label, unit, values, onRangeChange }: RangeFilterProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom' closeOnBlur>
      <PopoverTrigger>
        <Button
          variant='quaternary'
          textAlign='left'
          sx={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          _hover={{ opacity: 0.9 }}
        >
          {values.min || values.max ? `${values.min || '0'} - ${values.max || 'Max'} ${unit}` : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent bg='white' borderRadius='md' boxShadow='lg' width='250px'>
        <PopoverBody>
          <Flex gap={2} alignItems='center'>
            <Input
              placeholder={`Min ${unit}`}
              value={values.min}
              onChange={(e) => onRangeChange({ ...values, min: Number(e.target.value) })}
              size='sm'
            />
            <Text>-</Text>
            <Input
              placeholder={`Max ${unit}`}
              value={values.max}
              onChange={(e) => onRangeChange({ ...values, max: Number(e.target.value) })}
              size='sm'
            />
          </Flex>
          <Flex justifyContent='flex-end' mt={2}>
            <Button size='sm' colorScheme='blue' onClick={onClose}>
              Áp dụng
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default RangeFilter
