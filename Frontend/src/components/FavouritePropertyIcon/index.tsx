import { HeartIcon } from '@assets/icons'
import { IconButton } from '@chakra-ui/react'
import { useCustomToast, useGetFavouriteProperty, useToggleFavouriteProperty } from '@hooks'
import useAuthStore from '@stores/Authentication'
import colors from '@styles/variables/colors'
import { memo } from 'react'

export interface IFavouritePropertyIcon {
  propertyId: number
}

const FavouritePropertyIcon = ({ propertyId }: IFavouritePropertyIcon) => {
  const { token, favouritePropertyIds } = useAuthStore()
  const { infinitePropertyQueryKey } = useGetFavouriteProperty()
  const { toggleFavouritePropertyMutation } = useToggleFavouriteProperty(infinitePropertyQueryKey)
  const { showToast } = useCustomToast()

  const handleOnClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!token) {
      showToast({ status: 'error', title: 'Không thể xác định người dùng' })
      return
    }

    if (!propertyId) {
      showToast({ status: 'error', title: 'Bài viết không tồn tại' })
      return
    }

    toggleFavouritePropertyMutation.mutate({ userId: token.user.id, propertyId })
  }

  const isFavourite = favouritePropertyIds.includes(propertyId)

  return (
    <IconButton
      isLoading={toggleFavouritePropertyMutation.isPending}
      icon={<HeartIcon fill={isFavourite ? colors.brand.red : colors.brand.black} />}
      onClick={handleOnClick}
      aria-label='toggle-favourite'
      bg='brand.white'
      borderRadius='full'
      height='30px'
      sx={{
        svg: {
          fill: isFavourite ? colors.brand.red : 'white'
        }
      }}
    />
  )
}

export default memo(FavouritePropertyIcon)
