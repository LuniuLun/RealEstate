import { Box, Button, Checkbox, Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { GoogleIcon, LogoIcon } from '@assets/icons'
import IllustrationImage from '@assets/images/illustration.png'
import { Logo, TextField } from '@components'
import colors from '@styles/variables/colors'
import { Link } from 'react-router-dom'

const Register = () => {
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
        <Stack w='60%' gap={5}>
          <Heading fontSize='2xl'>Đăng ký JustHome</Heading>

          <Button
            variant='primary'
            bgColor={colors.brand.blue}
            px='unset'
            w='300px'
            height={10}
            justifyContent='flex-start'
          >
            <Box m={1} borderRadius='lg' overflow='hidden'>
              <GoogleIcon />
            </Box>
            Đăng nhập bằng Google
          </Button>

          <Divider my={5} border='1px solid #D9D9D9' />

          <Stack gap={4}>
            <Flex gap={2}>
              <TextField placeholder='Họ và tên' variant='outline' borderRadius='md' />
              <TextField placeholder='Số điện thoại' variant='outline' borderRadius='md' />
            </Flex>
            <TextField placeholder='Email' variant='outline' borderRadius='md' />
            <TextField placeholder='Mật khẩu' variant='outline' borderRadius='md' />
            <TextField placeholder='Nhập lại mật khẩu' variant='outline' borderRadius='md' />
          </Stack>

          <Checkbox mt={3}>
            Bằng việc tạo tài khoản, bạn đồng ý với{' '}
            <Text as='span' color={colors.brand.primary}>
              Điều khoản dịch vụ{' '}
            </Text>
            và{' '}
            <Text as='span' color={colors.brand.primary}>
              Chính sách bảo mật
            </Text>
            .
          </Checkbox>

          <Button mt={5} width='250px' colorScheme='yellow' py={5}>
            Tạo tài khoản
          </Button>

          <Text mt={3}>
            Đã có tài khoản?{' '}
            <Link to='/login'>
              <Text as='span' color={colors.brand.primary}>
                Đăng nhập
              </Text>
            </Link>
          </Text>
        </Stack>
      </Box>
    </Flex>
  )
}

export default Register
