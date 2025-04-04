import { Box, List, ListItem } from '@chakra-ui/react'
import { LogoutIcon, ProfileIcon, UpgradeIcon, UserIcon } from '@assets/icons'
import { UserCard } from '@components'
import { IToken } from '@type/models'

interface UserMenuProps {
  token: IToken
  navigationHandlers: {
    profile: () => void
    upgrade: () => void
    logout: () => void
  }
}

const UserMenu = ({ token, navigationHandlers }: UserMenuProps) => {
  const userMenuItems = [
    { label: 'Tài khoản', icon: <ProfileIcon />, onClick: navigationHandlers.profile },
    { label: 'Nâng cấp', icon: <UpgradeIcon />, onClick: navigationHandlers.upgrade },
    { label: 'Đăng xuất', icon: <LogoutIcon />, onClick: navigationHandlers.logout }
  ]

  return (
    <Box position='relative' cursor='pointer' _hover={{ div: { display: 'flex' } }}>
      <UserCard name={token.user.fullName} role={token.user.role.name.toLocaleLowerCase()} avatar={<UserIcon />} />
      <Box
        position='absolute'
        top='75%'
        right='0'
        display='none'
        bgColor='brand.white'
        w='150px'
        borderRadius='md'
        boxShadow='md'
        zIndex={10}
        mt={2}
        overflow='hidden'
        border='1px'
        borderColor='gray.200'
      >
        <List display='flex' w='100%' justifyContent='flex-start' flexDirection='column'>
          {userMenuItems.map((item, index) => (
            <ListItem
              key={index}
              display='flex'
              justifyContent='flex-start'
              py={2}
              px={4}
              _hover={{ bgColor: 'gray.200' }}
              fontSize='sm'
              color='brand.blackTextPrimary'
              onClick={item.onClick}
              gap={2}
            >
              {item.icon}
              {item.label}
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}

export default UserMenu
