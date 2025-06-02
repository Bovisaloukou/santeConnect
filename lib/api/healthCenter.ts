import { getApiClient } from './config';
import { HealthCenter } from './types';

export const healthCenterApi = {
  register: async (data: HealthCenter, files: File[]) => {
    try {
      const formData = new FormData();
      
      // Ajouter les données JSON
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'services') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // Ajouter les fichiers
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
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
  }
}; 