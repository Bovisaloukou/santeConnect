import { getApiClient } from './config';
import { Ordonnance, OrdonnanceData, OrdonnanceResponse } from './types';

export const ordonnanceApi = {
  create: async (data: OrdonnanceData): Promise<OrdonnanceResponse> => {
    try {
      const client = getApiClient();
      const response = await client.post<OrdonnanceResponse>('/api/ordonnances', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAll: async (): Promise<OrdonnanceResponse> => {
    try {
      const client = getApiClient();
      const response = await client.get<OrdonnanceResponse>('/api/ordonnances');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (uuid: string): Promise<OrdonnanceResponse> => {
    try {
      const client = getApiClient();
      const response = await client.get<OrdonnanceResponse>(`/api/ordonnances/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (uuid: string, data: Partial<Ordonnance>): Promise<OrdonnanceResponse> => {
    try {
      const client = getApiClient();
      const response = await client.patch<OrdonnanceResponse>(`/api/ordonnances/${uuid}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (uuid: string): Promise<OrdonnanceResponse> => {
    try {
      const client = getApiClient();
      const response = await client.delete<OrdonnanceResponse>(`/api/ordonnances/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByConsultation: async (consultationUuid: string): Promise<OrdonnanceResponse> => {
    try {
      const client = getApiClient();
      const response = await client.get<OrdonnanceResponse>(`/api/ordonnances/consultation/${consultationUuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByMedecin: async (medecinUuid: string): Promise<OrdonnanceResponse> => {
    try {
      const client = getApiClient();
      const response = await client.get<OrdonnanceResponse>(`/api/ordonnances/medecin/${medecinUuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
