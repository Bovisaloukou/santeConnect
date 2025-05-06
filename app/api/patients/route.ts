import { type NextRequest, NextResponse } from "next/server"

// Simuler une base de données de patients
const patients = [
  {
    id: "patient-1",
    name: "Jean Dupont",
    age: 45,
    gender: "Homme",
    bloodGroup: "A+",
    phone: "+123456789",
    email: "jean.dupont@example.com",
    address: "123 Rue Principale, Ville",
    medicalHistory: [
      {
        id: "history-1",
        date: "2023-05-10",
        doctor: "Dr. Marie Koné",
        diagnosis: "Hypertension",
        treatment: "Amlodipine 5mg",
        notes: "Contrôle de la tension artérielle dans 2 semaines",
      },
      {
        id: "history-2",
        date: "2023-04-15",
        doctor: "Dr. Amadou Diallo",
        diagnosis: "Grippe saisonnière",
        treatment: "Paracétamol, repos",
        notes: "Symptômes améliorés après 5 jours",
      },
    ],
    appointments: [
      {
        id: "appointment-1",
        date: "2023-05-20",
        time: "14:30",
        doctor: "Dr. Marie Koné",
        type: "Suivi hypertension",
        status: "confirmed",
      },
      {
        id: "appointment-2",
        date: "2023-06-15",
        time: "10:00",
        doctor: "Dr. Aminata Bah",
        type: "Consultation générale",
        status: "pending",
      },
    ],
    prescriptions: [
      {
        id: "prescription-1",
        date: "2023-05-10",
        doctor: "Dr. Marie Koné",
        medications: [
          {
            name: "Amlodipine",
            dosage: "5mg",
            frequency: "1 fois par jour",
            duration: "30 jours",
          },
        ],
        notes: "Prendre le matin avec de la nourriture",
        status: "active",
        expiryDate: "2023-06-10",
      },
    ],
  },
  {
    id: "patient-2",
    name: "Marie Koné",
    age: 32,
    gender: "Femme",
    bloodGroup: "O+",
    phone: "+123456790",
    email: "marie.kone@example.com",
    address: "456 Avenue Centrale, Ville",
    medicalHistory: [
      {
        id: "history-3",
        date: "2023-05-05",
        doctor: "Dr. Jean Koné",
        diagnosis: "Migraine",
        treatment: "Sumatriptan 50mg",
        notes: "Éviter les déclencheurs identifiés",
      },
    ],
    appointments: [
      {
        id: "appointment-3",
        date: "2023-05-25",
        time: "11:30",
        doctor: "Dr. Jean Koné",
        type: "Suivi migraine",
        status: "confirmed",
      },
    ],
    prescriptions: [
      {
        id: "prescription-2",
        date: "2023-05-05",
        doctor: "Dr. Jean Koné",
        medications: [
          {
            name: "Sumatriptan",
            dosage: "50mg",
            frequency: "Au besoin",
            duration: "PRN",
          },
        ],
        notes: "Prendre dès les premiers symptômes de migraine",
        status: "active",
        expiryDate: "2023-08-05",
      },
    ],
  },
]

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de recherche
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let filteredPatients = [...patients]

    // Filtrer les patients si un terme de recherche est fourni
    if (search) {
      const searchLower = search.toLowerCase()
      filteredPatients = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchLower) ||
          patient.email.toLowerCase().includes(searchLower) ||
          patient.phone.includes(search),
      )
    }

    return NextResponse.json(filteredPatients)
  } catch (error) {
    console.error("Erreur lors de la récupération des patients:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des patients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const patientData = await request.json()

    // Validation des données (simplifiée)
    if (!patientData.name || !patientData.email) {
      return NextResponse.json({ error: "Données patient incomplètes" }, { status: 400 })
    }

    // Simuler l'ajout d'un patient
    const newPatient = {
      id: `patient-${patients.length + 1}`,
      ...patientData,
      medicalHistory: [],
      appointments: [],
      prescriptions: [],
    }

    // Dans une application réelle, nous ajouterions le patient à la base de données

    return NextResponse.json({
      patient: newPatient,
      message: "Patient ajouté avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de l'ajout du patient:", error)
    return NextResponse.json({ error: "Erreur lors de l'ajout du patient" }, { status: 500 })
  }
}
