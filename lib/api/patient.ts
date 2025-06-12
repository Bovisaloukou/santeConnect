import { getApiClient } from './config';
import { Patient, PatientResponse } from './types';

interface PatientData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  adresse: string;
  telephone: string;
  email: string;
  numeroSecuriteSociale: string;
  userUuid: string;
}

export const patientApi = {
  create: async (data: PatientData | { service_uuid: string }) => {
    try {
      const client = getApiClient();
      const response = await client.post('/api/patients', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAll: async (): Promise<PatientResponse> => {
    try {
      const client = getApiClient();
      const response = await client.get<PatientResponse>('/api/patients');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (uuid: string) => {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/patients/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (uuid: string, data: Partial<Patient>) => {
    try {
      const client = getApiClient();
      const response = await client.patch(`/api/patients/${uuid}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (uuid: string) => {
    try {
      const client = getApiClient();
      const response = await client.delete(`/api/patients/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByServiceUuid: async (serviceUuid: string) => {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/patients/services/${serviceUuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 