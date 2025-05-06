import { type NextRequest, NextResponse } from "next/server"

// Simuler une base de données de rendez-vous
const appointments = [
  {
    id: "appointment-1",
    patientId: "patient-1",
    patientName: "Jean Dupont",
    doctorId: "doctor-1",
    doctorName: "Dr. Marie Koné",
    date: "2023-05-20",
    time: "14:30",
    duration: 30, // minutes
    type: "Suivi hypertension",
    notes: "Contrôle de la tension artérielle",
    status: "confirmed",
  },
  {
    id: "appointment-2",
    patientId: "patient-1",
    patientName: "Jean Dupont",
    doctorId: "doctor-2",
    doctorName: "Dr. Aminata Bah",
    date: "2023-06-15",
    time: "10:00",
    duration: 30,
    type: "Consultation générale",
    notes: "Bilan de santé annuel",
    status: "pending",
  },
  {
    id: "appointment-3",
    patientId: "patient-2",
    patientName: "Marie Koné",
    doctorId: "doctor-3",
    doctorName: "Dr. Jean Koné",
    date: "2023-05-25",
    time: "11:30",
    duration: 30,
    type: "Suivi migraine",
    notes: "Évaluation de l'efficacité du traitement",
    status: "confirmed",
  },
]

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de recherche
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")
    const doctorId = searchParams.get("doctorId")
    const date = searchParams.get("date")
    const status = searchParams.get("status")

    let filteredAppointments = [...appointments]

    // Filtrer par patient
    if (patientId) {
      filteredAppointments = filteredAppointments.filter((appointment) => appointment.patientId === patientId)
    }

    // Filtrer par médecin
    if (doctorId) {
      filteredAppointments = filteredAppointments.filter((appointment) => appointment.doctorId === doctorId)
    }

    // Filtrer par date
    if (date) {
      filteredAppointments = filteredAppointments.filter((appointment) => appointment.date === date)
    }

    // Filtrer par statut
    if (status) {
      filteredAppointments = filteredAppointments.filter((appointment) => appointment.status === status)
    }

    return NextResponse.json(filteredAppointments)
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des rendez-vous" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json()

    // Validation des données (simplifiée)
    if (!appointmentData.patientId || !appointmentData.doctorId || !appointmentData.date || !appointmentData.time) {
      return NextResponse.json({ error: "Données de rendez-vous incomplètes" }, { status: 400 })
    }

    // Vérifier la disponibilité (simplifiée)
    const isTimeSlotAvailable = !appointments.some(
      (appointment) =>
        appointment.doctorId === appointmentData.doctorId &&
        appointment.date === appointmentData.date &&
        appointment.time === appointmentData.time,
    )

    if (!isTimeSlotAvailable) {
      return NextResponse.json({ error: "Ce créneau horaire n'est pas disponible" }, { status: 409 })
    }

    // Simuler l'ajout d'un rendez-vous
    const newAppointment = {
      id: `appointment-${appointments.length + 1}`,
      ...appointmentData,
      status: "pending",
    }

    // Dans une application réelle, nous ajouterions le rendez-vous à la base de données

    return NextResponse.json({
      appointment: newAppointment,
      message: "Rendez-vous créé avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous:", error)
    return NextResponse.json({ error: "Erreur lors de la création du rendez-vous" }, { status: 500 })
  }
}
