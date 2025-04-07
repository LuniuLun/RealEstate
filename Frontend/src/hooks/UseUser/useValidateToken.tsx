import MESSAGE from '@constants/message'
import { useCustomToast } from '@hooks'
import { authStore } from '@stores'

const useValidateToken = (): (() => boolean) => {
  const token = authStore((state) => state.token)
  const { showToast } = useCustomToast()

  return () => {
    if (!token || !token.user || !token.user.id) {
      showToast({ status: 'error', title: MESSAGE.common.REQUIRE_USER })
      return false
    }
    return true
  }
}

export default useValidateToken
