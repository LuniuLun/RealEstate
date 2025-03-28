import { ElementType, useEffect, useRef, useState } from 'react'
import { Button, Stack, useBreakpointValue } from '@chakra-ui/react'
import { NavItem } from '@components'
import { useLocation } from 'react-router-dom'
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from '@constants/option'
import {
  DashboardIcon,
  LeaderboardIcon,
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

const iconMap: Record<string, ElementType> = {
  dashboard: DashboardIcon,
  users: LeaderboardIcon,
  posts: PostIcon,
  personal: ProfileIcon,
  myReport: PostIcon,
  upgrade: UpgradeIcon,
  transactions: TransactionIcon
}

const Sidebar = () => {
  const [activeNavItem, setActiveNavItem] = useState<string>('dashboard')
  const { isSidebarOpen, closeSidebar } = useSidebar()
  const { token } = authStore()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const isTablet = useBreakpointValue({ base: true, xl: false })
  const NAV_ITEMS = token?.user?.role?.name === RoleName.ADMIN ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS

  useEffect(() => {
    const currentPath = location.pathname
    const normalizedCurrentPath = currentPath.replace(/\/$/, '')

    const matchedItem = NAV_ITEMS.find((item) => {
      return normalizedCurrentPath === item.path || normalizedCurrentPath.startsWith(item.path + '/')
    })

    setActiveNavItem(matchedItem ? matchedItem.id : 'dashboard')
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
      width='300px'
      minH='100vh'
      padding='20px 0 40px'
      bgColor='white'
    >
      <Stack alignItems='center' justify='center'>
        <PersonalIcon />
      </Stack>
      <Stack gap={2}>
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.id] || DashboardIcon
          return (
            <NavItem
              key={item.id}
              icon={<Icon />}
              title={item.title}
              isActive={activeNavItem === item.id}
              to={item.path}
              onClick={() => closeSidebar()}
            />
          )
        })}
      </Stack>
      <Button
        aria-label='log out'
        leftIcon={<LogoutIcon />}
        alignSelf='flex-start'
        mt={20}
        bg='transparent'
        borderRadius='full'
        size='sm'
        color='brand.red'
        _hover={{ bg: 'transparent' }}
      >
        Đăng xuất
      </Button>
    </Stack>
  )
}

export default Sidebar
