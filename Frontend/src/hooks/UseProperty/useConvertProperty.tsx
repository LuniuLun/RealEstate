import { TLandFormData } from '@components/LandForm'
import { THouseFormData } from '@components/HouseForm'
import { authStore } from '@stores'
import { IUser, TPostProperty } from '@type/models'
import useValidateToken from '@hooks/UseUser/useValidateToken'

interface UseConvertPropertyDataReturn {
  convertLandData: (formData: TLandFormData) => TPostProperty | null
  convertHouseData: (formData: THouseFormData) => TPostProperty | null
}

export const useConvertPropertyData = (): UseConvertPropertyDataReturn => {
  const { token } = authStore()
  const validateToken = useValidateToken()
  const convertLandData = (formData: TLandFormData): TPostProperty | null => {
    if (!validateToken()) return null

    return {
      user: token?.user as IUser,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      region: formData.region,
      districtName: formData.districtName,
      wardName: formData.wardName,
      streetName: formData.streetName,
      longitude: formData.longitude,
      latitude: formData.longitude,
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
  }

  const convertHouseData = (formData: THouseFormData): TPostProperty | null => {
    if (!validateToken()) return null

    return {
      user: token?.user as IUser,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      region: formData.region,
      districtName: formData.districtName,
      wardName: formData.wardName,
      streetName: formData.streetName,
      longitude: formData.longitude,
      latitude: formData.longitude,
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
  }

  return { convertLandData, convertHouseData }
}
