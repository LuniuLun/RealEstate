import { IUser } from '@type/models'

const userSummaryTable = (user: IUser) => ({
  id: user.id,
  'Họ tên': user.fullName,
  Role: user.role.name,
  Email: user.email,
  'Số điện thoại': user.phone,
  'Ngày tạo': new Date(user.createdAt).toLocaleDateString(),
  'Trạng thái': user.isEnabled ? 'Hoạt động' : 'Đã khoá'
})

export default userSummaryTable
