import { Avatar, Box, Flex } from '@chakra-ui/react'
import InfoGroup from '@components/InfoGroup'
import colors from '@styles/variables/colors'
import React, { memo, ReactElement } from 'react'

interface IUserCardProps {
  name: string
  role: string
  avatar?: string | ReactElement
}

const UserCard = ({ name, role, avatar }: IUserCardProps) => {
  return (
    <Flex
      gap={4}
      alignItems='center'
      backgroundColor='transparent'
      boxShadow='sm'
      maxWidth='260px'
      justifyContent='space-between'
    >
      <Flex gap={4} display={{ base: 'none', md: 'flex' }}>
        <InfoGroup heading={name} description={role} size='md' />
      </Flex>
      {typeof avatar === 'string' ? (
        <Avatar name={name} src={avatar} size='md' bgColor='transparent' />
      ) : React.isValidElement(avatar) ? (
        <Box
          overflow='hidden'
          display='flex'
          alignItems='center'
          justifyContent='center'
          border='1px solid'
          borderColor={colors.brand.black}
          borderRadius='50%'
          p={2}
        >
          {React.cloneElement(avatar)}
        </Box>
      ) : (
        <Avatar name={name} size='md' bgColor='transparent' />
      )}
    </Flex>
  )
}

export default memo(UserCard)
