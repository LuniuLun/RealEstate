import { Outlet } from 'react-router-dom'
import { Stack } from '@chakra-ui/react'
import { ErrorBoundary } from '@components'
import { ClientHeader } from '@layout/components/Header'
import Footer from '@layout/components/Footer'

const DefaultLayout = () => {
  return (
    <ErrorBoundary>
      <Stack w={{ base: '100%' }} bgColor='brand.grey' gap='unset'>
        <ClientHeader />
        <Outlet />
        <Footer />
      </Stack>
    </ErrorBoundary>
  )
}

export default DefaultLayout
