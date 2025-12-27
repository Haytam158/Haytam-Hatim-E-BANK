import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { validateToken, hasValidToken } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initial auth check - only runs once on mount
  useEffect(() => {
    // Validate token on app load
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          // First check if token format is valid
          if (!hasValidToken()) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setLoading(false)
            return
          }

          // Validate token with backend
          const isValid = await validateToken()
          
          if (isValid) {
            const parsedUser = JSON.parse(userData)
            setUser(parsedUser)
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        } catch (error) {
          console.error('Error validating token:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, []) // Empty dependency array - only run once on mount

  // Periodic token validation - separate effect that runs independently
  useEffect(() => {
    if (!user) return // Don't set up interval if no user

    const validationInterval = setInterval(async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setUser(null)
        return
      }

      const isValid = await validateToken()
      if (!isValid) {
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(validationInterval)
  }, [user]) // Only re-run when user changes (login/logout)

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password)
      const userData = {
        username: response.username,
        roles: response.roles || [],
        userId: response.userId,
        token: response.jwtToken
      }
      
      localStorage.setItem('token', response.jwtToken)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true, data: response }
    } catch (error) {
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Login ou mot de passe erronés'
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData, roleName = null) => {
    try {
      const response = await authService.register(userData, roleName)
      const newUser = {
        username: response.username,
        roles: response.roles || [],
        userId: response.userId,
        token: response.jwtToken
      }
      
      localStorage.setItem('token', response.jwtToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

