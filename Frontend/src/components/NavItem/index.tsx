import React, { memo } from 'react'
import { Flex, Text, Box } from '@chakra-ui/react'
import colors from '@styles/variables/colors'
import { Link, LinkProps } from 'react-router-dom'

interface INavItemProps extends LinkProps {
  icon?: React.ReactElement
  title: string
  isActive: boolean
}

const NavItem = ({ icon, title, isActive, to, onClick }: INavItemProps) => {
  return (
    <Link to={to} onClick={onClick}>
      <Flex
        align='center'
        gap={3}
        borderRight={isActive ? `6px solid ${colors.brand.primary}` : 'none'}
        p={4}
        bg={'transparent'}
        cursor='pointer'
        _hover={{ bg: 'gray.50' }}
      >
        {icon && (
          <Box>
            {React.cloneElement(icon, {
              fill: isActive ? colors.brand.primary : colors.brand.blackTextTertiary
            })}
          </Box>
        )}
        <Text fontWeight={isActive ? 'bold' : 'normal'} color={isActive ? 'brand.primary' : 'brand.blackTextPrimary'}>
          {title}
        </Text>
      </Flex>
    </Link>
  )
}

export default memo(NavItem)
