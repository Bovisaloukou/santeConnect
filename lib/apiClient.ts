import axios from 'axios';
import { API_CONFIG } from './config';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';

interface ExtendedSession extends Omit<Session, 'user'> {
  user: Session['user'] & {
    accessToken?: string;
    id?: string;
    is2FAEnabled?: boolean;
    is2FAVerified?: boolean;
  };
}

// Configuration de base pour les clients Axios
const baseConfig = {
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

// Instance Axios pour l'authentification (sans intercepteur)
const authAxios = axios.create(baseConfig);

// Instance Axios pour le navigateur
const browserApiClient = axios.create(baseConfig);

// Instance Axios pour le serveur
const serverApiClient = axios.create(baseConfig);

// Intercepteur pour le client navigateur
browserApiClient.interceptors.request.use(async (config) => {
  const session = await getSession() as ExtendedSession;
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

// Intercepteur pour le client serveur
serverApiClient.interceptors.request.use(async (config) => {
  const session = await auth() as ExtendedSession;
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

// Factory function pour obtenir le bon client selon le contexte
export const getApiClient = () => {
  if (typeof window === 'undefined') {
    return serverApiClient;
  }
  return browserApiClient;
};

// Intercepteur pour gérer les erreurs (commun aux deux clients)
const errorInterceptor = (error: any) => Promise.reject(error);
browserApiClient.interceptors.response.use((response) => response, errorInterceptor);
serverApiClient.interceptors.response.use((response) => response, errorInterceptor);

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
  verify2FA: async (userId: string, otp: string) => {
    const client = getApiClient();
    const response = await client.post(`/api/auth/2fa/verify/${userId}`, {
      otp
    });
    return response.data;
  }
};

// Interface pour les données du profil utilisateur
export interface UserProfile {
  uuid: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  birthDate: string;
  contact: string;
  isEnabled: boolean;
  is2FAEnabled: boolean;
}

export const userApi = {
  getProfile: async (userId: string) => {
    const client = getApiClient();
    const response = await client.get(`/api/users/${userId}`);
    return response.data as UserProfile;
  },
  updateProfile: async (userId: string, profileData: Partial<UserProfile>) => {
    const client = getApiClient();
    const response = await client.patch(`/api/users/${userId}`, profileData);
    return response.data;
  }
};

// Exporter le client par défaut pour la compatibilité
export default getApiClient(); 