import { BASE_USER_NAV_ITEMS } from '@constants/option'
import { RoleName } from '@type/models'

const getUserNavItems = (roleValue: RoleName | undefined) => {
  const navItems = [...BASE_USER_NAV_ITEMS]
  if (roleValue && roleValue === RoleName.BROKER) {
    navItems.splice(4, 0, { path: 'forecast', id: 'forecast', title: 'Dự đoán' })
  }
  return navItems
}
export default getUserNavItems
