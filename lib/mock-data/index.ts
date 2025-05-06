import type {
  Appointment,
  Prescription,
  MedicalDocument,
  Complaint,
  Message,
  PharmacyProduct,
  Pharmacy,
} from "../types"

// Données fictives pour les rendez-vous
export const mockAppointments: Appointment[] = [
  {
    id: "appointment-1",
    patientId: "patient-1",
    patientName: "Jean Dupont",
    healthcareProfessionalId: "healthcare-1",
    healthcareProfessionalName: "Dr. Marie Koné",
    date: "2023-05-20",
    time: "14:30",
    duration: 30,
    type: "Suivi hypertension",
    notes: "Contrôle de la tension artérielle",
    status: "confirmed",
    createdAt: "2023-05-01T10:00:00Z",
    updatedAt: "2023-05-01T10:00:00Z",
  },
  {
    id: "appointment-2",
    patientId: "patient-1",
    patientName: "Jean Dupont",
    healthcareProfessionalId: "healthcare-2",
    healthcareProfessionalName: "Dr. Aminata Bah",
    date: "2023-06-15",
    time: "10:00",
    duration: 30,
    type: "Consultation générale",
    notes: "Bilan de santé annuel",
    status: "pending",
    createdAt: "2023-05-05T14:30:00Z",
    updatedAt: "2023-05-05T14:30:00Z",
  },
  {
    id: "appointment-3",
    patientId: "patient-1",
    patientName: "Jean Dupont",
    healthcareProfessionalId: "healthcare-3",
    healthcareProfessionalName: "Dr. Jean Koné",
    date: "2023-05-25",
    time: "11:30",
    duration: 30,
    type: "Suivi migraine",
    notes: "Évaluation de l'efficacité du traitement",
    status: "confirmed",
    createdAt: "2023-05-10T09:15:00Z",
    updatedAt: "2023-05-10T09:15:00Z",
  },
]

// Données fictives pour les ordonnances
export const mockPrescriptions: Prescription[] = [
  {
    id: "prescription-1",
    patientId: "patient-1",
    patientName: "Jean Dupont",
    healthcareProfessionalId: "healthcare-1",
    healthcareProfessionalName: "Dr. Marie Koné",
    date: "2023-05-10",
    medications: [
      {
        name: "Amlodipine",
        dosage: "5mg",
        frequency: "1 fois par jour",
        duration: "30 jours",
        instructions: "Prendre le matin avec de la nourriture",
      },
    ],
    notes: "Contrôle de la tension artérielle dans 2 semaines",
    status: "active",
    expiryDate: "2023-06-10",
    createdAt: "2023-05-10T15:00:00Z",
    updatedAt: "2023-05-10T15:00:00Z",
  },
  {
    id: "prescription-2",
    patientId: "patient-1",
    patientName: "Jean Dupont",
    healthcareProfessionalId: "healthcare-3",
    healthcareProfessionalName: "Dr. Jean Koné",
    date: "2023-05-05",
    medications: [
      {
        name: "Sumatriptan",
        dosage: "50mg",
        frequency: "Au besoin",
        duration: "PRN",
        instructions: "Prendre dès les premiers symptômes de migraine",
      },
    ],
    notes: "Ne pas dépasser 2 comprimés par 24h",
    status: "active",
    expiryDate: "2023-08-05",
    createdAt: "2023-05-05T11:30:00Z",
    updatedAt: "2023-05-05T11:30:00Z",
  },
  {
    id: "prescription-3",
    patientId: "patient-1",
    patientName: "Jean Dupont",
    healthcareProfessionalId: "healthcare-2",
    healthcareProfessionalName: "Dr. Aminata Bah",
    date: "2023-04-15",
    medications: [
      {
        name: "Paracétamol",
        dosage: "1000mg",
        frequency: "3 fois par jour",
        duration: "7 jours",
        instructions: "Prendre après les repas",
      },
    ],
    notes: "Pour soulager les douleurs",
    status: "expired",
    expiryDate: "2023-04-22",
    createdAt: "2023-04-15T09:45:00Z",
    updatedAt: "2023-04-15T09:45:00Z",
  },
]

// Données fictives pour les documents médicaux
export const mockDocuments: MedicalDocument[] = [
  {
    id: "doc-1",
    patientId: "patient-1",
    name: "Résultats analyse sanguine",
    type: "analysis",
    fileUrl: "/documents/blood-test.pdf",
    uploadedBy: "Dr. Marie Koné",
    uploadedAt: "2023-05-10T14:00:00Z",
  },
  {
    id: "doc-2",
    patientId: "patient-1",
    name: "Ordonnance Amlodipine",
    type: "prescription",
    fileUrl: "/documents/prescription-amlodipine.pdf",
    uploadedBy: "Dr. Marie Koné",
    uploadedAt: "2023-05-10T15:00:00Z",
  },
  {
    id: "doc-3",
    patientId: "patient-1",
    name: "Rapport consultation générale",
    type: "report",
    fileUrl: "/documents/general-consultation.pdf",
    uploadedBy: "Dr. Sophie Martin",
    uploadedAt: "2023-05-02T10:30:00Z",
  },
]

