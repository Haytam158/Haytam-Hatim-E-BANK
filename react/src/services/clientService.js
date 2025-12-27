import api from './api'
import { API_CONFIG } from '../config/api.config'

export const clientService = {
  async createClient(clientData) {
    const response = await api.post(API_CONFIG.ENDPOINTS.CLIENTS.CREATE, clientData)
    return response.data
  },

  async getCustomerById(id) {
    const response = await api.get(API_CONFIG.ENDPOINTS.CLIENTS.GET_BY_ID(id))
    return response.data
  },

  async getCustomerByUserId(userId) {
    const response = await api.get(API_CONFIG.ENDPOINTS.CLIENTS.GET_BY_USER_ID(userId))
    return response.data
  },

  async getUserDetails(userId) {
    const response = await api.get(API_CONFIG.ENDPOINTS.CLIENTS.GET_USER_DETAILS(userId))
    return response.data
  },

  async getAllCustomers() {
    const response = await api.get(API_CONFIG.ENDPOINTS.CLIENTS.GET_ALL)
    return response.data
  },

  /**
   * Get paginated list of customers
   * @param {Object} params - Pagination parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @param {string} params.sortBy - Sort field (default: 'id')
   * @param {string} params.sortDir - Sort direction 'ASC' or 'DESC' (default: 'ASC')
   * @returns {Promise} Paginated response with content, totalElements, totalPages, etc.
   */
  async getCustomersPaginated({ page = 0, size = 10, sortBy = 'id', sortDir = 'ASC' } = {}) {
    const response = await api.get(
      API_CONFIG.ENDPOINTS.CLIENTS.GET_ALL_PAGINATED(page, size, sortBy, sortDir)
    )
    return response.data
  },

  async deleteCustomerByUserId(userId) {
    const response = await api.delete(API_CONFIG.ENDPOINTS.CLIENTS.DELETE_BY_USER_ID(userId))
    return response.data
  }
}

