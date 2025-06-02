import { getApiClient } from './config';
import { UserProfile } from './types';

export const userApi = {
  getProfile: async (userId: string) => {
    const client = getApiClient();
    const response = await client.get(`/api/users/${userId}`);
    return response.data as UserProfile;
  },

  updateProfile: async (userId: string, profileData: Partial<UserProfile>) => {
    const client = getApiClient();
    const response = await client.patch(`/api/users/${userId}`, profileData);
    return response.data;
  }
}; 