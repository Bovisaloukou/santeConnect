"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/AuthContext"
import { useApi } from "@/lib/hooks/useApi"
import { getMockData } from "@/lib/mock-data"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon, List, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppointmentsList from "@/components/appointments/AppointmentsList"
import AppointmentCalendarView from "@/components/appointments/AppointmentCalendarView"
import AppointmentReminders from "@/components/appointments/AppointmentReminders"
import AppointmentHistory from "@/components/appointments/AppointmentHistory"
import AppointmentPayment from "@/components/appointments/AppointmentPayment"
import NewAppointmentDialog from "@/components/appointments/NewAppointmentDialog"
import LoadingSpinner from "@/components/ui/loading-spinner"
import type { Appointment } from "@/lib/types"

export default function PatientAppointmentsPage() {
  const { user } = useAuth()
  const [view, setView] = useState<"list" | "calendar">("list")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)

  // Récupérer les rendez-vous
  const {
    data: appointments = [],
    isLoading,
    execute: refreshAppointments,
    setData: setAppointments,
  } = useApi<Appointment[]>({
    endpoint: "/api/appointments?patientId=patient-1",
    mockData: getMockData<Appointment[]>("appointments") as Appointment[],
  })

  // Filtrer les rendez-vous
  const filteredAppointments = appointments.filter((appointment) => {
    // Filtre par statut
    if (statusFilter !== "all" && appointment.status !== statusFilter) {
      return false
    }

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        appointment.healthcareProfessionalName.toLowerCase().includes(query) ||
        appointment.type.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Trier les rendez-vous par date (les plus récents d'abord)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Séparer les rendez-vous à venir et passés
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingAppointments = sortedAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return appointmentDate >= today
  })

  const pastAppointments = sortedAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return appointmentDate < today
  })

  // Gérer l'ajout d'un nouveau rendez-vous
  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments([...appointments, newAppointment])
    setIsNewAppointmentOpen(false)
  }

  // Gérer la mise à jour d'un rendez-vous
  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(
      appointments.map((appointment) => (appointment.id === updatedAppointment.id ? updatedAppointment : appointment)),
    )
  }

  // Gérer l'annulation d'un rendez-vous
  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: "cancelled" } : appointment,
      ),
    )
  }

  // Gérer la mise à jour du statut de paiement
  const handleUpdatePaymentStatus = (appointmentId: string, paymentStatus: "pending" | "paid" | "refunded") => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, paymentStatus } : appointment,
      ),
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Mes Rendez-vous</h1>
        <Button onClick={() => setIsNewAppointmentOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <TabsList>
            <TabsTrigger
              value="list"
              onClick={() => setView("list")}
              className={view === "list" ? "bg-emerald-50 text-emerald-600" : ""}
            >
              <List className="h-4 w-4 mr-2" />
              Liste
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              onClick={() => setView("calendar")}
              className={view === "calendar" ? "bg-emerald-50 text-emerald-600" : ""}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendrier
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-[200px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {view === "list" ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Rendez-vous à venir</h2>
                <AppointmentsList
                  appointments={upcomingAppointments}
                  onCancel={handleCancelAppointment}
                  onUpdate={handleUpdateAppointment}
                  emptyMessage="Aucun rendez-vous à venir. Prenez un rendez-vous pour commencer."
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Rendez-vous passés</h2>
                <AppointmentsList
                  appointments={pastAppointments}
                  isPast={true}
                  onCancel={handleCancelAppointment}
                  onUpdate={handleUpdateAppointment}
                  emptyMessage="Aucun rendez-vous passé."
                />
              </div>
            </div>
          ) : (
            <AppointmentCalendarView
              appointments={sortedAppointments}
              onCancel={handleCancelAppointment}
              onUpdate={handleUpdateAppointment}
            />
          )}
        </div>

        <div className="space-y-6">
          <AppointmentReminders appointments={appointments} />
          <AppointmentPayment appointments={appointments} onUpdatePayment={handleUpdatePaymentStatus} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Historique détaillé</h2>
        <AppointmentHistory appointments={appointments} onUpdate={handleUpdateAppointment} />
      </div>

      <NewAppointmentDialog
        open={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        onAddAppointment={handleAddAppointment}
        patientId={user?.id || "user-1"}
        patientName={user?.name || "Jean Dupont"}
      />
    </div>
  )
}
