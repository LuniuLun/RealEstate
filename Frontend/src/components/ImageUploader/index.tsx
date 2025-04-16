import { useState, useEffect } from 'react'
import { Box, Button, Flex, Grid, Heading, IconButton, Image, Input, Stack, useToast } from '@chakra-ui/react'
import { CloseIcon } from '@assets/icons'
import { REGEX } from '@constants/regex'
import { parseImagesString } from '@utils'

interface IImageUploaderProps {
  label: string
  onUpload?: (files: File[], remainingInitialImages: string) => void
  initialImages?: string
  isLoading?: boolean
}

const ImageUploader = ({ label, onUpload, initialImages = '', isLoading }: IImageUploaderProps) => {
  const toast = useToast()
  const parsedInitialImages = parseImagesString(initialImages)
  const [remainingInitialImages, setRemainingInitialImages] = useState<string[]>(parsedInitialImages)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

  useEffect(() => {
    if (onUpload) {
      const remainingImagesString = remainingInitialImages.join(',')
      onUpload(newFiles, remainingImagesString)
    }
  }, [newFiles, remainingInitialImages, onUpload])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = event.target.files
    if (!inputFiles) return

    const fileArray = Array.from(inputFiles)

    const invalidFiles = fileArray.filter((file) => !REGEX.imageExtensions.test(file.name))
    if (invalidFiles.length > 0) {
      toast({
        title: 'Only jpg, jpeg, png, gif, and webp files are allowed.',
        status: 'error'
      })
      return
    }

    const newPreviews = fileArray.map((file) => URL.createObjectURL(file))
    setNewImagePreviews((prev) => [...prev, ...newPreviews])
    setNewFiles((prev) => [...prev, ...fileArray])
  }

  const handleRemoveImage = (index: number) => {
    const initialImagesCount = remainingInitialImages.length

    if (index < initialImagesCount) {
      setRemainingInitialImages((prevImages) => prevImages.filter((_, i) => i !== index))
    } else {
      const newIndex = index - initialImagesCount
      setNewFiles((prevFiles) => prevFiles.filter((_, i) => i !== newIndex))
      setNewImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== newIndex))
    }
  }

  const allImages = [...remainingInitialImages, ...newImagePreviews]

  return (
    <Stack gap={5} p={4} border='1px dashed' borderColor='brand.primary' borderRadius='md'>
      <Input
        type='file'
        multiple
        accept='.jpg,.jpeg,.png,.gif,.webp'
        onChange={handleImageChange}
        display='none'
        id='file-upload'
      />
      <Flex justifyContent='space-between' alignItems='center'>
        <Heading variant='secondary'>{label}</Heading>
        <Button as='label' htmlFor='file-upload' variant='primary' cursor='pointer' isLoading={isLoading}>
          Chọn ảnh
        </Button>
      </Flex>
      <Grid templateColumns='repeat(auto-fill, minmax(100px, 1fr))' gap={4}>
        {allImages.map((src, index) => (
          <Box
            key={index}
            position='relative'
            border='2px dashed gray'
            borderRadius='md'
            width='100px'
            height='100px'
            overflow='hidden'
          >
            <Image src={src} alt={`Uploaded ${index}`} width='100%' height='100%' objectFit='cover' />
            <IconButton
              icon={<CloseIcon />}
              size='xs'
              position='absolute'
              top='2px'
              right='2px'
              onClick={() => handleRemoveImage(index)}
              aria-label='Remove'
              isDisabled={isLoading}
            />
          </Box>
        ))}
      </Grid>
      <Box color='gray.500' fontSize='sm'>
        {`${allImages.length}/10 images uploaded`}
      </Box>
    </Stack>
  )
}

export default ImageUploader
