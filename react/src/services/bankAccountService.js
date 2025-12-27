import api from './api'
import { API_CONFIG } from '../config/api.config'

export const bankAccountService = {
  async createBankAccount(accountData) {
    const response = await api.post(API_CONFIG.ENDPOINTS.ACCOUNTS.CREATE, accountData)
    return response.data
  },

  async getBankAccountById(id) {
    const response = await api.get(API_CONFIG.ENDPOINTS.ACCOUNTS.GET_BY_ID(id))
    return response.data
  },

  async getBankAccountByRib(rib) {
    const response = await api.get(API_CONFIG.ENDPOINTS.ACCOUNTS.GET_BY_RIB(rib))
    return response.data
  },

  async getBankAccountsByCustomer(customerId, page = 0, size = 10, sortBy = 'id', sortDir = 'ASC') {
    const response = await api.get(API_CONFIG.ENDPOINTS.ACCOUNTS.GET_BY_CUSTOMER(customerId, page, size, sortBy, sortDir))
    // Backend returns paginated response
    return {
      content: response.data.content || [],
      totalElements: response.data.totalElements || 0,
      totalPages: response.data.totalPages || 0,
      pageNumber: response.data.pageable?.pageNumber || page,
      pageSize: response.data.pageable?.pageSize || size,
    }
  },

  async getAllBankAccounts() {
    const response = await api.get(API_CONFIG.ENDPOINTS.ACCOUNTS.GET_ALL)
    return response.data
  },

  async updateAccountStatus(id, status) {
    const response = await api.patch(API_CONFIG.ENDPOINTS.ACCOUNTS.UPDATE_STATUS(id, status))
    return response.data
  },

  async deleteBankAccount(id) {
    const response = await api.delete(API_CONFIG.ENDPOINTS.ACCOUNTS.DELETE(id))
    return response.data
  }
}

