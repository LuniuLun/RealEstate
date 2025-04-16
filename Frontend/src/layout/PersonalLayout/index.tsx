import { Outlet } from 'react-router-dom'
import { Flex, Stack } from '@chakra-ui/react'
import { ErrorBoundary } from '@components'
import { BaseHeader } from '@layout/components/Header'
import Sidebar from '@layout/components/Sidebar'
import Footer from '@layout/components/Footer'

const PersonalLayout = () => {
  return (
    <ErrorBoundary>
      <Stack>
        <Flex gap={4}>
          <Sidebar />
          <Stack w={{ base: '100%', xl: 'calc(100% - 254px)' }} bgColor='brand.grey' gap='unset' px={3}>
            <BaseHeader />
            <Outlet />
          </Stack>
        </Flex>
        <Footer />
      </Stack>
    </ErrorBoundary>
  )
}

export default PersonalLayout
