import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validateToken } from '../services/api'
import { useState, useEffect } from 'react'
import LoadingSpinner from './ui/LoadingSpinner'
import AlertModal from './ui/AlertModal'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth()
  const [validating, setValidating] = useState(false)
  const [showUnauthorizedAlert, setShowUnauthorizedAlert] = useState(false)
  const [redirectPath, setRedirectPath] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // Validate token when route changes (but not on every user change)
    const checkToken = async () => {
      // Only validate if authenticated and initial loading is complete
      if (isAuthenticated && user && !loading) {
        setValidating(true)
        try {
          const isValid = await validateToken()
          if (!isValid) {
            // Token is invalid, will be handled by AuthContext
            return
          }
        } catch (error) {
          console.error('Token validation error:', error)
        } finally {
          setValidating(false)
        }
      }
    }

    // Only validate on route change, not on user changes
    // Skip validation if still loading initial auth
    if (!loading) {
      checkToken()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]) // Only validate on route change

  // Check role-based access and show alert if unauthorized
  useEffect(() => {
    if (allowedRoles.length > 0 && isAuthenticated && user && !loading && !validating) {
      const hasAllowedRole = allowedRoles.some(role => 
        user?.roles?.includes(role)
      )
      
      if (!hasAllowedRole && !showUnauthorizedAlert) {
        setShowUnauthorizedAlert(true)
        if (user?.roles?.includes('AGENT_GUICHET')) {
          setRedirectPath('/agent')
        } else if (user?.roles?.includes('CLIENT')) {
          setRedirectPath('/client')
        } else {
          setRedirectPath('/login')
        }
      }
    }
  }, [allowedRoles, isAuthenticated, user, loading, validating, showUnauthorizedAlert])

  const handleCloseAlert = () => {
    setShowUnauthorizedAlert(false)
    // Redirect after alert is closed
    setTimeout(() => {
      if (redirectPath) {
        window.location.href = redirectPath
      }
    }, 300)
  }

  // Show loading while checking authentication
  if (loading || validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Check role-based access
  if (allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(role => 
      user?.roles?.includes(role)
    )
    
    if (!hasAllowedRole) {
      return (
        <>
          <AlertModal
            message="Vous n'avez pas le droit d'accéder à cette fonctionnalité. Veuillez contacter votre administrateur."
            isOpen={showUnauthorizedAlert}
            onClose={handleCloseAlert}
            duration={0} // Don't auto-close, user must click
          />
        </>
      )
    }
  }

  return children
}