// Données fictives pour les plaintes
export const mockComplaints: Complaint[] = [
  {
    id: "complaint-1",
    patientId: "patient-1",
    title: "Temps d'attente trop long",
    description: "J'ai attendu plus de 2 heures pour ma consultation alors que j'avais rendez-vous.",
    status: "investigating",
    createdAt: "2023-05-15T09:30:00Z",
    updatedAt: "2023-05-16T11:00:00Z",
  },
  {
    id: "complaint-2",
    patientId: "patient-1",
    title: "Erreur de prescription",
    description: "La posologie indiquée sur mon ordonnance ne correspond pas à ce que le médecin m'a dit.",
    status: "resolved",
    createdAt: "2023-05-10T14:45:00Z",
    updatedAt: "2023-05-12T10:15:00Z",
    resolvedAt: "2023-05-12T10:15:00Z",
    response: "Nous avons corrigé l'ordonnance et vous avons envoyé la version correcte par email.",
  },
  {
    id: "complaint-3",
    patientId: "patient-1",
    title: "Problème de paiement",
    description: "J'ai été facturé deux fois pour la même consultation.",
    status: "pending",
    createdAt: "2023-05-18T16:20:00Z",
    updatedAt: "2023-05-18T16:20:00Z",
  },
]

// Données fictives pour les messages
export const mockMessages: Message[] = [
  {
    id: "message-1",
    senderId: "healthcare-1",
    senderName: "Dr. Marie Koné",
    receiverId: "patient-1",
    receiverName: "Jean Dupont",
    content: "Bonjour, comment allez-vous aujourd'hui?",
    read: true,
    createdAt: "2023-05-18T10:00:00Z",
  },
  {
    id: "message-2",
    senderId: "patient-1",
    senderName: "Jean Dupont",
    receiverId: "healthcare-1",
    receiverName: "Dr. Marie Koné",
    content: "Bonjour Docteur, je vais mieux. La fièvre a baissé.",
    read: true,
    createdAt: "2023-05-18T10:05:00Z",
  },
  {
    id: "message-3",
    senderId: "healthcare-1",
    senderName: "Dr. Marie Koné",
    receiverId: "patient-1",
    receiverName: "Jean Dupont",
    content: "Excellent! Continuez à prendre vos médicaments comme prescrit.",
    read: true,
    createdAt: "2023-05-18T10:10:00Z",
  },
  {
    id: "message-4",
    senderId: "healthcare-1",
    senderName: "Dr. Marie Koné",
    receiverId: "patient-1",
    receiverName: "Jean Dupont",
    content: "Bonjour, comment vous sentez-vous après notre dernière consultation?",
    read: false,
    createdAt: "2023-05-18T14:30:00Z",
  },
]

// Données fictives pour les pharmacies
export const mockPharmacies: Pharmacy[] = [
  {
    id: "pharmacy-1",
    userId: "user-3",
    name: "Pharmacie Centrale",
    address: "123 Rue Principale, Ville",
    phone: "+123456789",
    openingHours: "Lun-Ven: 8h-19h, Sam: 9h-17h, Dim: Fermé",
  },
  {
    id: "pharmacy-2",
    userId: "user-5",
    name: "Pharmacie du Marché",
    address: "45 Place du Marché, Ville",
    phone: "+123456790",
    openingHours: "Lun-Sam: 8h-20h, Dim: 10h-13h",
  },
]

// Données fictives pour les produits pharmaceutiques
export const mockPharmacyProducts: PharmacyProduct[] = [
  {
    id: "product-1",
    pharmacyId: "pharmacy-1",
    name: "Paracétamol 500mg",
    description: "Analgésique et antipyrétique",
    category: "Médicament",
    price: 3.5,
    inStock: true,
    quantity: 100,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "product-2",
    pharmacyId: "pharmacy-1",
    name: "Amoxicilline 1g",
    description: "Antibiotique à large spectre",
    category: "Médicament",
    price: 8.2,
    inStock: true,
    quantity: 50,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "product-3",
    pharmacyId: "pharmacy-2",
    name: "Ibuprofène 400mg",
    description: "Anti-inflammatoire non stéroïdien",
    category: "Médicament",
    price: 4.8,
    inStock: true,
    quantity: 75,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "product-4",
    pharmacyId: "pharmacy-2",
    name: "Vitamine C 1000mg",
    description: "Complément alimentaire",
    category: "Supplément",
    price: 12.5,
    inStock: true,
    quantity: 30,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z",
  },
]

// Fonction pour récupérer les données fictives en fonction du type
export function getMockData<T>(type: string, id?: string): T | T[] {
  switch (type) {
    case "appointments":
      return id ? (mockAppointments.find((a) => a.id === id) as unknown as T) : (mockAppointments as unknown as T[])
    case "prescriptions":
      return id ? (mockPrescriptions.find((p) => p.id === id) as unknown as T) : (mockPrescriptions as unknown as T[])
    case "documents":
      return id ? (mockDocuments.find((d) => d.id === id) as unknown as T) : (mockDocuments as unknown as T[])
    case "complaints":
      return id ? (mockComplaints.find((c) => c.id === id) as unknown as T) : (mockComplaints as unknown as T[])
    case "messages":
      return id ? (mockMessages.find((m) => m.id === id) as unknown as T) : (mockMessages as unknown as T[])
    case "pharmacies":
      return id ? (mockPharmacies.find((p) => p.id === id) as unknown as T) : (mockPharmacies as unknown as T[])
    case "pharmacy-products":
      return id
        ? (mockPharmacyProducts.find((p) => p.id === id) as unknown as T)
        : (mockPharmacyProducts as unknown as T[])
    default:
      return [] as unknown as T[]
  }
}
