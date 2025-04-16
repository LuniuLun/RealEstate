import { CustomModal, PropertyDetails } from '@components'
import { IProperty, PropertyStatus } from '@type/models'
import { memo, useMemo } from 'react'

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
  const isApproved = useMemo(() => property?.status === PropertyStatus.APPROVAL, [property?.status])
  const isCanceled = useMemo(() => property?.status === PropertyStatus.CANCELED, [property?.status])

  return (
    <CustomModal
      size={'lg'}
      isOpen={isModalOpen}
      onClose={onClose}
      title={title}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      titleSubmitButton={isApproved ? 'Đã duyệt' : 'Duyệt'}
      titleCancelButton={isCanceled ? 'Đã từ chối' : 'Từ chối'}
      handleClose={handleClose}
      isApproveDisabled={isApproved}
      isRejectDisabled={isCanceled}
    >
      <PropertyDetails property={property} isLoading={isLoading} />
    </CustomModal>
  )
}

export default memo(PropertyModal)
