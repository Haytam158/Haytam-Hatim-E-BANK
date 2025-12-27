import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import AgentDashboard from './pages/AgentDashboard'
import ClientDashboard from './pages/ClientDashboard'
import Profile from './pages/Profile'
import Layout from './components/Layout'

// Component to redirect authenticated users away from login page
function PublicRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // If user is already authenticated, redirect to their dashboard
  if (isAuthenticated) {
    if (user?.roles?.includes('AGENT_GUICHET')) {
      return <Navigate to="/agent" replace />
    } else if (user?.roles?.includes('CLIENT')) {
      return <Navigate to="/client" replace />
    }
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public route - Login page (only accessible when not authenticated) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected routes - Require authentication */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/*"
        element={
          <ProtectedRoute allowedRoles={['AGENT_GUICHET']}>
            <Layout>
              <AgentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/*"
        element={
          <ProtectedRoute allowedRoles={['CLIENT']}>
            <Layout>
              <ClientDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default route - redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
