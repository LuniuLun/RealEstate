import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import { authStore } from '@stores'
import Home from '@pages/Home/Home'
import Dashboard from '@pages/Dashboard'
import Users from '@pages/Users'
import ListingProperty from '@pages/ListingProperty'
import { AđminLayout, DefaultLayout } from '@layout'

function App() {
  const { user } = authStore()

  return (
    <Routes>
      <Route path='/' element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path='property-listings' element={<ListingProperty />} />
      </Route>
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
