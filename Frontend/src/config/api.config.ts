export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 15000,
  CREDENTIALS: true,
  VERSION: '/api/v1'
} 