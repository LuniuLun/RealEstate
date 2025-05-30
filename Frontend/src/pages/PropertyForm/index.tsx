import React, { useState, useEffect } from 'react'
import { Flex, FormControl, Heading, Stack, Spinner, Text } from '@chakra-ui/react'
import { CustomSelect, HouseForm, LandForm } from '@components'
import { useParams } from 'react-router-dom'
import { useGetPropertyById } from '@hooks'

const PropertyForm = () => {
  const { id } = useParams<{ id: string }>()
  const { property, isLoading, isError } = useGetPropertyById(Number(id), 'personalProperties')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const CATEGORY = [
    { value: 1, label: 'Đất' },
    { value: 2, label: 'Nhà' }
  ]

  useEffect(() => {
    if (property) {
      setSelectedCategory(property.category.id)
    }
  }, [property])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(Number.parseInt(e.target.value))
  }

  const renderForm = () => {
    switch (selectedCategory) {
      case 1:
        return <LandForm initialData={property} />
      case 2:
        return <HouseForm initialData={property} />
      default:
        return null
    }
  }

  if (isLoading) {
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
        justifyContent='center'
        alignItems='center'
      >
        <Spinner size='xl' color='brand.primary' />
      </Flex>
    )
  }

  if (isError) {
    return (
      <Flex
        minH='40vh'
        maxW='900px'
        w='100%'
        mx='auto'
        p={6}
        borderWidth={1}
        boxShadow='md'
        bgColor='brand.white'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
      >
        <Text color='brand.red' fontSize='lg'>
          Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau.
        </Text>
      </Flex>
    )
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
            borderColor='brand.sliver'
            placeholder='Chọn danh mục'
            onChange={handleCategoryChange}
            value={selectedCategory || undefined}
            isDisabled={!!id}
          />
        </FormControl>
      </Stack>

      {selectedCategory && renderForm()}
    </Flex>
  )
}

export default PropertyForm
