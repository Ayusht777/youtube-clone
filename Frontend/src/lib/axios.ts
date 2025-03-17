import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { API_CONFIG } from '@/config/api.config';
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true // Enable sending cookies
});

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshTokenApi } = useAuthStore.getState();
        await refreshTokenApi();
        const { accessToken } = useAuthStore.getState();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;