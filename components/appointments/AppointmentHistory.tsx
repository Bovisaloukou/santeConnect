"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppointmentDetailsDialog from "./AppointmentDetailsDialog"
import type { Appointment } from "@/lib/types"

interface AppointmentHistoryProps {
  appointments: Appointment[]
  onUpdate: (appointment: Appointment) => void
}

export default function AppointmentHistory({ appointments, onUpdate }: AppointmentHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Filtrer les rendez-vous passés
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const pastAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return appointmentDate < today || appointment.status === "completed"
  })

  // Appliquer les filtres
  const filteredAppointments = pastAppointments.filter((appointment) => {
    // Filtre par type
    if (typeFilter !== "all" && appointment.type !== typeFilter) {
      return false
    }

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        appointment.healthcareProfessionalName.toLowerCase().includes(query) ||
        appointment.type.toLowerCase().includes(query) ||
        (appointment.notes && appointment.notes.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Trier par date (les plus récents d'abord)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Obtenir les types de rendez-vous uniques pour le filtre
  const appointmentTypes = Array.from(new Set(pastAppointments.map((appointment) => appointment.type)))

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Obtenir le texte du statut
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Historique des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {sortedAppointments.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun rendez-vous passé trouvé.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{appointment.type}</h3>
                        <p className="text-sm text-gray-500">{formatDate(appointment.date)}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                  </div>

                  <div className="ml-10 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{appointment.healthcareProfessionalName}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{appointment.time}</span>
                    </div>
                    {appointment.notes && (
                      <div className="flex items-start">
                        <FileText className="h-4 w-4 mr-2 mt-1" />
                        <span className="line-clamp-1">{appointment.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de détails du rendez-vous */}
      {selectedAppointment && (
        <AppointmentDetailsDialog
          appointment={selectedAppointment}
          open={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onCancel={() => {}} // Pas besoin d'annuler un rendez-vous passé
          onUpdate={onUpdate}
          isPast={true}
        />
      )}
    </>
  )
}
