"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react"
import AppointmentDetailsDialog from "./AppointmentDetailsDialog"
import type { Appointment } from "@/lib/types"

interface AppointmentCalendarViewProps {
  appointments: Appointment[]
  onCancel: (appointmentId: string) => void
  onUpdate: (appointment: Appointment) => void
}

export default function AppointmentCalendarView({ appointments, onCancel, onUpdate }: AppointmentCalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Obtenir les rendez-vous pour la date sélectionnée
  const selectedDateAppointments = appointments.filter((appointment) => {
    if (!date) return false
    const appointmentDate = new Date(appointment.date)
    return (
      appointmentDate.getDate() === date.getDate() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getFullYear() === date.getFullYear()
    )
  })

  // Obtenir les dates avec des rendez-vous pour le calendrier
  const appointmentDates = appointments.reduce(
    (dates, appointment) => {
      const appointmentDate = new Date(appointment.date)
      const dateString = appointmentDate.toISOString().split("T")[0]

      if (!dates[dateString]) {
        dates[dateString] = []
      }

      dates[dateString].push(appointment)
      return dates
    },
    {} as Record<string, Appointment[]>,
  )

  // Fonction pour déterminer si une date a des rendez-vous
  const hasAppointments = (day: Date) => {
    const dateString = day.toISOString().split("T")[0]
    return !!appointmentDates[dateString]
  }

  // Fonction pour obtenir le nombre de rendez-vous pour une date
  const getAppointmentCount = (day: Date) => {
    const dateString = day.toISOString().split("T")[0]
    return appointmentDates[dateString]?.length || 0
  }

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500"
      case "pending":
        return "bg-amber-500"
      case "cancelled":
        return "bg-red-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé"
      case "pending":
        return "En attente"
      case "cancelled":
        return "Annulé"
      case "completed":
        return "Terminé"
      default:
        return status
    }
  }

  // Fonction pour naviguer au mois précédent
  const goToPreviousMonth = () => {
    if (date) {
      const newDate = new Date(date)
      newDate.setMonth(newDate.getMonth() - 1)
      setDate(newDate)
    }
  }

  // Fonction pour naviguer au mois suivant
  const goToNextMonth = () => {
    if (date) {
      const newDate = new Date(date)
      newDate.setMonth(newDate.getMonth() + 1)
      setDate(newDate)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {date?.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </h2>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              hasAppointment: (day) => hasAppointments(day),
            }}
            modifiersStyles={{
              hasAppointment: {
                fontWeight: "bold",
                backgroundColor: "#f0fdf4",
              },
            }}
            components={{
              DayContent: ({ date: day }) => {
                const count = getAppointmentCount(day)
                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {day.getDate()}
                    {count > 0 && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    )}
                  </div>
                )
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">
            {date ? (
              <>
                Rendez-vous du{" "}
                {date.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </>
            ) : (
              "Sélectionnez une date"
            )}
          </h3>

          {selectedDateAppointments.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun rendez-vous pour cette date.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{appointment.type}</h4>
                    <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{appointment.healthcareProfessionalName}</span>
                    </div>
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
          onCancel={onCancel}
          onUpdate={onUpdate}
          isPast={new Date(selectedAppointment.date) < new Date()}
        />
      )}
    </div>
  )
}
