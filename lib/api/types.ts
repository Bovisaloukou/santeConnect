import { Session } from 'next-auth';

export interface ExtendedSession extends Omit<Session, 'user'> {
  user: Session['user'] & {
    accessToken?: string;
    id?: string;
    is2FAEnabled?: boolean;
    is2FAVerified?: boolean;
    healthServiceUuid?: string;
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
  healthCenters: Array<{
    uuid: string;
    name: string;
  }>;
  pharmacies: Array<{
    uuid: string;
    name: string;
  }>;
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

export interface Patient {
  uuid: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  adresse: string;
  telephone: string;
  email: string;
  numeroSecuriteSociale: string;
  userUuid: string;
}

export interface PatientResponse {
  message: string;
  data: Patient[];
}

export interface N8nResponse {
  message: string;
  data: {
    stop: boolean;
    date_visite: string;
    motif: string;
    anamnese: string;
    antecedants_medicaux: string;
    enquete_socioculturelle: string | null;
    service_suggere?: string;
    identite: {
      nom: string;
      prenom: string;
      age: string;
      sexe: string;
    };
  };
  status: string;
}

export interface Consultation {
  motif: string;
  visite_uuid: string;
  date_heure?: string;
  symptomes?: string;
  diagnostic?: string;
  examens_physique?: string;
  observations?: string;
  actes_realises?: string;
  rendez_vous?: string;
  medecin_uuid?: string;
  care_uuid?: string;
}

export interface ConsultationResponse {
  message: string;
  data: Consultation;
}

export interface Medecin {
  numeroOrdre: string;
  role: string;
  specialite: string;
  userUuid: string;
  serviceUuid: string;
}

export interface MedecinResponse {
  message: string;
  data: Medecin;
} 