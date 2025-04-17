import { Box, List, ListItem } from '@chakra-ui/react'
import {
  LogoutIcon,
  ProfileIcon,
  UpgradeIcon,
  UserIcon,
  PostIcon,
  TransactionIcon,
  HeartIcon,
  DashboardIcon,
  UsersIcon,
  ForecastIcon
} from '@assets/icons'
import { UserCard } from '@components'
import { authStore } from '@stores'
import { useNavigate } from 'react-router-dom'
import { RoleName } from '@type/models'
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from '@constants/option'

const iconMap: Record<string, JSX.Element> = {
  personal: <ProfileIcon width='24px' height='24px' />,
  myPosts: <PostIcon width='24px' height='24px' />,
  savedPosts: <HeartIcon width='24px' height='24px' />,
  transactions: <TransactionIcon width='24px' height='24px' />,
  upgrade: <UpgradeIcon width='24px' height='24px' />,
  forecast: <ForecastIcon width='24px' height='24px' />,
  posts: <PostIcon width='24px' height='24px' />,
  dashboard: <DashboardIcon width='24px' height='24px' />,
  users: <UsersIcon width='24px' height='24px' />
}

const UserMenu = () => {
  const { token, logout } = authStore()
  const navigate = useNavigate()
  const role = token?.user?.role?.name

  const navItems = role === RoleName.ADMIN ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS

  const userMenuItems = [
    ...navItems.map((item) => ({
      label: item.title,
      icon: iconMap[item.id] || <ProfileIcon />,
      onClick: () => navigate(`/personal/${item.path}`)
    })),
    {
      label: 'Đăng xuất',
      icon: <LogoutIcon />,
      onClick: () => {
        logout()
        navigate('/')
      }
    }
  ]

  return (
    <Box position='relative' cursor='pointer' _hover={{ div: { display: 'flex' } }}>
      <UserCard name={token!.user.fullName} role={role!.toLowerCase()} avatar={<UserIcon />} />
      <Box
        position='absolute'
        top='75%'
        right='0'
        display='none'
        bgColor='brand.white'
        w='200px'
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
