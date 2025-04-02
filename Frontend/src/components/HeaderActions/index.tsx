import { Box, Button, Flex } from '@chakra-ui/react'
import { NotificationIcon } from '@assets/icons'
import { IToken } from '@type/models'
import { UserMenu } from '@components'

interface HeaderActionsProps {
  token: IToken | null
  navigationHandlers: {
    login: () => void
    newProperty: () => void
    profile: () => void
    upgrade: () => void
    logout: () => void
  }
}

const HeaderActions = ({ token, navigationHandlers }: HeaderActionsProps) => (
  <Flex alignItems='center' gap={5}>
    {token ? (
      <Flex alignItems='center' gap={6}>
        <Box height='100%'>
          <NotificationIcon />
        </Box>
        <UserMenu token={token} navigationHandlers={navigationHandlers} />
      </Flex>
    ) : (
      <Button onClick={navigationHandlers.login} colorScheme='brand' variant='tertiary'>
        Đăng nhập
      </Button>
    )}
    <Button colorScheme='brand' variant='tertiary' onClick={navigationHandlers.newProperty}>
      Đăng tin
    </Button>
  </Flex>
)

export default HeaderActions
