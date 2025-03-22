import { Button, Checkbox, Divider, Flex, Stack, Text, useToast, Box, Heading } from '@chakra-ui/react'
import { GoogleIcon } from '@assets/icons'
import { TextField } from '@components'
import colors from '@styles/variables/colors'
import { Link } from 'react-router-dom'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useRegisterUser } from '@hooks'
import { RoleName, TRegisterUserRequest } from '@type/models'
import { REGEX } from '@constants/regex'
import MESSAGE from '@constants/message'

interface IRegisterInputs extends TRegisterUserRequest {
  agreeTerms: boolean
  confirmPassword: string
}

const RegisterForm = () => {
  const toast = useToast()
  const { registerUserMutation } = useRegisterUser()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IRegisterInputs>({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    }
  })

  const password = watch('password')

  const onSubmit: SubmitHandler<IRegisterInputs> = (data) => {
    if (!data.agreeTerms) {
      toast({
        title: MESSAGE.auth.TERMREQUIRED,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return
    }

    const newUser: TRegisterUserRequest = {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      password: data.password,
      role: {
        id: 1,
        name: RoleName.CUSTOMER
      }
    }

    registerUserMutation.mutate(newUser)
  }
  return (
    <Stack gap={5} maxW='500px' w='100%' as='form' onSubmit={handleSubmit(onSubmit)}>
      <Heading fontSize='2xl' color={colors.brand.blackTextPrimary} mb={5} alignSelf='flex-start' maxW='500px'>
        Đăng ký JustHome
      </Heading>
      <Button
        variant='primary'
        bgColor={colors.brand.blue}
        px='unset'
        w='300px'
        height={10}
        justifyContent='flex-start'
        borderRadius='sm'
        type='button'
      >
        <Box m='2px' borderRadius='md' overflow='hidden'>
          <GoogleIcon />
        </Box>
        Đăng nhập bằng Google
      </Button>

      <Flex align='center' gap={4}>
        <Divider my={5} border='1px solid #D9D9D9' />
        <Text color={colors.brand.yellowHeading}>Hoặc</Text>
        <Divider my={5} border='1px solid #D9D9D9' />
      </Flex>

      <Stack gap={6}>
        <Flex gap={2}>
          <Controller
            name='fullName'
            control={control}
            rules={{
              required: MESSAGE.auth.REQUIRE,
              minLength: { value: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' }
            }}
            render={({ field }) => (
              <TextField
                placeholder='Họ và tên'
                variant='outline'
                borderRadius='md'
                size='md'
                isInvalid={!!errors.fullName}
                errorMessage={errors.fullName?.message}
                {...field}
              />
            )}
          />

          <Controller
            name='phone'
            control={control}
            rules={{
              required: MESSAGE.auth.REQUIRE,
              pattern: {
                value: REGEX.phone,
                message: MESSAGE.auth.INVALID_PHONE
              }
            }}
            render={({ field }) => (
              <TextField
                placeholder='Số điện thoại'
                variant='outline'
                borderRadius='md'
                size='md'
                isInvalid={!!errors.phone}
                errorMessage={errors.phone?.message}
                {...field}
              />
            )}
          />
        </Flex>

        <Controller
          name='email'
          control={control}
          rules={{
            required: MESSAGE.auth.REQUIRE,
            pattern: {
              value: REGEX.email,
              message: MESSAGE.auth.INVALID_EMAIL
            }
          }}
          render={({ field }) => (
            <TextField
              placeholder='Email'
              variant='outline'
              borderRadius='md'
              size='md'
              type='email'
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='password'
          control={control}
          rules={{
            required: MESSAGE.auth.REQUIRE,
            pattern: {
              value: REGEX.password,
              message: MESSAGE.auth.WEAK_PASSWORD
            }
          }}
          render={({ field }) => (
            <TextField
              placeholder='Mật khẩu'
              variant='outline'
              borderRadius='md'
              size='md'
              type='password'
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='confirmPassword'
          control={control}
          rules={{
            required: MESSAGE.auth.REQUIRE,
            validate: (value) => value === password || MESSAGE.auth.MISMATCH_PASSWORD
          }}
          render={({ field }) => (
            <TextField
              placeholder='Nhập lại mật khẩu'
              variant='outline'
              borderRadius='md'
              size='md'
              type='password'
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              {...field}
            />
          )}
        />
      </Stack>

      <Controller
        name='agreeTerms'
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <Checkbox
            mt={3}
            alignItems='unset'
            sx={{ '& span:first-of-type': { marginTop: '4px' } }}
            isChecked={value}
            onChange={onChange}
            ref={ref}
          >
            Bằng việc tạo tài khoản, bạn đồng ý với{' '}
            <Text as='span' color={colors.brand.yellowHeading}>
              Điều khoản dịch vụ{' '}
            </Text>
            và{' '}
            <Text as='span' color={colors.brand.yellowHeading}>
              Chính sách bảo mật
            </Text>
            .
          </Checkbox>
        )}
      />

      <Button
        mt={5}
        width='250px'
        colorScheme='yellow'
        size='md'
        type='submit'
        isLoading={registerUserMutation.isPending}
        loadingText='Đang xử lý...'
      >
        Tạo tài khoản
      </Button>

      <Text mt={3}>
        Đã có tài khoản?{' '}
        <Link to='/login'>
          <Text as='span' color={colors.brand.yellowHeading}>
            Đăng nhập
          </Text>
        </Link>
      </Text>
    </Stack>
  )
}

export default RegisterForm
