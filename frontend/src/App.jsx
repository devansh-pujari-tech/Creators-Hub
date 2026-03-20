//creaters hub
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import RegistrationForm from './components/RegistrationForm'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes - Only accessible to unauthenticated users */}
            <Route path="/register" element={<PublicRoute element={<RegistrationForm />} />} />
            <Route path="/login" element={<PublicRoute element={<LoginForm />} />} />
            
            {/* Protected Routes - Only accessible to authenticated users */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            
            {/* Default route - Redirects to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App