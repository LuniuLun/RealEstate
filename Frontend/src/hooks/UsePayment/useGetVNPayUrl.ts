import { useMutation } from '@tanstack/react-query'
import { getVNPayUrl } from '@services/payment'
import useCustomToast from '@hooks/UseCustomToast'

const useVNPayMutation = () => {
  const { showToast } = useCustomToast()
  const paymentMutation = useMutation({
    mutationFn: getVNPayUrl,
    onSuccess: (response) => {
      console.log(response)

      if (response.status === 'success' && response.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl
      }
      showToast({
        status: response.status,
        title: response.message
      })
    },

    onError: (error) => {
      showToast({
        status: 'error',
        title: error.message
      })
    }
  })

  return { paymentMutation }
}

export default useVNPayMutation
