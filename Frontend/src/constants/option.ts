import { ISelectOption } from '@components/CustomSelect'
import { PropertyStatus } from '@type/models'

export const SORT_USER_OPTION: ISelectOption<string>[] = [
  { value: 'firstName', label: 'Name' },
  { value: 'role', label: 'Role' },
  { value: 'createdAt', label: 'Created date' }
]

export const SORT_PROPERTY_OPTION: ISelectOption<string>[] = [
  { value: 'price', label: 'Mệnh giá' },
  { value: 'area', label: 'Diện tích' },
  { value: 'createdAt', label: 'Ngày giao dịch' }
]

export const SORT_TRANSACTION_OPTION: ISelectOption<string>[] = [
  { value: 'amount', label: 'Mệnh giá' },
  { value: 'createdAt', label: 'Ngày tạo' }
]

export const ROLE_OPTION: ISelectOption<string>[] = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'BROKER', label: 'BROKER' },
  { value: 'USER', label: 'USER' }
]

export const MODULE_PERMISSION = [
  {
    modulePermission: 'ADMIN',
    read: true,
    write: true,
    delete: true
  },
  {
    modulePermission: 'BROKER',
    read: true,
    write: false,
    delete: false
  },
  {
    modulePermission: 'USER',
    read: true,
    write: false,
    delete: false
  }
]

export const ADMIN_NAV_ITEMS = [
  { path: '', id: 'personal', title: 'Thông tin cá nhân' },
  { path: 'posts', id: 'posts', title: 'Bài viết' },
  { path: 'users', id: 'users', title: 'Tài khoản' },
  { path: 'dashboard', id: 'dashboard', title: 'Thống kê' }
]

export const USER_NAV_ITEMS = [
  { path: '', id: 'personal', title: 'Thông tin cá nhân' },
  { path: 'my-posts', id: 'myPosts', title: 'Bài viết của tôi' },
  { path: 'saved-posts', id: 'savedPosts', title: 'Bài viết đã lưu' },
  { path: 'upgrade', id: 'upgrade', title: 'Nâng cấp' },
  { path: 'transactions', id: 'transactions', title: 'Lịch sử giao dịch' }
]

export const ITEM_PER_PAGE = [5, 10, 12, 20, 50]

export const FILTER_OPTION = {
  status: [
    { value: PropertyStatus.PENDING, label: 'Chờ duyệt' },
    { value: PropertyStatus.APPROVAL, label: 'Đã duyệt' },
    { value: PropertyStatus.CANCELED, label: 'Đã đóng' },
    { value: PropertyStatus.ALL, label: 'Tất cả' }
  ],
  location: [{ value: '43', label: 'Đà Nẵng' }],
  category: [
    { value: 1, label: 'Đất' },
    { value: 2, label: 'Nhà' },
    { value: -1, label: 'Tất cả' }
  ],
  landType: [
    { value: 1, label: 'Đất thổ cư' },
    { value: 2, label: 'Đất dự án' },
    { value: 3, label: 'Đất công nghiệp' },
    { value: 4, label: 'Đất nông nghiệp' }
  ],
  houseType: [
    { value: 1, label: 'Nhà mặt phố, mặt tiền' },
    { value: 2, label: 'Nhà ngõ, hẻm' },
    { value: 3, label: 'Nhà biệt thự' },
    { value: 4, label: 'Nhà phố liền kề' }
  ],
  direction: [
    { value: 1, label: 'Bắc' },
    { value: 2, label: 'Nam' },
    { value: 3, label: 'Đông' },
    { value: 4, label: 'Tây' },
    { value: 5, label: 'Đông Bắc' },
    { value: 6, label: 'Đông Nam' },
    { value: 7, label: 'Tây Bắc' },
    { value: 8, label: 'Tây Nam' },
    { value: -1, label: 'Tất cả' }
  ],
  landCharacteristics: [
    { value: 1, label: 'Mặt tiền' },
    { value: 2, label: 'Nở hậu' },
    { value: 3, label: 'Một phần thổ cư' },
    { value: 4, label: 'Không thổ cư' },
    { value: 5, label: 'Hẻm xe hơi' },
    { value: 6, label: 'Toàn bộ thổ cư' }
  ],
  bedrooms: [
    { value: 1, label: '1 phòng ngủ' },
    { value: 2, label: '2 phòng ngủ' },
    { value: 3, label: '3 phòng ngủ' },
    { value: 4, label: '4 phòng ngủ' },
    { value: 5, label: '5 phòng ngủ' },
    { value: 6, label: '6 phòng ngủ' },
    { value: 7, label: '7 phòng ngủ' },
    { value: 8, label: '8 phòng ngủ' },
    { value: 9, label: '9 phòng ngủ' },
    { value: 10, label: '10 phòng ngủ' },
    { value: 11, label: 'Nhiều hơn 10 PN' }
  ],
  toilets: [
    { value: 1, label: '1 phòng vệ sinh' },
    { value: 2, label: '2 phòng vệ sinh' },
    { value: 3, label: '3 phòng vệ sinh' },
    { value: 4, label: '4 phòng vệ sinh' },
    { value: 5, label: '5 phòng vệ sinh' },
    { value: 6, label: '6 phòng vệ sinh' },
    { value: 7, label: 'Nhiều hơn 6 PVS' }
  ],
  houseCharacteristics: [
    { value: 1, label: 'Hẻm xe hơi' },
    { value: 2, label: 'Nhà mở rộng' },
    { value: 3, label: 'Nhà bị thu hẹp' },
    { value: 4, label: 'Nhà bị ảnh hưởng quy hoạch' },
    { value: 5, label: 'Nhà chưa hoàn thiện' },
    { value: 6, label: 'Nhà bị hư hỏng' },
    { value: 7, label: 'Đất phi dân cư' }
  ],
  furnishedStatus: [
    { value: 1, label: 'Nội thất cao cấp' },
    { value: 2, label: 'Đầy đủ nội thất' },
    { value: 3, label: 'Hoàn thiện cơ bản' },
    { value: 4, label: 'Bàn giao thô' }
  ],
  propertyLegalDocuments: [
    { value: 1, label: 'Đã có sổ' },
    { value: 2, label: 'Chờ cấp sổ' },
    { value: 3, label: 'Chưa có sổ' },
    { value: 4, label: 'Sổ chung' },
    { value: 5, label: 'Giấy viết tay' }
  ]
}
