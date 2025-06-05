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
  roles: string[];
}

export interface HealthCenter {
  type: string;
  name: string;
  fullAddress: string;
  department: string;
  municipality: string;
  phoneNumber: string;
  email: string;
  userUuid: string;
  services: string[];
}

export interface Responsable {
  uuid: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  birthDate: string;
  contact: string;
  isEnabled: boolean;
  is2FAEnabled: boolean;
}

export interface Medicament {
  uuid: string;
  name: string;
  description: string;
  prix: number;
  surOrdonnance: boolean;
}

export interface Pharmacie {
  uuid: string;
  name: string;
  adress: string;
  telephone: string;
  services: string[];
  horaires: string[];
  responsable: Responsable;
  medicaments: Medicament[];
}

export interface PharmacieResponse {
  message: string;
  data: Pharmacie[];
}

// Types pour les composants
export interface PharmacieComponent {
  id: string;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone: string;
  services: string[];
  horaires: {
    lundi: string;
    samedi: string;
    dimanche: string;
  };
}

export interface MedicamentComponent {
  id: string;
  nom: string;
  description: string;
  prix: number;
  image: string;
  necessiteOrdonnance: boolean;
  stock: number;
  categorie: string;
  pharmacies: string[];
} 