import { Stack, Flex, Text } from '@chakra-ui/react'
import { PhoneIcon, UserIcon } from '@assets/icons'
import UserCard from '@components/UserCard'
import { memo } from 'react'

interface ContactInfoProps {
  name: string
  role: string
  phone: string
}

const ContactInfo = ({ name, role, phone }: ContactInfoProps) => {
  return (
    <Stack
      w='300px'
      position='sticky'
      top='20px'
      alignSelf='flex-start'
      gap={4}
      py={3}
      px={5}
      borderRadius='md'
      bgColor='brand.white'
      boxShadow='md'
    >
      <UserCard name={name} role={role} avatar={<UserIcon />} />
      <Flex alignItems='center' justifyContent='center' gap={4} px={6} py={3} bgColor='brand.green' borderRadius='md'>
        <PhoneIcon />
        <Text color='white' fontSize='lg' fontWeight='bold'>
          {phone}
        </Text>
      </Flex>
    </Stack>
  )
}

export default memo(ContactInfo)
