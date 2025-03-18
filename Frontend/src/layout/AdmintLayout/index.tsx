import { Outlet } from 'react-router-dom'
import { Flex, Stack } from '@chakra-ui/react'
import { ErrorBoundary } from '@components'
import Sidebar from '@layout/components/Sidebar'
import { BaseHeader } from '@layout/components/Header'

const AdminLayout = () => {
  return (
    <ErrorBoundary>
      <Flex>
        <Sidebar />
        <Stack w={{ base: '100%', xl: 'calc(100% - 254px)' }} px={6} paddingBottom={6} bgColor='brand.grey'>
          <BaseHeader />
          <Outlet />
        </Stack>
      </Flex>
    </ErrorBoundary>
  )
}

export default AdminLayout
