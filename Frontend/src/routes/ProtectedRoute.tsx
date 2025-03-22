import { RoleName } from '@type/models'
import { Navigate, Outlet } from 'react-router-dom'

type ProtectedRouteProps = {
  isAllowed: boolean
  redirectPath?: string
  requiredRole?: string
  userRoles?: RoleName
}

const ProtectedRoute = ({
  isAllowed,
  redirectPath = '/',
  requiredRole,
  userRoles = RoleName.CUSTOMER
}: ProtectedRouteProps) => {
  if (!isAllowed || (requiredRole && !userRoles.includes(requiredRole))) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
