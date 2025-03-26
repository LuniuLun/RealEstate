import { Box, Button, Flex } from '@chakra-ui/react'
import { LogoIcon, LogoutIcon, NotificationIcon, ProfileIcon, UserIcon } from '@assets/icons'
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

  const handleGoToProfile = () => {
    navigate('/profile')
  }

  const handleGoToNewProperty = () => {
    navigate('/new-property')
  }

  return (
    <Flex
      as='nav'
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
              <Box
                position='absolute'
                top='75%'
                right='0'
                display='none'
                bgColor={colors.brand.white}
                w='150px'
                borderRadius='md'
                boxShadow='md'
                zIndex={10}
                mt={2}
                overflow='hidden'
                border='1px'
                borderColor='gray.200'
              >
                <Flex direction='column' w='100%' justifyContent='flex-start'>
                  <Button
                    variant='ghost'
                    size='md'
                    justifyContent='flex-start'
                    py={2}
                    px={4}
                    _hover={{ bgColor: 'gray.200' }}
                    leftIcon={<ProfileIcon />}
                    fontSize='sm'
                    color={colors.brand.blackTextPrimary}
                    onClick={handleGoToProfile}
                  >
                    Tài khoản
                  </Button>
                  <Button
                    variant='ghost'
                    size='md'
                    justifyContent='flex-start'
                    py={2}
                    px={4}
                    _hover={{ bgColor: 'gray.200' }}
                    leftIcon={<LogoutIcon />}
                    fontSize='sm'
                    color={colors.brand.blackTextPrimary}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Flex>
        ) : (
          <Button onClick={() => navigate('/login')} colorScheme='brand' variant='tertiary'>
            Đăng nhập
          </Button>
        )}
        <Button colorScheme='brand' variant='tertiary' onClick={handleGoToNewProperty}>
          Đăng tin
        </Button>
      </Flex>
    </Flex>
  )
}

export default BaseHeader
