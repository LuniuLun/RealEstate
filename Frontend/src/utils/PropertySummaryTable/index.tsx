import { IProperty } from '@type/models' // Import IProperty interface
import { FILTER_OPTION } from '@constants/option'
import { transformPriceUnit } from '@utils'

const propertySummaryTable = (property: IProperty) => ({
  id: property.id,
  'Loại hình': FILTER_OPTION.category[property.category.id - 1].label,
  'Tiêu đề': property.title,
  'Vị trí': `${property.streetName}, ${property.wardName}, ${property.districtName}, ${property.region}`,
  'Diện tích': property.area,
  Giá: transformPriceUnit(property.price),
  'Trạng thái': property.status,
  'Cập nhập': new Date(property.createdAt).toLocaleDateString()
})

export default propertySummaryTable
