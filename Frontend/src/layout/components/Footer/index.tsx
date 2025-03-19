import { FacebookIcon, InstagramIcon, LinkedInIcon, LogoIcon, TwitterIcon } from '@assets/icons'
import { Box, Container, Flex, Text, VStack, HStack } from '@chakra-ui/react'
import { Logo } from '@components'
import { Link } from 'react-router-dom'
import colors from '@styles/variables/colors'
import React from 'react'

const Footer = () => {
  return (
    <Box bg='teal.900' color='white' py={6}>
      <Container maxW='6xl'>
        <Flex justify='space-between' align='center' flexWrap='wrap'>
          <HStack spacing={2}>
            <Logo icon={<LogoIcon />} src='/' />
          </HStack>

          <Flex flexDirection={{ base: 'column', md: 'row' }} gap={8}>
            <VStack align='start'>
              <Text fontWeight='bold'>Liên hệ tôi</Text>
              <Text color={colors.brand.blackTextSecondary}>nguyenducvan@gmail.com</Text>
              <Text color={colors.brand.blackTextSecondary}>0373 115 431</Text>
            </VStack>

            <VStack align='start'>
              <Text fontWeight='bold'>Địa chỉ của tôi</Text>
              <Text color={colors.brand.blackTextSecondary}>79 Dương Bá Cung</Text>
              <Text color={colors.brand.blackTextSecondary}>Hoà Xuân, Đà Nẵng</Text>
            </VStack>
          </Flex>

          <HStack spacing={4}>
            <Link to='#'>{React.cloneElement(<FacebookIcon />)}</Link>
            <Link to='#'>{React.cloneElement(<InstagramIcon />)}</Link>
            <Link to='#'>{React.cloneElement(<TwitterIcon />)}</Link>
            <Link to='#'>{React.cloneElement(<LinkedInIcon />)}</Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
