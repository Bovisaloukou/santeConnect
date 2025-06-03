import { API_CONFIG } from '../config';
import { authAxios, getApiClient } from './config';

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

  signup: async (userData: {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    password: string;
    birthDate: string;
    contact: string;
  }) => {
    try {
      const response = await authAxios.post(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, userData);
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
    const client = getApiClient();
    const response = await client.post(`/api/auth/2fa/enable/${userId}`);
    return response.data;
  },

  disable2FA: async (userId: string) => {
    const client = getApiClient();
    const response = await client.post(`/api/auth/2fa/disable/${userId}`);
    return response.data;
  },

  verify2FA: async (userId: string, otp: string): Promise<boolean> => {
    try {
      const client = await getApiClient();
      const response = await client.post(`/auth/verify-2fa`, { userId, otp });
      return response.status === 200;
    } catch (error) {
      console.error("Erreur lors de la vérification 2FA:", error);
      return false;
    }
  }
}; 