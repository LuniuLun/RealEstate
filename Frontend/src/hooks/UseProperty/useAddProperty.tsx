import { LandFormData } from '@components/LandForm'
import { HouseFormData } from '@components/HouseForm'
import { authStore } from '@stores'
import { IProperty } from '@type/models'

interface UseAddPropertyReturn {
  addProperty: (formData: FormData) => Promise<void>
  tranformLandData: (formData: LandFormData) => FormData
  tranformHouseData: (formData: HouseFormData) => FormData
  isLoading: boolean
  isError: boolean
}

export const useAddProperty = (): UseAddPropertyReturn => {
  const { token } = authStore()

  const tranformLandData = (formData: LandFormData): FormData => {
    const landFormData = new FormData()

    const landData: IProperty = {
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
        id: Number(formData.propertyLegalDocument)
      },
      direction: Number(formData.direction),
      area: Number(formData.area),
      length: Number(formData.length),
      width: Number(formData.width),
      price: Number(formData.price),
      house: null,
      land: {
        landType: {
          id: formData.landType
        },
        landCharacteristicMappings:
          formData.landCharacteristics?.map((id) => ({
            landCharacteristic: { id }
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

    const houseData: IProperty = {
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
      land: null,
      house: {
        houseType: {
          id: formData.houseType
        },
        furnishedStatus: {
          id: formData.furnishedStatus
        },
        bedrooms: Number(formData.bedrooms),
        toilets: Number(formData.toilets),
        floors: Number(formData.floors),
        direction: Number(formData.direction),
        houseCharacteristicMappings:
          formData.houseCharacteristics?.map((id) => ({
            houseCharacteristic: { id }
          })) || []
      }
    }

    formData.images?.forEach((image) => {
      houseFormData.append('images', image)
    })

    houseFormData.append('propertyData', JSON.stringify(houseData))

    return houseFormData
  }

  const addProperty = async (formData: FormData) => {
    console.log(formData)
  }

  return {
    addProperty,
    tranformLandData,
    tranformHouseData
  }
}
