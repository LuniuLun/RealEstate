import { LandFormData } from '@components/LandForm'
import { HouseFormData } from '@components/HouseForm'
import { authStore } from '@stores'
import { IProperty, TPostProperty } from '@type/models'
import useCustomToast from '@hooks/UseCustomToast'
import MESSAGE from '@constants/message'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { IApiResponse } from '@type/apiResponse'
import { addProperty } from '@services/property'
import { useNavigate } from 'react-router-dom'

interface UseAddPropertyReturn {
  addPropertyMutation: UseMutationResult<IApiResponse<IProperty>, Error, FormData>
  tranformLandData: (formData: LandFormData) => FormData
  tranformHouseData: (formData: HouseFormData) => FormData
  isLoading: boolean
  isError: boolean
}

export const useAddProperty = (): UseAddPropertyReturn => {
  const { token } = authStore()
  const { showToast } = useCustomToast()
  const navigate = useNavigate()

  const tranformLandData = (formData: LandFormData): FormData => {
    const landFormData = new FormData()
    if (!token || !token.user) {
      showToast({ status: 'error', title: MESSAGE.common.REQUIRE_USER })
      return landFormData
    }

    const landData: TPostProperty = {
      user: token?.user,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      region: formData.region,
      districtName: formData.districtName,
      wardName: formData.wardName,
      streetName: formData.streetName,
      longitude: 0,
      latitude: 0,
      propertyLegalDocument: {
        id: Number(formData.propertyLegalDocument),
        name: ''
      },
      direction: Number(formData.direction),
      area: Number(formData.area),
      length: Number(formData.length),
      width: Number(formData.width),
      price: Number(formData.price),
      land: {
        landType: {
          id: formData.landType,
          name: ''
        },
        landCharacteristicMappings:
          formData.landCharacteristics?.map((id) => ({
            id: 0,
            landCharacteristic: {
              id: id,
              name: ''
            }
          })) || []
      }
    }

    formData.images?.forEach((image) => {
      landFormData.append('images', image)
    })
    landFormData.append('propertyData', JSON.stringify(landData))

    return landFormData
  }

  const tranformHouseData = (formData: HouseFormData): FormData => {
    const houseFormData = new FormData()
    if (!token || !token.user) {
      showToast({ status: 'error', title: MESSAGE.common.REQUIRE_USER })
      return houseFormData
    }

    const houseData: TPostProperty = {
      user: token?.user,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      region: formData.region,
      districtName: formData.districtName,
      wardName: formData.wardName,
      streetName: formData.streetName,
      longitude: 0,
      latitude: 0,
      area: Number(formData.area),
      length: Number(formData.length),
      width: Number(formData.width),
      price: Number(formData.price),
      direction: Number(formData.direction),
      propertyLegalDocument: {
        id: Number(formData.propertyLegalDocument),
        name: ''
      },
      house: {
        houseType: {
          id: formData.houseType,
          name: ''
        },
        furnishedStatus: {
          id: formData.furnishedStatus,
          name: ''
        },
        bedrooms: Number(formData.bedrooms),
        toilets: Number(formData.toilets),
        floors: Number(formData.floors),
        houseCharacteristicMappings:
          formData.houseCharacteristics?.map((id) => ({
            id: 0,
            houseCharacteristic: {
              id: id,
              name: ''
            }
          })) || []
      }
    }

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
    tranformLandData,
    tranformHouseData
  }
}
