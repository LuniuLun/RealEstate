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
          <Heading fontSize='2xl' color={colors.brand.blackTextPrimary}>
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
            <Flex gap={2}>
              <TextField placeholder='Họ và tên' variant='outline' borderRadius='md' py={5} />
              <TextField placeholder='Số điện thoại' variant='outline' borderRadius='md' py={5} />
            </Flex>
            <TextField placeholder='Email' variant='outline' borderRadius='md' py={5} />
            <TextField placeholder='Mật khẩu' variant='outline' borderRadius='md' py={5} />
            <TextField placeholder='Nhập lại mật khẩu' variant='outline' borderRadius='md' py={5} />
          </Stack>

          <Checkbox mt={3} alignItems='unset' sx={{ '& span:first-of-type': { marginTop: '4px' } }}>
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

          <Button mt={5} width='250px' colorScheme='yellow' py={5}>
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
      </Box>
    </Flex>
  )
}

export default Register
