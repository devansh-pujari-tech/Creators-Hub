//creaters hub
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import RegistrationForm from './components/RegistrationForm'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import CreatePost from './components/CreatePost'
import EditPost from './components/EditPost'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import LearningPage from './components/LearningPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          {/* Toast Container for notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <Routes>
            {/* Public Routes - Only accessible to unauthenticated users */}
            <Route path="/register" element={<PublicRoute element={<RegistrationForm />} />} />
            <Route path="/login" element={<PublicRoute element={<LoginForm />} />} />
            
            {/* Protected Routes - Only accessible to authenticated users */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/create-post" element={<ProtectedRoute element={<CreatePost />} />} />
            <Route path="/edit-post/:postId" element={<ProtectedRoute element={<EditPost />} />} />
            <Route path="/learning" element={<ProtectedRoute element={<LearningPage />} />} />
            
            {/* Default route - Redirects to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App