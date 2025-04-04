import {
  ModalProps,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Heading,
  Modal
} from '@chakra-ui/react'
import { memo } from 'react'

interface ICustomModalProps extends ModalProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  title: string
  titleSubmitButton?: string
  titleCancelButton?: string
  isSubmitting?: boolean
  isApproveDisabled?: boolean
  isRejectDisabled?: boolean
  handleClose?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const CustomModal = ({
  isOpen,
  onClose,
  handleSubmit,
  title,
  titleSubmitButton,
  titleCancelButton,
  isSubmitting,
  isApproveDisabled,
  isRejectDisabled,
  handleClose,
  children,
  ...props
}: ICustomModalProps) => {
  const handleCloseModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (handleClose) {
      e.preventDefault()
      handleClose(e)
      return
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset='slideInBottom'
      scrollBehavior='inside'
      isCentered
      closeOnOverlayClick={!isSubmitting}
      {...props}
    >
      <ModalOverlay />
      <ModalContent bgColor='brand.white'>
        <ModalHeader borderBottom={`1px solid ${'brand.secondary'}`}>
          <Heading variant='secondary'>{title}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody px='unset'>
          <form onSubmit={handleSubmit}>
            {children}
            <ModalFooter gap={4} marginTop={10}>
              <Button
                variant='primary'
                type='submit'
                aria-label='submit'
                isLoading={isSubmitting}
                isDisabled={isApproveDisabled}
              >
                {titleSubmitButton || 'Đồng ý'}
              </Button>
              <Button
                variant='secondary'
                onClick={handleCloseModal}
                aria-label='cancel'
                isDisabled={isSubmitting || isRejectDisabled}
              >
                {titleCancelButton || 'Đóng'}
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default memo(CustomModal)
