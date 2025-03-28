import React, { useState } from 'react'
import { Flex, FormControl, Heading, Stack } from '@chakra-ui/react'
import { CustomSelect, HouseForm, LandForm } from '@components'

const NewProperty = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const CATEGORY = [
    { value: 1, label: 'Đất' },
    { value: 2, label: 'Nhà' }
  ]

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(Number.parseInt(e.target.value))
  }

  const renderForm = () => {
    switch (selectedCategory) {
      case 1:
        return <LandForm />
      case 2:
        return <HouseForm />
      default:
        return null
    }
  }

  return (
    <Flex
      minH='80vh'
      maxW='900px'
      w='100%'
      mx='auto'
      p={6}
      borderWidth={1}
      boxShadow='md'
      bgColor='brand.white'
      gap={4}
      flexDirection='column'
    >
      <Stack gap={3}>
        <Heading variant='secondary'>Danh mục bất động sản</Heading>
        <FormControl>
          <CustomSelect
            options={CATEGORY}
            sx={{ width: '100%' }}
            borderRadius='md'
            border='full'
            borderColor='brand.sliver'
            placeholder='Chọn danh mục'
            onChange={handleCategoryChange}
          />
        </FormControl>
      </Stack>

      {selectedCategory && renderForm()}
    </Flex>
  )
}

export default NewProperty
