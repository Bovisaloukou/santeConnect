import { Session } from 'next-auth';

export interface ExtendedSession extends Omit<Session, 'user'> {
  user: Session['user'] & {
    accessToken?: string;
    id?: string;
    is2FAEnabled?: boolean;
    is2FAVerified?: boolean;
  };
}

export interface UserProfile {
  uuid: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  birthDate: string;
  contact: string;
  isEnabled: boolean;
  is2FAEnabled: boolean;
}

export interface HealthCenter {
  type: string;
  name: string;
  fullAddress: string;
  department: string;
  municipality: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  taxIdentificationNumber: string;
  userUuid: string;
  services: string[];
} 