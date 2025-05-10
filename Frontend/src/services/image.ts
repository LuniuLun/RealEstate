import { IApiResponse } from '@type/apiResponse'
import { NSFWImageValidationRequest, NSFWImageValidationResponse } from '@type/models/imageValidation'
import MESSAGE from '@constants/message'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_IMAGE_ENDPOINT}`

export const validateImages = async (
  newImages: NSFWImageValidationRequest
): Promise<IApiResponse<NSFWImageValidationResponse>> => {
  try {
    const formData = new FormData()
    newImages.image.forEach((file) => {
      formData.append('image', file)
    })

    const response = await fetch(`${baseUrl}/nsfw-check`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: 'error',
        message: data?.message || MESSAGE.image.VALIDATION_FAILED
      }
    }

    return {
      status: 'success',
      message: MESSAGE.image.VALIDATION_SUCCESS,
      data
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : MESSAGE.common.UNKNOWN_ERROR
    }
  }
}
