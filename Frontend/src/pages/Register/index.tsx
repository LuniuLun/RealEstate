import { Box, Flex, Heading } from '@chakra-ui/react'
import { LogoIcon } from '@assets/icons'
import IllustrationImage from '@assets/images/illustration.png'
import { Logo, RegisterForm } from '@components'

const Register = () => {
  return (
    <Flex height='100vh' width='100%'>
      <Flex
        display='flex'
        flexDirection='column'
        flex={1}
        p={14}
        bgImage={IllustrationImage}
        bgColor='brand.primary'
        bgSize='contain'
        bgRepeat='no-repeat'
        bgPosition='center'
      >
        <Logo icon={<LogoIcon fill='brand.yellowHeading' />} src='/' />
        <Heading fontSize='2xl' mt={10} color='brand.yellowHeading' maxW='300px' lineHeight='9'>
          Khám phá bất động sản tại Việt Nam
        </Heading>
      </Flex>
      <Box flex={2} p={10} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
        <RegisterForm />
      </Box>
    </Flex>
  )
}

export default Register
