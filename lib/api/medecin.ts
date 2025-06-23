import { getApiClient } from './config';
import { Medecin, MedecinResponse } from './types';

export const medecinApi = {
  create: async (medecinData: Medecin) => {
    try {
      const client = getApiClient();
      const response = await client.post<MedecinResponse>('/api/medecins', medecinData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (uuid: string, data: Partial<Medecin>) => {
    try {
      const client = getApiClient();
      const response = await client.patch<MedecinResponse>(`/api/medecins/${uuid}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 