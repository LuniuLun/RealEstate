import { Box, Button, Flex } from '@chakra-ui/react'
import { NotificationIcon } from '@assets/icons'
import { UserMenu } from '@components'
import { authStore } from '@stores'
import { useNavigate } from 'react-router-dom'

const HeaderActions = () => {
  const token = authStore((state) => state.token)
  const navigate = useNavigate()

  const handleLogin = () => navigate('/login')
  const handleNewProperty = () => navigate('/new-property')

  return (
    <Flex alignItems='center' gap={5}>
      {token ? (
        <Flex alignItems='center' gap={6}>
          <Box height='100%'>
            <NotificationIcon />
          </Box>
          <UserMenu />
        </Flex>
      ) : (
        <Button onClick={handleLogin} colorScheme='brand' variant='tertiary'>
          Đăng nhập
        </Button>
      )}
      <Button colorScheme='brand' variant='tertiary' onClick={handleNewProperty}>
        Đăng tin
      </Button>
    </Flex>
  )
}

export default HeaderActions
