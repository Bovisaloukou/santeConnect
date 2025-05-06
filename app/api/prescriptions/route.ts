import { type NextRequest, NextResponse } from "next/server"

// Simuler une base de données d'ordonnances
const prescriptions = [
  {
    id: "prescription-1",
    patientId: "patient-1",
    patientName: "Jean Dupont",
    doctorId: "doctor-1",
    doctorName: "Dr. Marie Koné",
    date: "2023-05-10",
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
  {
    id: "prescription-2",
    patientId: "patient-2",
    patientName: "Marie Koné",
    doctorId: "doctor-3",
    doctorName: "Dr. Jean Koné",
    date: "2023-05-05",
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
]

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de recherche
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")
    const doctorId = searchParams.get("doctorId")
    const status = searchParams.get("status")

    let filteredPrescriptions = [...prescriptions]

    // Filtrer par patient
    if (patientId) {
      filteredPrescriptions = filteredPrescriptions.filter((prescription) => prescription.patientId === patientId)
    }

    // Filtrer par médecin
    if (doctorId) {
      filteredPrescriptions = filteredPrescriptions.filter((prescription) => prescription.doctorId === doctorId)
    }

    // Filtrer par statut
    if (status) {
      filteredPrescriptions = filteredPrescriptions.filter((prescription) => prescription.status === status)
    }

    return NextResponse.json(filteredPrescriptions)
  } catch (error) {
    console.error("Erreur lors de la récupération des ordonnances:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des ordonnances" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const prescriptionData = await request.json()

    // Validation des données (simplifiée)
    if (!prescriptionData.patientId || !prescriptionData.doctorId || !prescriptionData.medications) {
      return NextResponse.json({ error: "Données d'ordonnance incomplètes" }, { status: 400 })
    }

    // Calculer la date d'expiration (simplifiée)
    const today = new Date()
    const expiryDate = new Date(today)
    expiryDate.setDate(today.getDate() + 30) // Par défaut, 30 jours

    // Simuler l'ajout d'une ordonnance
    const newPrescription = {
      id: `prescription-${prescriptions.length + 1}`,
      ...prescriptionData,
      date: today.toISOString().split("T")[0],
      status: "active",
      expiryDate: expiryDate.toISOString().split("T")[0],
    }

    // Dans une application réelle, nous ajouterions l'ordonnance à la base de données

    return NextResponse.json({
      prescription: newPrescription,
      message: "Ordonnance créée avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la création de l'ordonnance:", error)
    return NextResponse.json({ error: "Erreur lors de la création de l'ordonnance" }, { status: 500 })
  }
}
