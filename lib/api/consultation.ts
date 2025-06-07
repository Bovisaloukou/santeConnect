import { getApiClient } from './config';
import { Consultation, ConsultationResponse } from './types';

export const consultationApi = {
  create: async (consultationData: Consultation): Promise<ConsultationResponse> => {
    try {
      const client = getApiClient();
      const response = await client.post('/api/consultations', consultationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 