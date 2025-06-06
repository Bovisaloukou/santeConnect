import { getApiClient } from './config';
import { Medicament } from './types';

interface MedicamentCreate {
  name: string;
  description: string;
  prix: number;
  surOrdonnance: boolean;
  pharmacieId: string;
}

export const medicamentsApi = {
  create: async (data: MedicamentCreate) => {
    try {
      const client = getApiClient();
      const response = await client.post('/api/medicaments', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAll: async (): Promise<Medicament[]> => {
    try {
      const client = getApiClient();
      const response = await client.get('/api/medicaments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (uuid: string): Promise<Medicament> => {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/medicaments/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (uuid: string, data: Partial<Medicament>) => {
    try {
      const client = getApiClient();
      const response = await client.patch(`/api/medicaments/${uuid}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (uuid: string) => {
    try {
      const client = getApiClient();
      const response = await client.delete(`/api/medicaments/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByPharmacyId: async (pharmacyUuid: string): Promise<Medicament[]> => {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/pharmacies/${pharmacyUuid}`);
      return response.data.data.medicaments;
    } catch (error) {
      throw error;
    }
  }
}; 