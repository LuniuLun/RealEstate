import { Routes, Route } from 'react-router-dom'
import { authStore } from '@stores'
import { AdminLayout, DefaultLayout, PersonalLayout } from '@layout'
import { RoleName } from '@type/models'
import ProtectedRoute from './routes/ProtectedRoute'
import Home from '@pages/Home/Home'
import Dashboard from '@pages/Dashboard'
import Users from '@pages/Users'
import ListingProperty from '@pages/ListingProperty'
import Register from '@pages/Register'
import Login from '@pages/Login'
import DetailPost from '@pages/DetailPost'
import NewProperty from '@pages/NewProperty'
import Profile from '@pages/Profile'

function App() {
  const { token } = authStore()

  return (
    <Routes>
      <Route path='/' element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path='property-listings' element={<ListingProperty />} />
        <Route path='property-detail/:id' element={<DetailPost />} />
        <Route
          element={
            <ProtectedRoute
              isAllowed={!!token}
              userRoles={token?.user?.role?.name || RoleName.CUSTOMER}
              requiredRole={RoleName.CUSTOMER}
              redirectPath='/'
            />
          }
        >
          <Route path='new-property' element={<NewProperty />} />
        </Route>
      </Route>
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />} />
      <Route
        element={
          <ProtectedRoute
            isAllowed={!!token}
            userRoles={token?.user?.role?.name || RoleName.CUSTOMER}
            requiredRole={RoleName.CUSTOMER || RoleName.BROKER}
            redirectPath='/'
          />
        }
      >
        <Route path='personal' element={<PersonalLayout />}>
          <Route index element={<Profile />} />
        </Route>
      </Route>
      <Route
        element={
          <ProtectedRoute
            isAllowed={!!token}
            userRoles={token?.user?.role?.name || RoleName.CUSTOMER}
            requiredRole={RoleName.ADMIN}
            redirectPath='/'
          />
        }
      >
        <Route element={<AdminLayout />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='users' element={<Users />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
