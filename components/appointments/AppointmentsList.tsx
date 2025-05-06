"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import AppointmentDetailsDialog from "./AppointmentDetailsDialog"
import type { Appointment } from "@/lib/types"

interface AppointmentsListProps {
  appointments: Appointment[]
  isPast?: boolean
  onCancel: (appointmentId: string) => void
  onUpdate: (appointment: Appointment) => void
  emptyMessage?: string
}

export default function AppointmentsList({
  appointments,
  isPast = false,
  onCancel,
  onUpdate,
  emptyMessage = "Aucun rendez-vous trouvé.",
}: AppointmentsListProps) {
  const { toast } = useToast()
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return

    setIsCancelling(true)

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onCancel(appointmentToCancel.id)

      toast({
        title: "Rendez-vous annulé",
        description: "Votre rendez-vous a été annulé avec succès.",
      })

      setAppointmentToCancel(null)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation du rendez-vous.",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-500">Confirmé</Badge>
      case "pending":
        return <Badge className="bg-amber-500">En attente</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Annulé</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Terminé</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="bg-emerald-50 p-4 flex flex-col items-center justify-center md:w-1/4">
                  <div className="text-2xl font-bold text-emerald-600">
                    {new Date(appointment.date).toLocaleDateString("fr-FR", { day: "2-digit" })}
                  </div>
                  <div className="text-emerald-600">
                    {new Date(appointment.date).toLocaleDateString("fr-FR", { month: "long" })}
                  </div>
                  <div className="text-sm text-emerald-600">
                    {new Date(appointment.date).toLocaleDateString("fr-FR", { year: "numeric" })}
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <h3 className="font-semibold text-lg">{appointment.type}</h3>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span>{appointment.healthcareProfessionalName}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {appointment.time} ({appointment.duration} min)
                      </span>
                    </div>
                    {appointment.notes && (
                      <div className="flex items-start text-gray-600">
                        <FileText className="h-4 w-4 mr-2 mt-1" />
                        <span className="line-clamp-1">{appointment.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                      Voir détails
                    </Button>

                    {!isPast && appointment.status !== "cancelled" && appointment.status !== "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setAppointmentToCancel(appointment)}
                      >
                        Annuler
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de confirmation d'annulation */}
      <Dialog open={!!appointmentToCancel} onOpenChange={(open) => !open && setAppointmentToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler le rendez-vous</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>

          {appointmentToCancel && (
            <div className="py-4">
              <div className="space-y-2">
                <div className="font-medium">{appointmentToCancel.type}</div>
                <div className="text-sm text-gray-500">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  {new Date(appointmentToCancel.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  <Clock className="h-4 w-4 inline mr-2" />
                  {appointmentToCancel.time}
                </div>
                <div className="text-sm text-gray-500">
                  <User className="h-4 w-4 inline mr-2" />
                  {appointmentToCancel.healthcareProfessionalName}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAppointmentToCancel(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment} disabled={isCancelling}>
              {isCancelling ? "Annulation..." : "Confirmer l'annulation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de détails du rendez-vous */}
      {selectedAppointment && (
        <AppointmentDetailsDialog
          appointment={selectedAppointment}
          open={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onCancel={onCancel}
          onUpdate={onUpdate}
          isPast={isPast}
        />
      )}
    </>
  )
}
