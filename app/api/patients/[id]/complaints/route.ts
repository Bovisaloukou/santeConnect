import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// Simuler une base de données de plaintes
const patientComplaints = [
  {
    id: "complaint-1",
    patientId: "patient-1",
    title: "Temps d'attente trop long",
    description: "J'ai attendu plus de 2 heures pour ma consultation alors que j'avais rendez-vous.",
    status: "investigating",
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-16"),
    resolvedAt: null,
    response: null,
  },
  {
    id: "complaint-2",
    patientId: "patient-2",
    title: "Erreur de prescription",
    description: "La posologie indiquée sur mon ordonnance ne correspond pas à ce que le médecin m'a dit.",
    status: "resolved",
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2023-05-12"),
    resolvedAt: new Date("2023-05-12"),
    response: "Nous avons corrigé l'ordonnance et vous avons envoyé la version correcte par email.",
  },
]

// Récupérer les plaintes d'un patient
async function getPatientComplaints(req: NextRequest, user: any) {
  const patientId = req.nextUrl.pathname.split("/")[3]

  // Vérifier les permissions
  if (user.role !== "admin" && (user.role !== "patient" || user.id !== `user-${patientId.split("-")[1]}`)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  // Filtrer les plaintes par patient
  const complaints = patientComplaints.filter((complaint) => complaint.patientId === patientId)

  return NextResponse.json(complaints)
}

// Ajouter une plainte
async function addPatientComplaint(req: NextRequest, user: any) {
  const patientId = req.nextUrl.pathname.split("/")[3]

  // Vérifier les permissions
  if (user.role !== "patient" || user.id !== `user-${patientId.split("-")[1]}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const complaintData = await req.json()

  // Validation des données
  if (!complaintData.title || !complaintData.description) {
    return NextResponse.json({ error: "Données de plainte incomplètes" }, { status: 400 })
  }

  // Créer une nouvelle plainte
  const newComplaint = {
    id: `complaint-${patientComplaints.length + 1}`,
    patientId,
    title: complaintData.title,
    description: complaintData.description,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    resolvedAt: null,
    response: null,
  }

  // Dans une application réelle, nous ajouterions la plainte à la base de données
  patientComplaints.push(newComplaint)

  return NextResponse.json({
    complaint: newComplaint,
    message: "Plainte soumise avec succès",
  })
}

// Mettre à jour une plainte
async function updatePatientComplaint(req: NextRequest, user: any) {
  const patientId = req.nextUrl.pathname.split("/")[3]
  const complaintId = req.nextUrl.searchParams.get("id")

  if (!complaintId) {
    return NextResponse.json({ error: "ID de plainte manquant" }, { status: 400 })
  }

  // Vérifier les permissions
  if (user.role !== "admin" && user.role !== "healthcare") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const complaintData = await req.json()

  // Trouver la plainte
  const complaintIndex = patientComplaints.findIndex(
    (complaint) => complaint.id === complaintId && complaint.patientId === patientId,
  )

  if (complaintIndex === -1) {
    return NextResponse.json({ error: "Plainte non trouvée" }, { status: 404 })
  }

  // Mettre à jour la plainte
  const updatedComplaint = {
    ...patientComplaints[complaintIndex],
    ...complaintData,
    updatedAt: new Date(),
    resolvedAt: complaintData.status === "resolved" ? new Date() : patientComplaints[complaintIndex].resolvedAt,
  }

  // Dans une application réelle, nous mettrions à jour la plainte dans la base de données
  patientComplaints[complaintIndex] = updatedComplaint

  return NextResponse.json({
    complaint: updatedComplaint,
    message: "Plainte mise à jour avec succès",
  })
}

export const GET = withAuth(getPatientComplaints, ["admin", "patient"])
export const POST = withAuth(addPatientComplaint, ["patient"])
export const PUT = withAuth(updatePatientComplaint, ["admin", "healthcare"])
