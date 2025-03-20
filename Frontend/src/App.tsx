import { Routes, Route } from 'react-router-dom'
import { authStore } from '@stores'
import { AđminLayout, DefaultLayout } from '@layout'
import ProtectedRoute from './routes/ProtectedRoute'
import Home from '@pages/Home/Home'
import Dashboard from '@pages/Dashboard'
import Users from '@pages/Users'
import ListingProperty from '@pages/ListingProperty'
import Register from '@pages/Register'

function App() {
  const { user } = authStore()

  return (
    <Routes>
      <Route path='/' element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path='property-listings' element={<ListingProperty />} />
      </Route>
      <Route path='register' element={<Register />} />
      <Route
        element={<ProtectedRoute isAllowed={!!user} userRoles={user?.roles} requiredRole='admin' redirectPath='/' />}
      >
        <Route element={<AđminLayout />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='users' element={<Users />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
