/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

export const API_CONFIG = {
  // Use relative URL for Docker compatibility (nginx proxies /api to backend)
  // In development, use full URL: 'http://localhost:8080/api'
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 10000, // 10 seconds
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REGISTER_WITH_ROLE: (roleName) => `/auth/register/${roleName}`,
      VALIDATE: '/auth/validate',
      DELETE_USER: (username) => `/auth/users/${username}`,
      CHANGE_PASSWORD: '/auth/change-password',
    },
    CLIENTS: {
      CREATE: '/clients/create-client',
      GET_BY_ID: (id) => `/clients/${id}`,
      GET_BY_USER_ID: (userId) => `/clients/user/${userId}`,
      GET_USER_DETAILS: (userId) => `/clients/user/${userId}/details`,
      GET_ALL: '/clients',
      GET_ALL_PAGINATED: (page = 0, size = 10, sortBy = 'id', sortDir = 'ASC') => 
        `/clients/clients?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      DELETE_BY_USER_ID: (userId) => `/clients/user/${userId}`,
    },
    ACCOUNTS: {
      CREATE: '/accounts',
      GET_BY_ID: (id) => `/accounts/${id}`,
      GET_BY_RIB: (rib) => `/accounts/rib/${rib}`,
      GET_BY_CUSTOMER: (customerId, page = 0, size = 10, sortBy = 'id', sortDir = 'ASC') => 
        `/accounts/customer/${customerId}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      GET_ALL: '/accounts',
      UPDATE_STATUS: (id, status) => `/accounts/${id}/status?status=${status}`,
      DELETE: (id) => `/accounts/${id}`,
    },
    TRANSACTIONS: {
      GET_BY_ACCOUNT: (accountId, page = 0, size = 10) => 
        `/transactions/account/${accountId}?page=${page}&size=${size}`,
      GET_BY_RIB: (rib, page = 0, size = 10) => 
        `/transactions/rib/${rib}?page=${page}&size=${size}`,
      CREATE_TRANSFER: '/transactions/transfer',
    },
  },
}

