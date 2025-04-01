import { Button, Flex, FormControl, FormLabel, Heading, Stack, Text } from '@chakra-ui/react'
import { TextField } from '@components'
import { useCustomToast, useUpdateProfile, useGetCurrentUser } from '@hooks'
import { useForm } from 'react-hook-form'
import { IUser } from '@type/models'
import { useEffect, useState } from 'react'
import { REGEX } from '@constants/regex'

const Profile = () => {
  const { data, isLoading, isError } = useGetCurrentUser()
  const { showToast } = useCustomToast()
  const [defaultUser, setDefaultUser] = useState<IUser | undefined>()
  const editProfileMutation = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors }
  } = useForm<IUser>()

  useEffect(() => {
    if (!isError && data) {
      reset(data)
      setDefaultUser(data)
    }
  }, [data])

  useEffect(() => {
    if (!isError && data) {
      reset(data)
      setDefaultUser(data)
    }
  }, [data])

  const onSubmit = async (formData: IUser) => {
    if (
      defaultUser?.fullName === formData.fullName &&
      defaultUser.phone === formData.phone &&
      defaultUser.email === formData.email
    ) {
      showToast({ status: 'warning', title: 'Thông tin không thay đổi' })
      return
    }

    editProfileMutation.mutate(formData)
  }

  if ((isError || !data) && !isLoading) {
    return (
      <Heading variant='secondary' color='brand.red' p={10}>
        Không thể tải thông tin người dùng
      </Heading>
    )
  }

  return (
    <Stack gap={6} mt={10} pr={10} as='form' onSubmit={handleSubmit(onSubmit)}>
      <Flex gap={4}>
        <FormControl isInvalid={!!errors.fullName}>
          <FormLabel htmlFor='fullName' fontSize='sm' fontWeight='medium'>
            Họ và tên
          </FormLabel>
          <TextField
            isLoaded={!isLoading}
            isDisabled={editProfileMutation.isPending}
            id='fullName'
            size='md'
            placeholder='Họ và tên'
            variant='flushed'
            borderBottom='1px solid'
            borderColor='brand.sliver'
            {...register('fullName', { required: 'Họ tên là bắt buộc' })}
          />
          {errors.fullName && (
            <Text color='red.500' fontSize='sm' mt={1}>
              {errors.fullName.message}
            </Text>
          )}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='role' fontSize='sm' fontWeight='medium'>
            Bạn là
          </FormLabel>
          <TextField
            isLoaded={!isLoading}
            id='role'
            size='md'
            placeholder='Bạn là'
            variant='flushed'
            borderBottom='1px solid'
            borderColor='brand.sliver'
            value={data?.role.name.toString()}
            isDisabled={true}
          />
        </FormControl>
      </Flex>

      <Flex gap={4}>
        <FormControl>
          <FormLabel htmlFor='email' fontSize='sm' fontWeight='medium'>
            Email
          </FormLabel>
          <TextField
            isLoaded={!isLoading}
            isDisabled={editProfileMutation.isPending}
            id='email'
            size='md'
            placeholder='Email'
            variant='flushed'
            borderBottom='1px solid'
            borderColor='brand.sliver'
            {...register('email')}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.phone}>
          <FormLabel htmlFor='phone' fontSize='sm' fontWeight='medium'>
            Số điện thoại
          </FormLabel>
          <TextField
            isLoaded={!isLoading}
            isDisabled={editProfileMutation.isPending}
            id='phone'
            size='md'
            placeholder='Số điện thoại'
            variant='flushed'
            borderBottom='1px solid'
            borderColor='brand.sliver'
            {...register('phone', {
              pattern: {
                value: REGEX.phone,
                message: 'Số điện thoại không hợp lệ'
              }
            })}
          />
          {errors.phone && (
            <Text color='red.500' fontSize='sm' mt={1}>
              {errors.phone.message}
            </Text>
          )}
        </FormControl>
      </Flex>

      <Button
        size='md'
        type='submit'
        maxW='200px'
        alignSelf='flex-end'
        isDisabled={isLoading}
        isLoading={isSubmitting || editProfileMutation.isPending}
      >
        Lưu thay đổi
      </Button>
    </Stack>
  )
}

export default Profile
