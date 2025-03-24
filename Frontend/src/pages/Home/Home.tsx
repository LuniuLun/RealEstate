import { HouseIcon, PostIcon, TrustingIcon } from '@assets/icons'
import { Box, Flex, Stack } from '@chakra-ui/react'
import { InfoGroup } from '@components'

const Home = () => {
  return (
    <Stack spacing={8} px={6} py={10} justifyContent='center' alignItems='center' paddingY={10} gap={10}>
      <InfoGroup
        size='lg'
        heading='Tại sao nêm mua bán bất động sách tại JustHome!'
        description='JustHome kết nối bạn với những bất động sản tốt nhất – vị trí đẹp, giá tốt, sinh lời cao.'
        alignItems='center'
        textAlign='center'
      />
      <Flex gap={6} flexWrap='wrap' justifyContent='center'>
        <Box
          flex={1}
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          gap={4}
          maxW='400px'
        >
          <PostIcon />
          <InfoGroup
            size='md'
            heading='Bất Động Sản Cao Cấp'
            description='Sở hữu không gian sống đẳng cấp với đầy đủ tiện ích hiện đại.'
            alignItems='center'
            textAlign='center'
          />
        </Box>
        <Box
          flex={1}
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          gap={4}
          maxW='400px'
        >
          <HouseIcon />
          <InfoGroup
            size='md'
            heading='Vị Trí Đẹp - Giá Tốt'
            description='Mỗi ngôi nhà đều được chọn lọc kỹ lưỡng để mang đến giá trị tốt nhất.'
            alignItems='center'
            textAlign='center'
          />
        </Box>
        <Box
          flex={1}
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          gap={4}
          maxW='400px'
        >
          <TrustingIcon />
          <InfoGroup
            size='md'
            heading='Đầu Tư Sinh Lời'
            description='Cơ hội đầu tư bền vững, giúp bạn an cư và phát triển tài chính lâu dài.'
            alignItems='center'
            textAlign='center'
          />
        </Box>
      </Flex>
    </Stack>
  )
}

export default Home
