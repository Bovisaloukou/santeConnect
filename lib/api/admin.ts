import { getApiClient } from './config';

/**
 * Active une pharmacie par son UUID
 * @param pharmacieUuid UUID de la pharmacie à activer
 */
export const activatePharmacy = async (pharmacieUuid: string) => {
  const client = getApiClient();
  const response = await client.post(`/api/admin/activate/pharmacie/${pharmacieUuid}`);
  return response.data;
};

/**
 * Active un centre de santé par son UUID
 * @param healthCenterUuid UUID du centre de santé à activer
 */
export const activateHealthCenter = async (healthCenterUuid: string) => {
  const client = getApiClient();
  const response = await client.post(`/api/admin/activate/centre-de-sante/${healthCenterUuid}`);
  return response.data;
};
