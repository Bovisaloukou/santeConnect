import { getApiClient } from './config';
import { Pharmacie, PharmacieResponse } from './types';

interface PharmacyData {
  name: string;
  adress: string;
  telephone: string;
  services: string[];
  horaires: string[];
  userUuid: string;
}

const pharmacyApi = {
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
      const response = await client.post('/api/pharmacies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAll: async (): Promise<PharmacieResponse> => {
    try {
      const client = getApiClient();
      const response = await client.get<PharmacieResponse>('/api/pharmacies');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (uuid: string) => {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/pharmacies/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default pharmacyApi; 