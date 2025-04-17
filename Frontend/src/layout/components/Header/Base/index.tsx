import { Flex } from '@chakra-ui/react'
import { LogoIcon } from '@assets/icons'
import { HeaderActions, Logo, NavItem } from '@components'
import { memo } from 'react'
import { RoleName } from '@type/models'
import useAuthStore from '@stores/Authentication'

const BaseHeader = () => {
  const { token } = useAuthStore()
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
        {token?.user.role.name !== RoleName.ADMIN && (
          <NavItem title='Bài đăng' to='/property-listings' isActive={false} />
        )}
      </Flex>
      <HeaderActions />
    </Flex>
  )
}

export default memo(BaseHeader)
