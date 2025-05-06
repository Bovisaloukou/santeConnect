"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, FileText, Phone, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Appointment } from "@/lib/types"

interface AppointmentDetailsDialogProps {
  appointment: Appointment
  open: boolean
  onClose: () => void
  onCancel: (appointmentId: string) => void
  onUpdate: (appointment: Appointment) => void
  isPast?: boolean
}

export default function AppointmentDetailsDialog({
  appointment,
  open,
  onClose,
  onCancel,
  onUpdate,
  isPast = false,
}: AppointmentDetailsDialogProps) {
  const { toast } = useToast()
  const [isCancelling, setIsCancelling] = useState(false)
  const [isRescheduling, setIsRescheduling] = useState(false)

  const handleCancelAppointment = async () => {
    setIsCancelling(true)

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onCancel(appointment.id)

      toast({
        title: "Rendez-vous annulé",
        description: "Votre rendez-vous a été annulé avec succès.",
      })

      onClose()
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

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails du rendez-vous</span>
            {getStatusBadge(appointment.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{appointment.type}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3 text-emerald-600" />
                <span>
                  {new Date(appointment.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock className="h-5 w-5 mr-3 text-emerald-600" />
                <span>
                  {appointment.time} ({appointment.duration} minutes)
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <User className="h-5 w-5 mr-3 text-emerald-600" />
                <span>{appointment.healthcareProfessionalName}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-3 text-emerald-600" />
                <span>Cabinet médical (adresse fictive)</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Phone className="h-5 w-5 mr-3 text-emerald-600" />
                <span>+33 1 23 45 67 89</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Mail className="h-5 w-5 mr-3 text-emerald-600" />
                <span>contact@cabinet-medical.fr</span>
              </div>

              {appointment.notes && (
                <div className="flex items-start text-gray-700">
                  <FileText className="h-5 w-5 mr-3 mt-1 text-emerald-600" />
                  <span>{appointment.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:order-1">
            Fermer
          </Button>

          {!isPast && appointment.status !== "cancelled" && appointment.status !== "completed" && (
            <>
              <Button
                variant="destructive"
                onClick={handleCancelAppointment}
                disabled={isCancelling}
                className="sm:order-3"
              >
                {isCancelling ? "Annulation..." : "Annuler le rendez-vous"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
