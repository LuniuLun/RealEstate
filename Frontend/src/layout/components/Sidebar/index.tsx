import { ElementType, memo, useEffect, useRef, useState } from 'react'
import { Button, Stack, useBreakpointValue } from '@chakra-ui/react'
import { NavItem } from '@components'
import { useLocation } from 'react-router-dom'
import { ADMIN_NAV_ITEMS } from '@constants/option'
import {
  DashboardIcon,
  ForecastIcon,
  HeartIcon,
  UsersIcon,
  LogoutIcon,
  PersonalIcon,
  PostIcon,
  ProfileIcon,
  TransactionIcon,
  UpgradeIcon
} from '@assets/icons'
import { useSidebar } from '@hooks'
import { authStore } from '@stores'
import { RoleName } from '@type/models'
import colors from '@styles/variables/colors'
import { getUserNavItems } from '@utils'

const iconMap: Record<string, ElementType> = {
  dashboard: DashboardIcon,
  users: UsersIcon,
  posts: PostIcon,
  personal: ProfileIcon,
  upgrade: UpgradeIcon,
  forecast: ForecastIcon,
  myPosts: PostIcon,
  transactions: TransactionIcon,
  savedPosts: HeartIcon
}

const Sidebar = () => {
  const [activeNavItem, setActiveNavItem] = useState<string>('personal')
  const { isSidebarOpen, closeSidebar } = useSidebar()
  const { token, logout } = authStore()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const isTablet = useBreakpointValue({ base: true, xl: false })
  const NAV_ITEMS =
    token?.user?.role?.name === RoleName.ADMIN ? ADMIN_NAV_ITEMS : getUserNavItems(token?.user?.role?.name)

  useEffect(() => {
    const currentPath = location.pathname.replace(/\/$/, '')

    const matchedItem = NAV_ITEMS?.find((item) => {
      const itemPath = `/personal/${item.path}`.replace('//', '/')
      return currentPath === itemPath || currentPath.startsWith(itemPath + '/')
    })

    setActiveNavItem(matchedItem ? matchedItem.id : 'personal')
  }, [location.pathname])

  useEffect(() => {
    if (isTablet) {
      const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
          closeSidebar()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isTablet, closeSidebar])

  return (
    <Stack
      ref={sidebarRef}
      gap={10}
      position={{ base: 'fixed', xl: 'unset' }}
      left={{ base: 0, xl: 'initial' }}
      top={{ base: 0, xl: 'initial' }}
      transition='transform 0.3s ease'
      transform={{
        base: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        xl: 'translateX(0)'
      }}
      zIndex={1000}
      minH='100vh'
      w='100%'
      maxW='238px'
      padding='20px 0 40px'
      bgColor='white'
    >
      <Stack alignItems='center' justify='center'>
        <PersonalIcon />
      </Stack>
      <Stack gap={2}>
        {NAV_ITEMS?.map((item) => {
          const Icon = iconMap[item.id] || DashboardIcon
          return (
            <NavItem
              key={item.id}
              icon={<Icon height='24px' width='24px' />}
              title={item.title}
              isActive={activeNavItem === item.id}
              to={`/personal/${item.path}`}
              onClick={() => closeSidebar()}
            />
          )
        })}
      </Stack>
      <Button
        aria-label='log out'
        leftIcon={<LogoutIcon fill={colors.brand.red} />}
        alignSelf='flex-start'
        bg='transparent'
        borderRadius='full'
        size='sm'
        color='brand.red'
        _hover={{ bg: 'transparent' }}
        onClick={logout}
      >
        Đăng xuất
      </Button>
    </Stack>
  )
}

export default memo(Sidebar)
