import { getApiClient } from './config';

export interface HealthService {
  uuid: string;
  serviceName: string;
  description: string | null;
  etat: "NORMAL" | "UNDERSTAFFED" | "OVERLOADED" | "CRITICAL" | "TEMP_CLOSED";
  healthCenterUuid: string;
}

export interface CreateHealthServiceDto {
  serviceName: string;
  description: string;
  etat: HealthService["etat"];
  healthCenterUuid: string;
}

export interface UpdateHealthServiceDto extends Partial<CreateHealthServiceDto> {}

export const healthServiceApi = {
  create: async (data: CreateHealthServiceDto) => {
    try {
      const client = getApiClient();
      const response = await client.post('/api/health-services', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (uuid: string) => {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/health-services/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (uuid: string, data: UpdateHealthServiceDto) => {
    try {
      const client = getApiClient();
      const response = await client.patch(`/api/health-services/${uuid}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (uuid: string) => {
    try {
      const client = getApiClient();
      const response = await client.delete(`/api/health-services/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByHealthCenter: async (healthCenterUuid: string) => {
    try {
      const client = getApiClient();
      const response = await client.get(`/api/health-services/by-health-center/${healthCenterUuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 