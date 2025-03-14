import { Navigate, Outlet } from 'react-router-dom'

type ProtectedRouteProps = {
  isAllowed: boolean
  redirectPath?: string
  requiredRole?: string
  userRoles?: string[]
}

const ProtectedRoute = ({ isAllowed, redirectPath = '/', requiredRole, userRoles = [] }: ProtectedRouteProps) => {
  if (!isAllowed || (requiredRole && !userRoles.includes(requiredRole))) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
