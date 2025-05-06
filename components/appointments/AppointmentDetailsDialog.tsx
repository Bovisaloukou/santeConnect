"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, FileText, Phone, Mail, Edit, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import type { Appointment } from "@/lib/types"

interface AppointmentDetailsDialogProps {
  appointment: Appointment
  open: boolean
  onClose: () => void
  onCancel: (appointmentId: string) => void
  onUpdate: (appointment: Appointment) => void
  isPast?: boolean
}

// Données fictives pour les créneaux horaires
const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
]

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
  const [activeTab, setActiveTab] = useState<string>("details")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // État pour la reprogrammation
  const [rescheduleData, setRescheduleData] = useState({
    date: new Date(appointment.date),
    time: appointment.time,
    notes: appointment.notes || "",
  })

  // Gérer l'annulation d'un rendez-vous
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

  // Gérer la reprogrammation d'un rendez-vous
  const handleRescheduleAppointment = async () => {
    setIsSubmitting(true)

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedAppointment: Appointment = {
        ...appointment,
        date: rescheduleData.date.toISOString().split("T")[0],
        time: rescheduleData.time,
        notes: rescheduleData.notes,
        status: "pending", // Remettre en attente pour confirmation
        updatedAt: new Date().toISOString(),
      }

      onUpdate(updatedAppointment)

      toast({
        title: "Rendez-vous reprogrammé",
        description: "Votre rendez-vous a été reprogrammé avec succès et est en attente de confirmation.",
      })

      setActiveTab("details")
      setIsRescheduling(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la reprogrammation du rendez-vous.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger
              value="reschedule"
              disabled={
                isPast || appointment.status === "cancelled" || appointment.status === "completed" || isSubmitting
              }
            >
              Reprogrammer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="py-4">
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

            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button variant="outline" onClick={onClose} className="sm:order-1">
                Fermer
              </Button>

              {!isPast && appointment.status !== "cancelled" && appointment.status !== "completed" && (
                <>
                  <Button variant="outline" onClick={() => setActiveTab("reschedule")} className="sm:order-2">
                    <Edit className="h-4 w-4 mr-2" />
                    Reprogrammer
                  </Button>
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
          </TabsContent>

          <TabsContent value="reschedule" className="py-4">
            <div className="space-y-4">
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <p className="text-sm text-amber-800">
                  La reprogrammation de votre rendez-vous nécessitera une nouvelle confirmation de la part du
                  professionnel de santé.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Nouvelle date</h3>
                <div className="border rounded-md p-3">
                  <CalendarComponent
                    mode="single"
                    selected={rescheduleData.date}
                    onSelect={(date) => date && setRescheduleData({ ...rescheduleData, date })}
                    disabled={(date) => {
                      // Désactiver les dates passées et les weekends
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return (
                        date < today ||
                        date.getDay() === 0 || // Dimanche
                        date.getDay() === 6 // Samedi
                      )
                    }}
                    initialFocus
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Nouvel horaire</h3>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`p-2 border rounded-md text-sm ${
                        rescheduleData.time === time
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setRescheduleData({ ...rescheduleData, time })}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Notes (optionnel)</h3>
                <Textarea
                  value={rescheduleData.notes}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, notes: e.target.value })}
                  placeholder="Ajoutez des informations supplémentaires..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button variant="outline" onClick={() => setActiveTab("details")} className="sm:order-1">
                Retour
              </Button>
              <Button onClick={handleRescheduleAppointment} disabled={isSubmitting} className="sm:order-2">
                {isSubmitting ? "Traitement..." : "Confirmer la reprogrammation"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
