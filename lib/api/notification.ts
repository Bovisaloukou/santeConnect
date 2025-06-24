import { ApiResponse } from '@/lib/types';

export async function createNotification(notificationData: {
  type: string;
  titre: string;
  message: string;
  statut: string;
  est_urgente: boolean;
  destinataires_uuids: string[][];
}): Promise<ApiResponse<any>> {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notificationData),
  });
  const data = await response.json();
  return {
    ...data,
    status: response.status,
  };
}
