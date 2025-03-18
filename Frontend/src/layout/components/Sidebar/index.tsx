import { ElementType, useEffect, useRef, useState } from 'react'
import { Stack, useBreakpointValue } from '@chakra-ui/react'
import { Logo, NavItem } from '@components'
import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '@constants/option'
import {
  DashboardIcon,
  LeaderboardIcon,
  DocumentIcon,
  GalleryIcon,
  HelpIcon,
  HierarchyIcon,
  MessageIcon,
  SettingIcon,
  LogoIcon
} from '@assets/icons'
import { useSidebar } from '@hooks'

const iconMap: Record<string, ElementType> = {
  dashboard: DashboardIcon,
  users: LeaderboardIcon,
  documents: DocumentIcon,
  photos: GalleryIcon,
  hierarchy: HierarchyIcon,
  message: MessageIcon,
  help: HelpIcon,
  setting: SettingIcon
}

const Sidebar = () => {
  const [activeNavItem, setActiveNavItem] = useState<string>('dashboard')
  const { isSidebarOpen, closeSidebar } = useSidebar()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const isTablet = useBreakpointValue({ base: true, xl: false })

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
      width='254px'
      minH='100vh'
      padding='40px 0 40px'
      bgColor='white'
    >
      <Stack paddingLeft='32px'>
        <Logo icon={<LogoIcon />} src='/' />
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
    </Stack>
  )
}

export default Sidebar
