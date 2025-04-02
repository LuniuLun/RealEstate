import { Flex } from '@chakra-ui/react'
import { LogoIcon } from '@assets/icons'
import { HeaderActions, Logo, NavItem } from '@components'
import { authStore } from '@stores'
import { useNavigate } from 'react-router-dom'

const BaseHeader = () => {
  const { token, logout } = authStore()
  const navigate = useNavigate()

  const navigationHandlers = {
    profile: () => navigate('/personal'),
    upgrade: () => navigate('/upgrade'),
    newProperty: () => navigate('/new-property'),
    login: () => navigate('/login'),
    logout: () => {
      logout()
      navigate('/')
    }
  }

  return (
    <Flex
      as='nav'
      alignItems='center'
      justifyContent='space-between'
      w='100%'
      px={6}
      mt={4}
      bgColor='brand.white'
      borderRadius={20}
    >
      <Flex gap={4}>
        <Logo icon={<LogoIcon />} src='/' />
      </Flex>
      <Flex>
        <NavItem title='Trang chủ' to='/' isActive={false} />
        <NavItem title='Bài đăng' to='/property-listings' isActive={false} />
      </Flex>
      <HeaderActions token={token} navigationHandlers={navigationHandlers} />
    </Flex>
  )
}

export default BaseHeader
