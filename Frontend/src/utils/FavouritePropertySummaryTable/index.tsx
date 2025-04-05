import { IFavouriteProperty } from '@type/models'
import { FILTER_OPTION } from '@constants/option'
import { transformPriceUnit } from '@utils'

const favouritePropertySummaryTable = (favouriteProperty: IFavouriteProperty) => ({
  id: favouriteProperty.id,
  'Loại hình': FILTER_OPTION.category[favouriteProperty.property.category.id - 1].label,
  'Tiêu đề': favouriteProperty.property.title,
  'Vị trí': `${favouriteProperty.property.streetName}, ${favouriteProperty.property.wardName}, ${favouriteProperty.property.districtName}, ${favouriteProperty.property.region}`,
  'Diện tích': favouriteProperty.property.area,
  Giá: transformPriceUnit(favouriteProperty.property.price),
  'Trạng thái': favouriteProperty.property.status,
  'Cập nhập': new Date(favouriteProperty.property.updatedAt).toLocaleDateString()
})

export default favouritePropertySummaryTable
