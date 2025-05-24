if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
}

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      // Autres endpoints d'authentification à ajouter si nécessaire
    },
    // Autres catégories d'endpoints à ajouter si nécessaire
  }
}; 