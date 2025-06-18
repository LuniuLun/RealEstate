import { IProperty } from '@type/models'
import useCustomToast from '@hooks/UseCustomToast'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { IApiResponse } from '@type/apiResponse'
import { updateProperty } from '@services/property'
import { useNavigate } from 'react-router-dom'

interface UseUpdatePropertyReturn {
  updatePropertyMutation: UseMutationResult<IApiResponse<IProperty>, Error, { id: number; newProperty: FormData }>
  isLoading: boolean
  isError: boolean
}

const useUpdateProperty = (): UseUpdatePropertyReturn => {
  const navigate = useNavigate()
  const { showToast } = useCustomToast()

  const updatePropertyMutation = useMutation({
    mutationFn: ({ id, newProperty }: { id: number; newProperty: FormData }) => updateProperty(id, newProperty),
    onSuccess: (response) => {
      if (response) {
        showToast({
          title: response.message,
          status: response.status
        })
        if (response.status === 'success' && response.data) {
          navigate(`/property-detail/${response.data.id}`)
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
    isLoading: updatePropertyMutation.isPending,
    isError: updatePropertyMutation.isError,
    updatePropertyMutation
  }
}

export default useUpdateProperty
