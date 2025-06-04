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

  getAll: async () => {
    try {
      const client = getApiClient();
      const response = await client.get('/api/health-centers');
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
  }
}; 