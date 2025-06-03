import axios from 'axios';
import { API_CONFIG } from '../config';
import { getSession } from 'next-auth/react';
import type { ExtendedSession } from './types';
import { getToken } from 'next-auth/jwt';

// Configuration de base pour les clients Axios
const baseConfig = {
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

// Instance Axios pour l'authentification (sans intercepteur)
export const authAxios = axios.create(baseConfig);

// Instance Axios pour le navigateur
export const browserApiClient = axios.create(baseConfig);

// Instance Axios pour le serveur
export const serverApiClient = axios.create(baseConfig);

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
  try {
    // Récupérer le token JWT avec les cookies
    const token = await getToken({ 
      req: {
        headers: {
          cookie: config.headers.cookie
        }
      } as any,
      secret: process.env.AUTH_SECRET
    });

    // Utiliser l'accessToken du token JWT
    if (token && (token as any).accessToken) {
      config.headers.Authorization = `Bearer ${(token as any).accessToken}`;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
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