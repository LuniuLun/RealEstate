import { Flex, FormControl, Stack } from '@chakra-ui/react'
import { CustomModal, CustomSelect, TextField } from '@components'
import { ROLE_OPTION } from '@constants/option'
import { IUser } from '@type/models'
import { memo, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

interface IUserFormData extends Omit<IUser, 'id'> {
  confirmPassword?: string
}

interface IUserModalProps {
  selectedUser?: IUser | null
  isModalOpen: boolean
  onClose: () => void
  handleSubmit: (data: IUser) => void
  isSubmitting?: boolean
}

const UserModal = ({ selectedUser, isModalOpen, onClose, handleSubmit, isSubmitting }: IUserModalProps) => {
  const {
    register,
    handleSubmit: handleRegisterSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<IUserFormData>({
    defaultValues: {
      fullName: selectedUser?.fullName || '',
      email: selectedUser?.email || '',
      phone: selectedUser?.phone || '',
      role: selectedUser?.role
    }
  })

  useEffect(() => {
    if (selectedUser) {
      setValue('fullName', selectedUser.fullName)
      setValue('email', selectedUser.email)
      setValue('phone', selectedUser.phone)
      setValue('role', selectedUser.role)
    } else reset()
  }, [selectedUser])

  const handleFormSubmit: SubmitHandler<IUserFormData> = async (data) => {
    const userData = { ...data }
    delete userData.confirmPassword
    const user: IUser = {
      ...userData,
      id: selectedUser?.id || -1,
      createdAt: selectedUser?.createdAt || new Date().toISOString()
    }
    handleSubmit(user)
  }

  return (
    <CustomModal
      size={'2xl'}
      isOpen={isModalOpen}
      onClose={onClose}
      title={selectedUser?.id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
      handleSubmit={handleRegisterSubmit(handleFormSubmit)}
      isSubmitting={isSubmitting}
    >
      <Stack gap={5} px={4}>
        <Flex gap={4} marginTop={4} flexDirection={{ base: 'column', md: 'row' }}>
          <FormControl>
            <TextField
              placeholder='Họ và tên *'
              {...register('fullName', {
                required: 'Vui lòng nhập họ và tên',
                minLength: { value: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' }
              })}
              errorMessage={errors.fullName?.message}
              variant='flushed'
              borderBottom='1px solid'
              borderColor='brand.sliver'
              aria-label='fullName'
              isDisabled={isSubmitting}
            />
          </FormControl>
          <FormControl>
            <TextField
              placeholder='Email *'
              {...register('email', {
                required: 'Vui lòng nhập email',
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: 'Email không hợp lệ'
                }
              })}
              errorMessage={errors.email?.message}
              variant='flushed'
              borderBottom='1px solid'
              borderColor='brand.sliver'
              aria-label='email'
              isDisabled={isSubmitting}
            />
          </FormControl>
        </Flex>
        <Flex gap={4} flexDirection={{ base: 'column', md: 'row' }}>
          <FormControl>
            <TextField
              placeholder='Số điện thoại *'
              {...register('phone', {
                required: 'Vui lòng nhập số điện thoại',
                minLength: { value: 9, message: 'Số điện thoại phải có ít nhất 9 chữ số' },
                maxLength: { value: 11, message: 'Số điện thoại không được quá 11 chữ số' }
              })}
              type='number'
              errorMessage={errors.phone?.message}
              variant='flushed'
              borderBottom='1px solid'
              borderColor='brand.sliver'
              aria-label='phone'
              isDisabled={isSubmitting}
            />
          </FormControl>
          <CustomSelect
            placeholder='Chọn vai trò'
            variant='flushed'
            options={ROLE_OPTION}
            value={selectedUser?.role.name}
            borderRadius='unset'
            maxW='100%'
            h='34px'
            fontWeight='light'
            aria-label='role'
            isDisabled={isSubmitting}
            {...register('role', {
              required: 'Vui lòng chọn vai trò'
            })}
            sx={{ w: '100%', _hover: { bgColor: 'transparent' } }}
          />
        </Flex>
      </Stack>
    </CustomModal>
  )
}

export default memo(UserModal)
