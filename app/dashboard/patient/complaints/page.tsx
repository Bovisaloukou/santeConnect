"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComplaintForm } from "@/components/complaint-form"
import { useApi } from "@/lib/hooks/use-api"
import { AlertCircle, CheckCircle, Clock, HelpCircle } from "lucide-react"

// Type pour les plaintes
interface Complaint {
  id: string
  title: string
  description: string
  status: "pending" | "investigating" | "resolved" | "rejected"
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  response?: string
}

export default function PatientComplaintsPage() {
  // Utiliser notre hook personnalisé pour récupérer les plaintes
  const {
    data: complaints = [],
    setData: setComplaints,
    isLoading,
  } = useApi<Complaint[]>({
    endpoint: "/api/patients/patient-1/complaints", // Endpoint simulé
    loadOnMount: true,
    initialData: [
      {
        id: "complaint-1",
        title: "Temps d'attente trop long",
        description: "J'ai attendu plus de 2 heures pour ma consultation alors que j'avais rendez-vous.",
        status: "investigating",
        createdAt: new Date("2023-05-15"),
        updatedAt: new Date("2023-05-16"),
      },
      {
        id: "complaint-2",
        title: "Erreur de prescription",
        description: "La posologie indiquée sur mon ordonnance ne correspond pas à ce que le médecin m'a dit.",
        status: "resolved",
        createdAt: new Date("2023-05-10"),
        updatedAt: new Date("2023-05-12"),
        resolvedAt: new Date("2023-05-12"),
        response: "Nous avons corrigé l'ordonnance et vous avons envoyé la version correcte par email.",
      },
      {
        id: "complaint-3",
        title: "Problème de paiement",
        description: "J'ai été facturé deux fois pour la même consultation.",
        status: "pending",
        createdAt: new Date("2023-05-18"),
        updatedAt: new Date("2023-05-18"),
      },
    ],
  })

  const handleComplaintSubmit = (newComplaint: Complaint) => {
    setComplaints([newComplaint, ...(complaints || [])])
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]">Chargement des plaintes...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes Plaintes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ComplaintForm onSubmitSuccess={handleComplaintSubmit} />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Historique des plaintes</h2>
          {(complaints || []).length === 0 ? (
            <p className="text-gray-500">Vous n'avez soumis aucune plainte.</p>
          ) : (
            <div className="space-y-4">
              {(complaints || []).map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const statusMap = {
    pending: {
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      text: "En attente",
      color: "bg-amber-50 text-amber-700",
    },
    investigating: {
      icon: <HelpCircle className="h-5 w-5 text-blue-500" />,
      text: "En cours d'examen",
      color: "bg-blue-50 text-blue-700",
    },
    resolved: {
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      text: "Résolu",
      color: "bg-emerald-50 text-emerald-700",
    },
    rejected: {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      text: "Rejeté",
      color: "bg-red-50 text-red-700",
    },
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{complaint.title}</CardTitle>
            <CardDescription>Soumis le {new Date(complaint.createdAt).toLocaleDateString()}</CardDescription>
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full ${statusMap[complaint.status].color}`}>
            {statusMap[complaint.status].icon}
            <span className="ml-2 text-sm font-medium">{statusMap[complaint.status].text}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-1">{complaint.description}</p>
        </div>
        {complaint.response && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Réponse</h3>
            <p className="mt-1">{complaint.response}</p>
            {complaint.resolvedAt && (
              <p className="mt-1 text-sm text-gray-500">
                Résolu le {new Date(complaint.resolvedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
