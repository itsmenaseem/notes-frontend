import './App.css'
import Dashboard from './pages/Dashboard'
import SignupPage from './pages/Signup'
import SignupInvitation from './pages/SignupInvitation'
import LoginPage from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './pages/ProtectedRoute'


function App() {
 

  return (
    <Routes>
      <Route element={<LoginPage />} path="/" />
      <Route element={<SignupPage />} path="/signup" />
      <Route element={<SignupInvitation />} path="/invite" />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
    
  )
}

export default App
