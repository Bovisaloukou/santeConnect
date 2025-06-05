// Types centralisés pour l'application

// Types d'utilisateurs
export type UserRole = "PATIENT" | "HOSPITAL_OWNER" | "PHARMACY_OWNER" | "HEALTHCARE_PROFESSIONNAL"

export interface User {
  id: string
  createdAt: string
  firstName: string
  lastName: string
  gender: string
  email: string
  birthDate: string
  contact: string
  isEnabled: boolean
  is2FAEnabled: boolean
  is2FAVerified: boolean
  roles: UserRole[]
}

// Types pour les patients
export interface Patient {
  id: string
  userId: string
  bloodGroup?: string
  birthDate: string
  gender: string
  address?: string
  phone?: string
  emergencyContact?: string
  allergies?: string[]
  chronicConditions?: string[]
}

// Types pour les professionnels de santé
export interface HealthcareProfessional {
  id: string
  userId: string
  specialty: string
  licenseNumber: string
  facility: string
  availableHours?: AvailabilityHours[]
}

export interface AvailabilityHours {
  dayOfWeek: number // 0-6, 0 = Sunday
  startTime: string // HH:MM format
  endTime: string // HH:MM format
}

// Types pour les pharmacies
export interface Pharmacy {
  id: string
  userId: string
  name: string
  address: string
  phone: string
  openingHours: string
}

export interface PharmacyProduct {
  id: string
  pharmacyId: string
  name: string
  description?: string
  category: string
  price: number
  inStock: boolean
  quantity: number
  createdAt: string
  updatedAt: string
}

// Types pour les rendez-vous
export interface Appointment {
  id: string
  patientId: string
  patientName: string
  healthcareProfessionalId: string
  healthcareProfessionalName: string
  date: string
  time: string
  duration: number
  type: string
  notes?: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus?: "pending" | "paid" | "refunded"
  createdAt: string
  updatedAt: string
}

// Types pour les ordonnances
export interface Prescription {
  id: string
  patientId: string
  patientName: string
  healthcareProfessionalId: string
  healthcareProfessionalName: string
  date: string
  medications: Medication[]
  notes?: string
  status: "active" | "completed" | "expired"
  expiryDate: string
  createdAt: string
  updatedAt: string
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  inStock?: boolean
  pharmacyId?: string
}

// Types pour les documents médicaux
export interface MedicalDocument {
  id: string
  patientId: string
  name: string
  type: "prescription" | "analysis" | "report" | "other"
  fileUrl: string
  uploadedBy: string
  uploadedAt: string
}

// Types pour les plaintes
export interface Complaint {
  id: string
  patientId: string
  title: string
  description: string
  status: "pending" | "investigating" | "resolved" | "rejected"
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  response?: string
}

// Types pour les messages
export interface Message {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  content: string
  read: boolean
  createdAt: string
}

// Types pour les paiements
export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  method: "mtn" | "moov" | "ccash" | "card" | "other"
  status: "pending" | "completed" | "failed" | "refunded"
  reference: string
  relatedTo: {
    type: "appointment" | "prescription" | "service"
    id: string
  }
  createdAt: string
  updatedAt: string
}

// Types pour les notifications
export interface Notification {
  id: string
  userId: string
  type: "appointment" | "prescription" | "message" | "reminder" | "campaign"
  title: string
  message: string
  read: boolean
  createdAt: string
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
