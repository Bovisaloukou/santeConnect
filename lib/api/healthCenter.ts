import { getApiClient } from './config';
import { HealthCenter } from './types';

export const healthCenterApi = {
  register: async (formData: FormData, files: File[]) => {
    try {
      // Ajouter les fichiers avec les bonnes clés
      const fileKeys = [
        'extraitRegistreDeCommerce',
        'attestationImatriculation',
        'annonceLegale',
        'declaration_etablissement_de_entreprise',
        'carteProfessionnelle'
      ];

      files.forEach((file, index) => {
        if (index < fileKeys.length) {
          formData.append(fileKeys[index], file);
        }
      });

      const client = getApiClient();
      const response = await client.post('/api/health-centers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAll: async (latitude?: number, longitude?: number) => {
    try {
      const client = getApiClient();
      let url = '/api/health-centers';
      
      // Ajouter les paramètres de géolocalisation si disponibles
      if (latitude !== undefined && longitude !== undefined) {
        url += `?latitude=${latitude}&longitude=${longitude}`;
      }
      
      const response = await client.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (uuid: string) => {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/health-centers/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (uuid: string, data: Partial<HealthCenter>) => {
    try {
      const client = getApiClient();
      const response = await client.patch(`/api/health-centers/${uuid}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 