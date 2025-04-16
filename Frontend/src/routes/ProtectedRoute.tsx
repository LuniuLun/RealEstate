import { RoleName } from '@type/models'
import { Navigate, Outlet } from 'react-router-dom'

type ProtectedRouteProps = {
  isAllowed: boolean
  redirectPath?: string
  requiredRole?: RoleName[]
  userRoles?: RoleName
}

const ProtectedRoute = ({
  isAllowed,
  redirectPath = '/',
  requiredRole = [RoleName.CUSTOMER],
  userRoles
}: ProtectedRouteProps) => {
  if (!isAllowed || (requiredRole && !requiredRole.includes(userRoles!))) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
