import { SelectOption } from '@components/CustomSelect'

export const SORT_USER_OPTION: SelectOption<string>[] = [
  { value: 'firstName', label: 'Name' },
  { value: 'role', label: 'Role' },
  { value: 'createdDate', label: 'Created date' }
]

export const SORT_PROPERTY_OPTION: SelectOption<string>[] = [
  { value: 'address', label: 'Địa chỉ' },
  { value: 'createdDate', label: 'Ngày tạo' }
]

export const ROLE_OPTION: SelectOption<string>[] = [
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

export const NAV_ITEMS = [
  { path: '/', id: 'dashboard', title: 'Dashboard' },
  { path: '/users', id: 'users', title: 'Users' },
  { path: '/posts', id: 'posts', title: 'Posts' },
  { path: '/', id: 'setting', title: 'Setting' }
]

export const ITEM_PER_PAGE = [5, 10, 15, 20, 50]

export const FILTER_OPTION = {
  location: [{ value: '43', label: 'Đà Nẵng' }],
  category: [
    { value: 1, label: 'Đất' },
    { value: 2, label: 'Nhà' }
  ],
  landType: [
    { value: 1, label: 'Đất thổ cư' },
    { value: 2, label: 'Đất dự án' },
    { value: 3, label: 'Đất công nghiệp' },
    { value: 4, label: 'Đất nông nghiệp' }
  ],
  direction: [
    { value: 0, label: 'Bắc' },
    { value: 1, label: 'Nam' },
    { value: 2, label: 'Đông' },
    { value: 3, label: 'Tây' },
    { value: 4, label: 'Đông Bắc' },
    { value: 5, label: 'Đông Nam' },
    { value: 6, label: 'Tây Bắc' },
    { value: 7, label: 'Tây Nam' }
  ],
  features: [
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
    { value: 11, label: 'Nhiều hơn 10 phòng ngủ' }
  ],
  bathrooms: [
    { value: 1, label: '1 phòng vệ sinh' },
    { value: 2, label: '2 phòng vệ sinh' },
    { value: 3, label: '3 phòng vệ sinh' },
    { value: 4, label: '4 phòng vệ sinh' },
    { value: 5, label: '5 phòng vệ sinh' },
    { value: 6, label: '6 phòng vệ sinh' },
    { value: 7, label: 'Nhiều hơn 6 phòng vệ sinh' }
  ],
  houseFeatures: [
    { value: 1, label: 'Hẻm xe hơi' },
    { value: 2, label: 'Nhà mở rộng' },
    { value: 3, label: 'Nhà bị thu hẹp' },
    { value: 4, label: 'Nhà bị ảnh hưởng quy hoạch' },
    { value: 5, label: 'Nhà chưa hoàn thiện' },
    { value: 6, label: 'Nhà bị hư hỏng' },
    { value: 7, label: 'Đất phi dân cư' }
  ]
}
