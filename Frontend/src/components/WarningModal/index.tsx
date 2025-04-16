import { Box, Text } from '@chakra-ui/react'
import { CustomModal } from '@components'
import { memo } from 'react'

interface IWarningModalProps {
  isModalOpen: boolean
  onClose: () => void
  title: string
  message: string
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
}

const WarningModal = ({ isModalOpen, onClose, title, message, handleSubmit, isSubmitting }: IWarningModalProps) => {
  return (
    <CustomModal
      size={'lg'}
      isOpen={isModalOpen}
      onClose={onClose}
      title={title}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <Box textAlign='center' marginTop={4} px={10}>
        <Text fontSize='lg' color='brand.blackTextSecondary' fontWeight='Bold'>
          {message}
        </Text>
      </Box>
    </CustomModal>
  )
}

export default memo(WarningModal)
