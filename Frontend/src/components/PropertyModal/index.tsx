import { CustomModal, PropertyDetails } from '@components'
import { IProperty } from '@type/models'
import { memo } from 'react'

interface IPropertyModalProps {
  isModalOpen: boolean
  onClose: () => void
  title: string
  property: IProperty
  isSubmitting?: boolean
  isLoading?: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleClose: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const PropertyModal = ({
  isModalOpen,
  onClose,
  title,
  property,
  handleSubmit,
  handleClose,
  isSubmitting,
  isLoading
}: IPropertyModalProps) => {
  return (
    <CustomModal
      size={'lg'}
      isOpen={isModalOpen}
      onClose={onClose}
      title={title}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      titleSubmitButton='Duyệt'
      titleCancelButton='Từ chối'
      handleClose={handleClose}
    >
      <PropertyDetails property={property} isLoading={isLoading} />
    </CustomModal>
  )
}

export default memo(PropertyModal)
