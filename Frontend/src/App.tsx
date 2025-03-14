import { Routes, Route } from 'react-router-dom'
import DefaultLayout from '@layout'
import { authStore } from '@stores'
import { Dashboard, Home, Users } from '@pages'
import ProtectedRoute from '@routes/ProtectedRoute'

function App() {
  const { user } = authStore()

  return (
    <Routes>
      <Route path='/' element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route
          element={<ProtectedRoute isAllowed={!!user} userRoles={user?.roles} requiredRole='ADMIN' redirectPath='/' />}
        >
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='users' element={<Users />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
