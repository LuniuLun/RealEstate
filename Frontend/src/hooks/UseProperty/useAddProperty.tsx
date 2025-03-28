import { TLandFormData } from '@components/LandForm'
import { THouseFormData } from '@components/HouseForm'
import { IProperty } from '@type/models'
import useCustomToast from '@hooks/UseCustomToast'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { IApiResponse } from '@type/apiResponse'
import { addProperty } from '@services/property'
import { useNavigate } from 'react-router-dom'
import { useConvertPropertyData } from './useConvertProperty'

interface UseAddPropertyReturn {
  addPropertyMutation: UseMutationResult<IApiResponse<IProperty>, Error, FormData>
  transformLandData: (formData: TLandFormData) => FormData | null
  transformHouseData: (formData: THouseFormData) => FormData | null
  isLoading: boolean
  isError: boolean
}

export const useAddProperty = (): UseAddPropertyReturn => {
  const navigate = useNavigate()
  const { showToast } = useCustomToast()
  const { convertHouseData, convertLandData } = useConvertPropertyData()

  const transformLandData = (formData: TLandFormData): FormData | null => {
    const landFormData = new FormData()
    const landData = convertLandData(formData)
    if (!landData) return null

    formData.images?.forEach((image) => {
      landFormData.append('images', image)
    })
    landFormData.append('propertyData', JSON.stringify(landData))

    return landFormData
  }

  const transformHouseData = (formData: THouseFormData): FormData | null => {
    const houseFormData = new FormData()
    const houseData = convertHouseData(formData)
    if (!houseData) return null

    formData.images?.forEach((image) => {
      houseFormData.append('images', image)
    })
    houseFormData.append('propertyData', JSON.stringify(houseData))

    return houseFormData
  }

  const addPropertyMutation = useMutation({
    mutationFn: addProperty,
    onSuccess: (response) => {
      if (response) {
        showToast({
          title: response.message,
          status: response.status
        })
        if (response.status === 'success') {
          navigate('/property-listings')
        }
      }
    },
    onError: (error) => {
      showToast({
        title: error.message,
        status: 'error'
      })
    }
  })

  return {
    isLoading: addPropertyMutation.isPending,
    isError: addPropertyMutation.isError,
    addPropertyMutation,
    transformLandData,
    transformHouseData
  }
}
