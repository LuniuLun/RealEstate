import { Outlet } from 'react-router-dom'
import { Flex, Stack } from '@chakra-ui/react'
import { ErrorBoundary } from '@components'
import { BaseHeader } from '@layout/components/Header'
import Sidebar from '@layout/components/Sidebar'

const PersonalLayout = () => {
  return (
    <ErrorBoundary>
      <Flex gap={4}>
        <Sidebar />
        <Stack w={{ base: '100%' }} bgColor='brand.grey' gap='unset'>
          <BaseHeader />
          <Outlet />
        </Stack>
      </Flex>
    </ErrorBoundary>
  )
}

export default PersonalLayout
