import { Box, Button, Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { GoogleIcon, LogoIcon } from '@assets/icons'
import IllustrationImage from '@assets/images/illustration.png'
import { Logo, TextField } from '@components'
import colors from '@styles/variables/colors'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <Flex height='100vh' width='100%'>
      <Flex
        display='flex'
        flexDirection='column'
        flex={1}
        p={14}
        bgImage={IllustrationImage}
        bgColor={colors.brand.primary}
        bgSize='contain'
        bgRepeat='no-repeat'
        bgPosition='center'
      >
        <Logo icon={<LogoIcon fill={colors.brand.yellowHeading} />} src='/' />
        <Heading fontSize='2xl' mt={10} color={colors.brand.yellowHeading} maxW='300px' lineHeight='9'>
          Khám phá bất động sản tại Việt Nam
        </Heading>
      </Flex>

      <Box flex={2} p={10} display='flex' justifyContent='center' alignItems='center'>
        <Stack gap={5} maxW='500px' w='100%'>
          <Heading fontSize='2xl' color={colors.brand.blackTextPrimary}>
            Đăng nhập JustHome
          </Heading>

          <Button
            variant='primary'
            bgColor={colors.brand.blue}
            px='unset'
            w='300px'
            height={10}
            justifyContent='flex-start'
            borderRadius='sm'
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

          <Stack gap={4}>
            <TextField placeholder='Số điện thoại' variant='outline' borderRadius='md' py={5} />
            <TextField placeholder='Mật khẩu' variant='outline' borderRadius='md' py={5} type='password' />
          </Stack>

          <Button mt={5} width='250px' colorScheme='yellow' py={5}>
            Đăng nhập
          </Button>

          <Text mt={3}>
            Bạn chưa có tài khoản?{' '}
            <Link to='/register'>
              <Text as='span' color={colors.brand.yellowHeading}>
                Đăng ký
              </Text>
            </Link>
          </Text>
        </Stack>
      </Box>
    </Flex>
  )
}

export default Login
