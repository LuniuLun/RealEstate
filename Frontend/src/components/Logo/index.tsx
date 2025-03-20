import { Box, Flex, Heading } from '@chakra-ui/react'
import React, { memo } from 'react'
import { Link } from 'react-router-dom'

interface ILogoProps {
  icon: React.ReactElement
  src: string
  width?: string
  height?: string
}

const Logo = ({ src, icon, width = '24px', height = '36px' }: ILogoProps) => {
  return (
    <Link to={src}>
      <Flex alignItems='center' gap={3}>
        <Box borderRadius='50%'>{React.cloneElement(icon, { width, height })}</Box>
        <Heading variant='primary' color={icon.props.fill}>
          JustHome
        </Heading>
      </Flex>
    </Link>
  )
}

export default memo(Logo)
