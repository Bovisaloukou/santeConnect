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

export const pharmacyApi = {
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

  getAll: async (latitude?: number, longitude?: number): Promise<Pharmacie[]> => {
    try {
      const client = getApiClient();
      let url = '/api/pharmacies';
      
      if (latitude && longitude) {
        url += `?latitude=${latitude}&longitude=${longitude}`;
      }
      
      const response = await client.get<Pharmacie[]>(url);
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
  },

  update: async (uuid: string, data: Partial<Pharmacie>) => {
    try {
      const client = getApiClient();
      const response = await client.patch(`/api/pharmacies/${uuid}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (uuid: string) => {
    try {
      const client = getApiClient();
      const response = await client.delete(`/api/pharmacies/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 