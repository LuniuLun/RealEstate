import { useMutation } from '@tanstack/react-query'
import { NSFWImageValidationResponse } from '@type/models/imageValidation'
import { validateImages } from '@services/image'
import MESSAGE from '@constants/message'
import useCustomToast from '@hooks/UseCustomToast'

interface ValidationResult {
  isValid: boolean
  validFiles: File[]
  invalidFiles: File[]
  message: string
  results?: NSFWImageValidationResponse
}

interface UseImageValidationReturn {
  validateImages: (files: File[]) => Promise<ValidationResult>
  isValidating: boolean
  validationResults: NSFWImageValidationResponse | null
  resetStatus: () => void
}

export const useImageValidation = (): UseImageValidationReturn => {
  const { showToast } = useCustomToast()

  const validateImagesMutation = useMutation({
    mutationFn: async (files: File[]): Promise<ValidationResult> => {
      if (!files.length) {
        return {
          isValid: true,
          validFiles: [],
          invalidFiles: [],
          message: 'No files to validate'
        }
      }

      const response = await validateImages({ image: files })

      if (response.status === 'error') {
        return {
          isValid: false,
          validFiles: [],
          invalidFiles: files,
          message: response.message
        }
      }

      const results = response.data as NSFWImageValidationResponse

      if (!results || !Array.isArray(results)) {
        return {
          isValid: false,
          validFiles: [],
          invalidFiles: files,
          message: MESSAGE.image.VALIDATION_FAILED,
          results
        }
      }

      const { validFiles, invalidFiles } = files.reduce(
        (acc, file, index) => {
          if (index < results.length && results[index].safe) {
            acc.validFiles.push(file)
          } else {
            acc.invalidFiles.push(file)
          }
          return acc
        },
        { validFiles: [] as File[], invalidFiles: [] as File[] }
      )

      return {
        isValid: invalidFiles.length === 0,
        validFiles,
        invalidFiles,
        message: invalidFiles.length > 0 ? MESSAGE.image.NSFW_CONTENT_DETECTED : '',
        results
      }
    },
    onError: (error: Error) => {
      showToast({
        status: 'error',
        title: MESSAGE.image.VALIDATION_FAILED,
        description: error.message
      })
    }
  })

  const validateUploadedImages = async (files: File[]): Promise<ValidationResult> => {
    try {
      return await validateImagesMutation.mutateAsync(files)
    } catch (error) {
      return {
        isValid: false,
        validFiles: [],
        invalidFiles: files,
        message: error instanceof Error ? error.message : MESSAGE.image.VALIDATION_FAILED
      }
    }
  }

  return {
    validateImages: validateUploadedImages,
    isValidating: validateImagesMutation.isPending,
    validationResults: validateImagesMutation.data?.results || null,
    resetStatus: validateImagesMutation.reset
  }
}

export default useImageValidation
