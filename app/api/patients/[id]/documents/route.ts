import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// Simuler une base de données de documents patients
const patientDocuments = [
  {
    id: "doc-1",
    patientId: "patient-1",
    name: "Résultats analyse sanguine",
    type: "analysis",
    fileUrl: "/documents/patient-1/blood-test.pdf",
    uploadedBy: "doctor-1",
    uploadedAt: new Date("2023-05-10"),
  },
  {
    id: "doc-2",
    patientId: "patient-1",
    name: "Ordonnance Amlodipine",
    type: "prescription",
    fileUrl: "/documents/patient-1/prescription-amlodipine.pdf",
    uploadedBy: "doctor-1",
    uploadedAt: new Date("2023-05-10"),
  },
  {
    id: "doc-3",
    patientId: "patient-2",
    name: "Radiographie thorax",
    type: "analysis",
    fileUrl: "/documents/patient-2/chest-xray.pdf",
    uploadedBy: "doctor-3",
    uploadedAt: new Date("2023-05-05"),
  },
]

// Récupérer les documents d'un patient
async function getPatientDocuments(req: NextRequest, user: any) {
  const patientId = req.nextUrl.pathname.split("/")[3]

  // Vérifier les permissions
  if (
    user.role !== "admin" &&
    user.role !== "healthcare" &&
    (user.role !== "patient" || user.id !== `user-${patientId.split("-")[1]}`)
  ) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  // Filtrer les documents par patient
  const documents = patientDocuments.filter((doc) => doc.patientId === patientId)

  return NextResponse.json(documents)
}

// Ajouter un document à un patient
async function addPatientDocument(req: NextRequest, user: any) {
  const patientId = req.nextUrl.pathname.split("/")[3]

  // Vérifier les permissions
  if (user.role !== "admin" && user.role !== "healthcare") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const documentData = await req.json()

  // Validation des données
  if (!documentData.name || !documentData.type || !documentData.fileUrl) {
    return NextResponse.json({ error: "Données de document incomplètes" }, { status: 400 })
  }

  // Créer un nouveau document
  const newDocument = {
    id: `doc-${patientDocuments.length + 1}`,
    patientId,
    name: documentData.name,
    type: documentData.type,
    fileUrl: documentData.fileUrl,
    uploadedBy: user.id,
    uploadedAt: new Date(),
  }

  // Dans une application réelle, nous ajouterions le document à la base de données
  patientDocuments.push(newDocument)

  return NextResponse.json({
    document: newDocument,
    message: "Document ajouté avec succès",
  })
}

export const GET = withAuth(getPatientDocuments, ["admin", "healthcare", "patient"])
export const POST = withAuth(addPatientDocument, ["admin", "healthcare"])
