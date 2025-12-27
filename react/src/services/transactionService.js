import api from './api'
import { API_CONFIG } from '../config/api.config'

export const transactionService = {
  /**
   * Get transactions for a bank account
   * @param {number} accountId - Bank account ID
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise} Paginated transactions
   */
  async getTransactionsByAccount(accountId, page = 0, size = 10) {
    const response = await api.get(
      API_CONFIG.ENDPOINTS.TRANSACTIONS.GET_BY_ACCOUNT(accountId, page, size)
    )
    return response.data
  },

  /**
   * Create a new transfer
   * @param {Object} transferData - Transfer data
   * @param {string} transferData.sourceRib - Source account RIB
   * @param {string} transferData.destinationRib - Destination account RIB
   * @param {number} transferData.amount - Transfer amount
   * @param {string} transferData.motif - Transfer reason/motif
   * @returns {Promise} Created transfer
   */
  async createTransfer(transferData) {
    const response = await api.post(API_CONFIG.ENDPOINTS.TRANSACTIONS.CREATE_TRANSFER, transferData)
    return response.data
  },

  /**
   * Get transactions by RIB
   * @param {string} rib - Bank account RIB
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise} Paginated transactions
   */
  async getTransactionsByRib(rib, page = 0, size = 10) {
    const response = await api.get(
      API_CONFIG.ENDPOINTS.TRANSACTIONS.GET_BY_RIB(rib, page, size)
    )
    return response.data
  }
}

