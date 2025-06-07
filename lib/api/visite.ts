import { getApiClient } from './config';

export interface Visite {
  date_visite: string;
  motif: string;
  anamnese: string;
  antecedants_medicaux: string;
  enquete_socioculturelle: string;
  dossier_uuid: string;
}

export interface VisiteResponse {
  message: string;
  data: Visite;
}

export const visiteApi = {
  create: async (visiteData: Visite) => {
    try {
      const client = getApiClient();
      const response = await client.post('/api/visites', visiteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    try {
      const client = getApiClient();
      const response = await client.get('/api/visites');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (uuid: string) => {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/visites/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (uuid: string, data: Partial<Visite>) => {
    try {
      const client = getApiClient();
      const response = await client.patch(`/api/visites/${uuid}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 