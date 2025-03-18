import { SidebarContext } from '@contexts'
import { ReactNode, useState } from 'react'

interface SidebarProviderProps {
  children: ReactNode
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar }}>{children}</SidebarContext.Provider>
  )
}

// export const SidebarProvider = ({ children }: SidebarProviderProps) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), [])
//   const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])

//   const contextValue = useMemo(
//     () => ({ isSidebarOpen, toggleSidebar, closeSidebar }),
//     [isSidebarOpen, toggleSidebar, closeSidebar]
//   )

//   return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>
