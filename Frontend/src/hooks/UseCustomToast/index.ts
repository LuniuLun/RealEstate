import { useToast, UseToastOptions } from '@chakra-ui/react'

const useCustomToast = () => {
  const toast = useToast()

  const showToast = ({ status, position = 'bottom', ...props }: UseToastOptions) => {
    toast({
      status,
      position,
      isClosable: true,
      ...props
    })
  }

  return { showToast }
}

export default useCustomToast
