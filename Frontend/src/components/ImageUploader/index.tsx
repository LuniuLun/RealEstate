import { useState, useEffect } from 'react'
import { Box, Button, Flex, Grid, Heading, IconButton, Image, Input, Stack, useToast } from '@chakra-ui/react'
import { CloseIcon } from '@assets/icons'
import { REGEX } from '@constants/regex'
import { parseImagesString } from '@utils'
import { useImageValidation } from '@hooks'

interface IImageUploaderProps {
  label: string
  initialImages?: string
  isLoading?: boolean
  maxImages?: number
  onUpload?: (files: File[], remainingInitialImages: string) => void
  onValidationChange?: (isValid: boolean) => void
}

const ImageUploader = ({
  label,
  initialImages = '',
  isLoading = false,
  maxImages = 10,
  onUpload,
  onValidationChange
}: IImageUploaderProps) => {
  const toast = useToast()
  const parsedInitialImages = parseImagesString(initialImages)
  const [remainingInitialImages, setRemainingInitialImages] = useState<string[]>(parsedInitialImages)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [invalidImageIndexes, setInvalidImageIndexes] = useState<number[]>([])
  const { validateImages, isValidating, resetStatus } = useImageValidation()
  const isProcessing = isLoading || isValidating

  useEffect(() => {
    if (onUpload) {
      const remainingImagesString = remainingInitialImages.join(',')
      onUpload(newFiles, remainingImagesString)
    }
  }, [newFiles, remainingInitialImages, onUpload])

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url))
      resetStatus()
    }
  }, [newImagePreviews, resetStatus])

  useEffect(() => {
    if (onValidationChange) {
      const hasInvalidImages = invalidImageIndexes.length > 0
      onValidationChange(!hasInvalidImages)
    }
  }, [invalidImageIndexes, onValidationChange])

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = event.target.files
    if (!inputFiles) return

    const fileArray = Array.from(inputFiles)

    const invalidFiles = fileArray.filter((file) => !REGEX.imageExtensions.test(file.name))
    if (invalidFiles.length > 0) {
      toast({
        title: 'Chỉ tải lên các tệp ảnh jpg, jpeg, png, gif và webp',
        status: 'error'
      })
      return
    }

    const totalImagesAfterAdd = remainingInitialImages.length + newFiles.length + fileArray.length
    if (totalImagesAfterAdd > maxImages) {
      toast({
        title: `Không được tải quá ${maxImages} ảnh.`,
        status: 'error'
      })
      return
    }

    const newPreviews = fileArray.map((file) => URL.createObjectURL(file))
    try {
      const validationResult = await validateImages(fileArray)
      if (!validationResult.isValid) {
        const currentFileCount = newFiles.length
        const newInvalidIndexes = validationResult.invalidFiles.map((invalidFile) => {
          return currentFileCount + fileArray.findIndex((file) => file === invalidFile)
        })

        setInvalidImageIndexes((prev) => [...prev, ...newInvalidIndexes])

        toast({
          title: validationResult.message,
          status: 'warning',
          duration: 5000
        })
      }
    } catch (error) {
      toast({
        title: 'Không thể xác thực ảnh',
        description: error instanceof Error ? error.message : 'Vui lòng thử lại',
        status: 'error'
      })
      return
    }

    setNewImagePreviews((prev) => [...prev, ...newPreviews])
    setNewFiles((prev) => [...prev, ...fileArray])
  }

  const handleRemoveImage = (index: number) => {
    const initialImagesCount = remainingInitialImages.length

    if (index < initialImagesCount) {
      setRemainingInitialImages((prevImages) => prevImages.filter((_, i) => i !== index))
    } else {
      const newIndex = index - initialImagesCount

      setInvalidImageIndexes((prev) =>
        prev
          .filter((invalidIndex) => invalidIndex !== newIndex)
          .map((invalidIndex) => (invalidIndex > newIndex ? invalidIndex - 1 : invalidIndex))
      )

      setNewFiles((prevFiles) => prevFiles.filter((_, i) => i !== newIndex))
      setNewImagePreviews((prevPreviews) => {
        // Giải phóng URL object để tránh rò rỉ bộ nhớ
        URL.revokeObjectURL(prevPreviews[newIndex])
        return prevPreviews.filter((_, i) => i !== newIndex)
      })
    }
  }

  const allImages = [...remainingInitialImages, ...newImagePreviews]

  const isImageInvalid = (index: number) => {
    const initialImagesCount = remainingInitialImages.length
    if (index < initialImagesCount) return false

    const newIndex = index - initialImagesCount
    return invalidImageIndexes.includes(newIndex)
  }

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
        <Button
          as='label'
          htmlFor='file-upload'
          variant='primary'
          cursor='pointer'
          isLoading={isProcessing}
          isDisabled={allImages.length >= maxImages}
        >
          Chọn ảnh
        </Button>
      </Flex>

      <Grid templateColumns='repeat(auto-fill, minmax(100px, 1fr))' gap={4}>
        {allImages.map((src, index) => (
          <Box
            key={index}
            position='relative'
            border={isImageInvalid(index) ? '2px solid red' : '2px dashed gray'}
            borderRadius='md'
            width='100px'
            height='100px'
            overflow='hidden'
          >
            <Image
              src={src}
              alt={`Uploaded ${index}`}
              width='100%'
              height='100%'
              objectFit='cover'
              opacity={isImageInvalid(index) ? 0.7 : 1}
            />

            <IconButton
              icon={<CloseIcon />}
              size='xs'
              position='absolute'
              top='2px'
              right='2px'
              onClick={() => handleRemoveImage(index)}
              aria-label='Remove'
              isDisabled={isProcessing}
            />
          </Box>
        ))}
      </Grid>

      <Flex justifyContent='space-between' alignItems='center'>
        <Box color='gray.500' fontSize='sm'>
          {`${allImages.length}/${maxImages} images uploaded`}
        </Box>
      </Flex>
    </Stack>
  )
}

export default ImageUploader
