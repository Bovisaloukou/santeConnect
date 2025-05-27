if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
}

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
      // Autres endpoints d'authentification à ajouter si nécessaire
    },
    // Autres catégories d'endpoints à ajouter si nécessaire
  }
}; 