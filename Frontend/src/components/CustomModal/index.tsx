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
  isSubmitting?: boolean
}

const CustomModal = ({ isOpen, onClose, handleSubmit, title, isSubmitting, children, ...props }: ICustomModalProps) => {
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
        <ModalHeader borderBottom={`1px solid $'brand.secondary'`}>
          <Heading variant='secondary'>{title}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody px='unset'>
          <form onSubmit={handleSubmit}>
            {children}
            <ModalFooter gap={4} marginTop={10}>
              <Button variant='primary' type='submit' aria-label='submit' isLoading={isSubmitting}>
                Submit
              </Button>
              <Button variant='secondary' onClick={onClose} aria-label='cancel' disabled={isSubmitting}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default memo(CustomModal)
