"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth/AuthContext"
import { Calendar, FileText } from "lucide-react"
import { useApi } from "@/lib/hooks/useApi"
import type { Appointment, Prescription } from "@/lib/types"
import { getMockData } from "@/lib/mock-data"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function PatientDashboard() {
  const { user } = useAuth()

  // Récupérer les rendez-vous
  const { data: appointments = [], isLoading: isLoadingAppointments } = useApi<Appointment[]>({
    endpoint: "/api/appointments?patientId=patient-1",
    mockData: getMockData<Appointment[]>("appointments") as Appointment[],
  })

  // Récupérer les ordonnances
  const { data: prescriptions = [], isLoading: isLoadingPrescriptions } = useApi<Prescription[]>({
    endpoint: "/api/prescriptions?patientId=patient-1",
    mockData: getMockData<Prescription[]>("prescriptions") as Prescription[],
  })

  // Filtrer les rendez-vous à venir
  const upcomingAppointments = appointments
    .filter((app) => app.status === "confirmed" || app.status === "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Filtrer les ordonnances actives
  const activePrescriptions = prescriptions
    .filter((presc) => presc.status === "active")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Prochain rendez-vous
  const nextAppointment = upcomingAppointments[0]

  // Dernière ordonnance active
  const latestPrescription = activePrescriptions[0]

  if (isLoadingAppointments || isLoadingPrescriptions) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      {/* Bouton pour les professionnels de santé */}
      <div className="mb-6 text-center">
        <Button variant="outline" size="sm">
          <Link href="/register/professional">Je suis un professionnel de santé</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Prochain rendez-vous</CardTitle>
            <CardDescription>Votre prochain rendez-vous médical</CardDescription>
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{nextAppointment.healthcareProfessionalName}</span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      nextAppointment.status === "confirmed"
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-amber-600 bg-amber-50"
                    }`}
                  >
                    {nextAppointment.status === "confirmed" ? "Confirmé" : "En attente"}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{nextAppointment.type}</div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(nextAppointment.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  - {nextAppointment.time}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Link href="/dashboard/patient/appointments">Voir les détails</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">Aucun rendez-vous à venir</p>
                <Button variant="outline" size="sm">
                  <Link href="/dashboard/patient/appointments">Prendre un rendez-vous</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ordonnances actives</CardTitle>
            <CardDescription>Vos ordonnances en cours</CardDescription>
          </CardHeader>
          <CardContent>
            {latestPrescription ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{latestPrescription.medications[0]?.name}</span>
                    <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full">En cours</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Prescrit par {latestPrescription.healthcareProfessionalName} -{" "}
                    {new Date(latestPrescription.date).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="text-sm text-gray-500">
                    Expire le {new Date(latestPrescription.expiryDate).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Link href="/dashboard/patient/documents">Voir toutes les ordonnances</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">Aucune ordonnance active</p>
                <Button variant="outline" size="sm">
                  <Link href="/dashboard/patient/documents">Voir les documents</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Messages récents</CardTitle>
            <CardDescription>Vos dernières communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Dr. Marie Koné</span>
                  <span className="text-xs text-gray-500">Hier</span>
                </div>
                <div className="text-sm text-gray-500 truncate">
                  Bonjour, comment vous sentez-vous après notre dernière consultation?
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Link href="/dashboard/patient/messages">Voir tous les messages</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments">
        <TabsList className="mb-4">
          <TabsTrigger value="appointments">Rendez-vous à venir</TabsTrigger>
          <TabsTrigger value="prescriptions">Ordonnances récentes</TabsTrigger>
          <TabsTrigger value="history">Historique médical</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Vos prochains rendez-vous</CardTitle>
              <CardDescription>Consultez et gérez vos rendez-vous médicaux à venir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments
                    .slice(0, 3)
                    .map((appointment) => (
                      <AppointmentItem
                        key={appointment.id}
                        doctor={appointment.healthcareProfessionalName}
                        specialty={appointment.type}
                        date={new Date(appointment.date).toLocaleDateString("fr-FR")}
                        time={appointment.time}
                        status={appointment.status as "confirmed" | "pending" | "cancelled"}
                      />
                    ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Aucun rendez-vous à venir</p>
                )}
                <div className="flex justify-center mt-4">
                  <Button variant="outline">
                    <Link href="/dashboard/patient/appointments">Prendre un nouveau rendez-vous</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <CardTitle>Vos ordonnances récentes</CardTitle>
              <CardDescription>Consultez vos ordonnances et prescriptions médicales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptions.length > 0 ? (
                  prescriptions
                    .slice(0, 3)
                    .map((prescription) => (
                      <PrescriptionItem
                        key={prescription.id}
                        title={prescription.medications[0]?.name || "Ordonnance"}
                        doctor={prescription.healthcareProfessionalName}
                        date={new Date(prescription.date).toLocaleDateString("fr-FR")}
                        expiry={new Date(prescription.expiryDate).toLocaleDateString("fr-FR")}
                        status={prescription.status as "active" | "expired"}
                      />
                    ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Aucune ordonnance récente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Votre historique médical</CardTitle>
              <CardDescription>Consultez l'historique de vos consultations et traitements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <HistoryItem
                  title="Consultation générale"
                  doctor="Dr. Sophie Martin"
                  date="2 Mai 2023"
                  description="Consultation de routine, aucun problème majeur détecté."
                />
                <HistoryItem
                  title="Analyse de sang"
                  doctor="Laboratoire Central"
                  date="15 Avril 2023"
                  description="Bilan sanguin complet, résultats normaux."
                />
                <HistoryItem
                  title="Consultation dermatologique"
                  doctor="Dr. Aminata Diallo"
                  date="1 Avril 2023"
                  description="Traitement d'une éruption cutanée, prescription de crème."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AppointmentItem({
  doctor,
  specialty,
  date,
  time,
  status,
}: {
  doctor: string
  specialty: string
  date: string
  time: string
  status: "confirmed" | "pending" | "cancelled"
}) {
  const statusMap = {
    confirmed: { text: "Confirmé", color: "text-emerald-600 bg-emerald-50" },
    pending: { text: "En attente", color: "text-amber-600 bg-amber-50" },
    cancelled: { text: "Annulé", color: "text-red-600 bg-red-50" },
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="font-medium">{doctor}</div>
        <div className="text-sm text-gray-500">{specialty}</div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          {date} - {time}
        </div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <span className={`text-sm px-2 py-1 rounded-full ${statusMap[status].color}`}>{statusMap[status].text}</span>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Modifier
          </Button>
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
            Annuler
          </Button>
        </div>
      </div>
    </div>
  )
}

function PrescriptionItem({
  title,
  doctor,
  date,
  expiry,
  status,
}: {
  title: string
  doctor: string
  date: string
  expiry: string
  status: "active" | "expired"
}) {
  const statusMap = {
    active: { text: "En cours", color: "text-amber-600 bg-amber-50" },
    expired: { text: "Expiré", color: "text-gray-600 bg-gray-100" },
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">Prescrit par {doctor}</div>
        <div className="text-sm text-gray-500">Date: {date}</div>
        <div className="text-sm text-gray-500">Expire le: {expiry}</div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <span className={`text-sm px-2 py-1 rounded-full ${statusMap[status].color}`}>{statusMap[status].text}</span>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Voir
          </Button>
          <Button variant="outline" size="sm">
            Télécharger
          </Button>
        </div>
      </div>
    </div>
  )
}

function HistoryItem({
  title,
  doctor,
  date,
  description,
}: {
  title: string
  doctor: string
  date: string
  description: string
}) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">{date}</div>
      </div>
      <div className="text-sm text-gray-500 mb-2">{doctor}</div>
      <div className="text-sm">{description}</div>
      <Button variant="outline" size="sm" className="mt-2">
        <FileText className="h-4 w-4 mr-2" />
        Voir les détails
      </Button>
    </div>
  )
}
