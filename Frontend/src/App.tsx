import { Routes, Route } from 'react-router-dom'
import { authStore } from '@stores'
import { DefaultLayout, PersonalLayout } from '@layout'
import { RoleName } from '@type/models'
import ProtectedRoute from './routes/ProtectedRoute'
import Home from '@pages/Home/Home'
import Dashboard from '@pages/Dashboard'
import Users from '@pages/Users'
import ListingProperty from '@pages/ListingProperty'
import Register from '@pages/Register'
import Login from '@pages/Login'
import DetailPost from '@pages/DetailPost'
import PropertyForm from '@pages/PropertyForm'
import Profile from '@pages/Profile'
import MyPosts from '@pages/MyPosts'
import Upgrade from '@pages/Upgrade'
import TransactionHistory from '@pages/TransactionHistory'
import AllPosts from '@pages/AllPosts'
import SavedPost from '@pages/SavedPosts'
import ForecastLand from '@pages/ForecastLand'

function App() {
  const token = authStore((state) => state.token)

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
              userRoles={token?.user?.role?.name}
              requiredRole={[RoleName.CUSTOMER, RoleName.BROKER]}
              redirectPath='/login'
            />
          }
        >
          <Route path='new-property' element={<PropertyForm />} />
          <Route path='my-posts/update/:id' element={<PropertyForm />} />
          <Route path='personal/upgrade' element={<Upgrade />} />
        </Route>
      </Route>
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />} />
      <Route
        element={
          <ProtectedRoute
            isAllowed={!!token}
            userRoles={token?.user?.role?.name}
            requiredRole={[RoleName.CUSTOMER, RoleName.BROKER, RoleName.ADMIN]}
            redirectPath='/'
          />
        }
      >
        <Route path='personal' element={<PersonalLayout />}>
          <Route index element={<Profile />} />
          <Route path='my-posts' element={<MyPosts />} />
          <Route path='transactions' element={<TransactionHistory />} />
          <Route path='saved-posts' element={<SavedPost />} />
          <Route path='forecast' element={<ForecastLand />} />
          <Route
            element={
              <ProtectedRoute
                isAllowed={!!token}
                userRoles={token?.user?.role?.name}
                requiredRole={[RoleName.ADMIN]}
                redirectPath='/'
              />
            }
          >
            <Route path='posts' element={<AllPosts />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='users' element={<Users />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
