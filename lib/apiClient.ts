import axios from 'axios';
import { API_CONFIG } from './config';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
      link: `${window.location.origin}/reset-password`
    });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
    });
    return response.data;
  },
  enable2FA: async (userId: string) => {
    const response = await apiClient.post(`/api/auth/2fa/enable/${userId}`);
    return response.data;
  },
  disable2FA: async (userId: string) => {
    const response = await apiClient.post(`/api/auth/2fa/disable/${userId}`);
    return response.data;
  }
};

export default apiClient; 