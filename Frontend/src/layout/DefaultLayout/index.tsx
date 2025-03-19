import { Outlet } from 'react-router-dom'
import { Flex, Stack } from '@chakra-ui/react'
import { ErrorBoundary } from '@components'
import { ClientHeader } from '@layout/components/Header'
import Footer from '@layout/components/Footer'

const DefaultLayout = () => {
  return (
    <ErrorBoundary>
      <Flex>
        <Stack w={{ base: '100%' }} paddingBottom={6} bgColor='brand.grey'>
          <ClientHeader />
          <Outlet />
          <Footer />
        </Stack>
      </Flex>
    </ErrorBoundary>
  )
}

export default DefaultLayout
