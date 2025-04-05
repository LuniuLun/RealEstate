import { Flex } from '@chakra-ui/react'
import { LogoIcon } from '@assets/icons'
import { HeaderActions, Logo, NavItem } from '@components'

const BaseHeader = () => {
  return (
    <Flex
      as='nav'
      alignItems='center'
      justifyContent='space-between'
      w='100%'
      px={6}
      mt={4}
      bgColor='brand.white'
      borderRadius={20}
    >
      <Flex gap={4}>
        <Logo icon={<LogoIcon />} src='/' />
      </Flex>
      <Flex>
        <NavItem title='Trang chủ' to='/' isActive={false} />
        <NavItem title='Bài đăng' to='/property-listings' isActive={false} />
      </Flex>
      <HeaderActions />
    </Flex>
  )
}

export default BaseHeader
