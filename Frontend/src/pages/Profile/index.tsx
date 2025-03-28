import { Button, Flex, Stack } from '@chakra-ui/react'
import { TextField } from '@components'

const Profile = () => {
  return (
    <Stack gap={6} mt={10} pr={10}>
      <Flex gap={4}>
        <TextField
          size='md'
          placeholder='Họ và tên'
          variant='flushed'
          borderBottom='1px solid'
          borderColor='brand.sliver'
        />
        <TextField
          size='md'
          placeholder='Địa chỉ'
          variant='flushed'
          borderBottom='1px solid'
          borderColor='brand.sliver'
        />
      </Flex>
      <Flex gap={4}>
        <TextField
          size='md'
          placeholder='Email'
          variant='flushed'
          borderBottom='1px solid'
          borderColor='brand.sliver'
        />
        <TextField
          size='md'
          placeholder='Số điện thoại'
          variant='flushed'
          borderBottom='1px solid'
          borderColor='brand.sliver'
        />
      </Flex>
      <Button maxW='200px' alignSelf='flex-end'>
        Lưu thay đổi
      </Button>
    </Stack>
  )
}

export default Profile
