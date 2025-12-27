import axios from 'axios'
import { API_CONFIG } from '../config/api.config'

// Centralized API configuration
export const API_BASE_URL = API_CONFIG.BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
})

// Request interceptor: Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle token expiration and errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Clear stored authentication data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

/**
 * Validates the current JWT token with the backend
 * @returns {Promise<boolean>} True if token is valid, false otherwise
 */
export const validateToken = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return false
    }
    
    const response = await api.get(API_CONFIG.ENDPOINTS.AUTH.VALIDATE)
    return response.status === 200
  } catch (error) {
    // Token is invalid or expired
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return false
  }
}

/**
 * Checks if token exists and is not expired (basic check)
 * Note: Full validation should be done with backend
 * @returns {boolean}
 */
export const hasValidToken = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return false
  }
  
  // Basic check: JWT tokens have 3 parts separated by dots
  const parts = token.split('.')
  if (parts.length !== 3) {
    return false
  }
  
  // Try to decode the payload to check expiration
  try {
    const payload = JSON.parse(atob(parts[1]))
    const exp = payload.exp * 1000 // Convert to milliseconds
    const now = Date.now()
    
    // Check if token is expired (with 5 minute buffer)
    return exp > (now + 5 * 60 * 1000)
  } catch (error) {
    return false
  }
}

export default api

