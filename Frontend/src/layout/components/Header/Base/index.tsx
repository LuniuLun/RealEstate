import { Box, Button, Flex } from '@chakra-ui/react'
import { LogoIcon, NotificationIcon, UserIcon } from '@assets/icons'
import { Logo, NavItem, UserCard } from '@components'
import { authStore } from '@stores'
import colors from '@styles/variables/colors'
import { useNavigate } from 'react-router-dom'

const BaseHeader = () => {
  // const { toggleSidebar } = useSidebar()
  const { token, logout } = authStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Flex
      alignItems='center'
      justifyContent='space-between'
      w='100%'
      px={6}
      mt={4}
      bgColor={colors.brand.white}
      borderRadius={20}
    >
      <Flex gap={4}>
        <Logo icon={<LogoIcon />} src='/' />
      </Flex>
      <Flex>
        <NavItem title='Trang chủ' to='/' isActive={false} />
        <NavItem title='Bài đăng' to='/property-listings' isActive={false} />
      </Flex>
      <Flex alignItems='center' gap={5}>
        {token ? (
          <Flex alignItems='center' gap={6}>
            <Box height='100%'>
              <NotificationIcon />
            </Box>
            <Box position='relative' cursor='pointer' _hover={{ div: { display: 'flex' } }}>
              <UserCard
                name={token.user.fullName}
                role={token.user.role.name.toLocaleLowerCase()}
                avatar={<UserIcon />}
              />
              <Flex position='absolute' bottom='-70%' right='0' display='none' bgColor={colors.brand.white} w='100px'>
                <Box onClick={handleLogout} px={2} py={1} textAlign='end' w='100%'>
                  Logout
                </Box>
              </Flex>
            </Box>
          </Flex>
        ) : (
          <Button onClick={() => navigate('/login')} colorScheme='brand' variant='tertiary'>
            Đăng nhập
          </Button>
        )}
        <Button colorScheme='brand' variant='tertiary'>
          Đăng tin
        </Button>
      </Flex>
    </Flex>
  )
}

export default BaseHeader
