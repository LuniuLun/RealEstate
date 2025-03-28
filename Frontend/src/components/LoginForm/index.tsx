import { Button, Divider, Flex, Stack, Text, Box, Heading } from '@chakra-ui/react'
import { GoogleIcon } from '@assets/icons'
import { TextField } from '@components'
import { Link } from 'react-router-dom'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useLoginUser } from '@hooks'
import { TLoginUserRequest } from '@type/models'
import { REGEX } from '@constants/regex'
import MESSAGE from '@constants/message'

interface ILoginInputs {
  phone: string
  password: string
}

const LoginForm = () => {
  const { loginUserMutation } = useLoginUser()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginInputs>({
    defaultValues: {
      phone: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<ILoginInputs> = (data) => {
    const loginData: TLoginUserRequest = {
      phone: data.phone,
      password: data.password
    }

    loginUserMutation.mutate(loginData)
  }

  return (
    <Stack gap={5} maxW='500px' w='100%' as='form' onSubmit={handleSubmit(onSubmit)}>
      <Heading fontSize='2xl' color='brand.blackTextPrimary' mb={5} alignSelf='flex-start' maxW='500px'>
        Đăng nhập JustHome
      </Heading>

      <Button
        variant='primary'
        bgColor='brand.blue'
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
        <Text color='brand.yellowHeading'>Hoặc</Text>
        <Divider my={5} border='1px solid #D9D9D9' />
      </Flex>

      <Stack gap={6}>
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

        <Controller
          name='password'
          control={control}
          rules={{
            required: MESSAGE.auth.REQUIRE
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
      </Stack>

      <Flex justifyContent='flex-end' width='100%'>
        <Link to='/forgot-password'>
          <Text color='brand.yellowHeading'>Quên mật khẩu?</Text>
        </Link>
      </Flex>

      <Button
        mt={5}
        width='250px'
        colorScheme='yellow'
        size='md'
        type='submit'
        isLoading={loginUserMutation.isPending}
        loadingText='Đang xử lý...'
      >
        Đăng nhập
      </Button>

      <Text mt={3}>
        Bạn chưa có tài khoản?{' '}
        <Link to='/register'>
          <Text as='span' color='brand.yellowHeading'>
            Đăng ký
          </Text>
        </Link>
      </Text>
    </Stack>
  )
}

export default LoginForm
