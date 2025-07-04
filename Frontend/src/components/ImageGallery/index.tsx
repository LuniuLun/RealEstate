import { useState, useCallback, memo } from 'react'
import { Box, Flex, Image, IconButton, HStack, useBreakpointValue } from '@chakra-ui/react'
import { LeftIcon, RightIcon } from '@assets/icons'
import defaultImage from '@assets/images/default-image.jpg'

interface IImageGalleryProps {
  images: string[]
  alt?: string
}

const ImageGallery = ({ images, alt = 'Bất động sản' }: IImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const totalImages = images.length
  const thumbnailSize = useBreakpointValue({ base: '60px', md: '80px' })

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1))
  }, [totalImages])

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1))
  }, [totalImages])

  const handleThumbnailClick = useCallback((index: number) => {
    setCurrentImageIndex(index)
  }, [])

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultImage
  }, [])

  return (
    <Box position='relative' borderRadius='lg' overflow='hidden'>
      <Box position='relative' height={{ base: '250px', md: '400px' }} maxW='100%'>
        <Image
          src={images[currentImageIndex]}
          alt={alt}
          objectFit='contain'
          w='100%'
          h='100%'
          maxH='100%'
          maxW='100%'
          onError={handleImageError}
        />

        <Flex
          position='absolute'
          bottom='10px'
          left='50%'
          transform='translateX(-50%)'
          bg='blackAlpha.600'
          color='white'
          px='3'
          py='1'
          borderRadius='full'
          fontSize='sm'
        >
          {currentImageIndex + 1} / {totalImages}
        </Flex>

        <IconButton
          aria-label='Previous image'
          icon={<LeftIcon />}
          position='absolute'
          left='10px'
          top='50%'
          bg='brand.blackTextSecondary'
          borderRadius='full'
          size='sm'
          onClick={handlePrevImage}
        />

        <IconButton
          aria-label='Next image'
          icon={<RightIcon />}
          position='absolute'
          right='10px'
          top='50%'
          bg='brand.blackTextSecondary'
          borderRadius='full'
          size='sm'
          onClick={handleNextImage}
        />
      </Box>

      <HStack mt='3' spacing='2' overflowX='auto' py='2'>
        {images.map((image, index) => (
          <Box
            key={index}
            borderWidth={currentImageIndex === index ? '2px' : '0px'}
            borderColor='blue.500'
            borderRadius='md'
            overflow='hidden'
            cursor='pointer'
            flexShrink={0}
            onClick={() => handleThumbnailClick(index)}
          >
            <Image
              src={image}
              alt={`${alt} thumbnail ${index}`}
              boxSize={thumbnailSize}
              objectFit='cover'
              opacity={currentImageIndex === index ? 1 : 0.7}
              transition='opacity 0.2s'
              _hover={{ opacity: 1 }}
              onError={handleImageError}
            />
          </Box>
        ))}
      </HStack>
    </Box>
  )
}

export default memo(ImageGallery)
