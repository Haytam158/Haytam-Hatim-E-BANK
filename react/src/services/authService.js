import api from './api'
import { API_CONFIG } from '../config/api.config'

export const authService = {
  /**
   * Login user with username and password
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise} User data with JWT token
   */
  async login(username, password) {
    const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { username, password })
    return response.data
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string|null} roleName - Optional role name (AGENT_GUICHET, CLIENT)
   * @returns {Promise} User data with JWT token
   */
  async register(userData, roleName = null) {
    const url = roleName 
      ? API_CONFIG.ENDPOINTS.AUTH.REGISTER_WITH_ROLE(roleName)
      : API_CONFIG.ENDPOINTS.AUTH.REGISTER
    const response = await api.post(url, userData)
    return response.data
  },

  /**
   * Validate JWT token with backend
   * @returns {Promise} Validation response
   */
  async validateToken() {
    const response = await api.get(API_CONFIG.ENDPOINTS.AUTH.VALIDATE)
    return response.data
  },

  /**
   * Delete a user by username
   * @param {string} username 
   * @returns {Promise}
   */
  async deleteUser(username) {
    const response = await api.delete(API_CONFIG.ENDPOINTS.AUTH.DELETE_USER(username))
    return response.data
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise}
   */
  async changePassword(currentPassword, newPassword) {
    const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    })
    return response.data
  }
}

