import axios from 'axios';
import { API_CONFIG } from './config';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface ExtendedSession extends Omit<Session, 'user'> {
  user: Session['user'] & {
    accessToken?: string;
    id?: string;
    is2FAEnabled?: boolean;
    is2FAVerified?: boolean;
  };
}

// Instance Axios pour l'authentification (sans intercepteur)
const authAxios = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Instance Axios pour les requêtes authentifiées
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur pour ajouter le token d'autorisation
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession() as ExtendedSession;
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await authAxios.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  forgotPassword: async (email: string) => {
    const response = await authAxios.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
      link: `${window.location.origin}/reset-password`
    });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    const response = await authAxios.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
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
  },
  verify2FA: async (userId: string, otp: string) => {
    const response = await apiClient.post(`/api/auth/2fa/verify/${userId}`, {
      otp
    });
    return response.data;
  }
};

export default apiClient; 