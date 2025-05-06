"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Search } from "lucide-react"
import type { Appointment } from "@/lib/types"

interface NewAppointmentDialogProps {
  open: boolean
  onClose: () => void
  onAddAppointment: (appointment: Appointment) => void
  patientId: string
  patientName: string
}

// Données fictives pour les médecins
const DOCTORS = [
  { id: "doctor-1", name: "Dr. Marie Koné", specialty: "Médecin généraliste" },
  { id: "doctor-2", name: "Dr. Amadou Diallo", specialty: "Cardiologue" },
  { id: "doctor-3", name: "Dr. Sophie Martin", specialty: "Dermatologue" },
  { id: "doctor-4", name: "Dr. Jean Koné", specialty: "Pédiatre" },
]

// Données fictives pour les types de rendez-vous
const APPOINTMENT_TYPES = [
  { value: "consultation", label: "Consultation générale" },
  { value: "follow-up", label: "Suivi médical" },
  { value: "emergency", label: "Consultation urgente" },
  { value: "vaccination", label: "Vaccination" },
  { value: "checkup", label: "Bilan de santé" },
]

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

export default function NewAppointmentDialog({
  open,
  onClose,
  onAddAppointment,
  patientId,
  patientName,
}: NewAppointmentDialogProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // État du formulaire
  const [formData, setFormData] = useState({
    doctorId: "",
    doctorName: "",
    appointmentType: "",
    date: new Date(),
    time: "",
    notes: "",
  })

  // Erreurs du formulaire
  const [errors, setErrors] = useState({
    doctorId: "",
    appointmentType: "",
    date: "",
    time: "",
  })

  // Filtrer les médecins en fonction de la recherche
  const filteredDoctors = DOCTORS.filter((doctor) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return doctor.name.toLowerCase().includes(query) || doctor.specialty.toLowerCase().includes(query)
  })

  // Gérer le changement de médecin
  const handleDoctorSelect = (doctorId: string, doctorName: string) => {
    setFormData({
      ...formData,
      doctorId,
      doctorName,
    })

    if (errors.doctorId) {
      setErrors({
        ...errors,
        doctorId: "",
      })
    }

    setStep(2)
  }

  // Gérer le changement de type de rendez-vous
  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      appointmentType: value,
    })

    if (errors.appointmentType) {
      setErrors({
        ...errors,
        appointmentType: "",
      })
    }
  }

  // Gérer le changement de date
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        date,
      })

      if (errors.date) {
        setErrors({
          ...errors,
          date: "",
        })
      }
    }
  }

  // Gérer le changement d'heure
  const handleTimeChange = (time: string) => {
    setFormData({
      ...formData,
      time,
    })

    if (errors.time) {
      setErrors({
        ...errors,
        time: "",
      })
    }
  }

  // Gérer le changement de notes
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      notes: e.target.value,
    })
  }

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {
      doctorId: "",
      appointmentType: "",
      date: "",
      time: "",
    }

    let isValid = true

    if (!formData.doctorId) {
      newErrors.doctorId = "Veuillez sélectionner un médecin"
      isValid = false
    }

    if (!formData.appointmentType) {
      newErrors.appointmentType = "Veuillez sélectionner un type de rendez-vous"
      isValid = false
    }

    if (!formData.date) {
      newErrors.date = "Veuillez sélectionner une date"
      isValid = false
    }

    if (!formData.time) {
      newErrors.time = "Veuillez sélectionner une heure"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Soumettre le formulaire
  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const appointmentTypeLabel =
        APPOINTMENT_TYPES.find((type) => type.value === formData.appointmentType)?.label || formData.appointmentType

      const newAppointment: Appointment = {
        id: `appointment-${Date.now()}`,
        patientId,
        patientName,
        healthcareProfessionalId: formData.doctorId,
        healthcareProfessionalName: formData.doctorName,
        date: formData.date.toISOString().split("T")[0],
        time: formData.time,
        duration: 30,
        type: appointmentTypeLabel,
        notes: formData.notes,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      onAddAppointment(newAppointment)

      toast({
        title: "Rendez-vous créé",
        description: "Votre rendez-vous a été créé avec succès.",
      })

      // Réinitialiser le formulaire
      setFormData({
        doctorId: "",
        doctorName: "",
        appointmentType: "",
        date: new Date(),
        time: "",
        notes: "",
      })

      setStep(1)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du rendez-vous.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Gérer la fermeture du dialogue
  const handleClose = () => {
    // Réinitialiser le formulaire
    setFormData({
      doctorId: "",
      doctorName: "",
      appointmentType: "",
      date: new Date(),
      time: "",
      notes: "",
    })

    setStep(1)
    setSearchQuery("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau rendez-vous</DialogTitle>
          <DialogDescription>Prenez rendez-vous avec un professionnel de santé en quelques étapes.</DialogDescription>
        </DialogHeader>

        <Tabs value={`step-${step}`} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="step-1" onClick={() => setStep(1)} disabled={isSubmitting}>
              Médecin
            </TabsTrigger>
            <TabsTrigger
              value="step-2"
              onClick={() => formData.doctorId && setStep(2)}
              disabled={!formData.doctorId || isSubmitting}
            >
              Détails
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step-1" className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un médecin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredDoctors.length === 0 ? (
                <p className="text-center py-4 text-gray-500">Aucun médecin trouvé.</p>
              ) : (
                filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.doctorId === doctor.id ? "border-emerald-500 bg-emerald-50" : ""
                    }`}
                    onClick={() => handleDoctorSelect(doctor.id, doctor.name)}
                  >
                    <div className="font-medium">{doctor.name}</div>
                    <div className="text-sm text-gray-500">{doctor.specialty}</div>
                  </div>
                ))
              )}
            </div>

            {errors.doctorId && <p className="text-sm text-red-500">{errors.doctorId}</p>}

            <div className="flex justify-end">
              <Button onClick={() => formData.doctorId && setStep(2)} disabled={!formData.doctorId || isSubmitting}>
                Suivant
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="step-2" className="space-y-4 py-4">
            <div>
              <h3 className="font-medium mb-2">Médecin sélectionné</h3>
              <div className="p-3 border rounded-lg bg-gray-50">
                <div className="font-medium">{formData.doctorName}</div>
                <div className="text-sm text-gray-500">
                  {DOCTORS.find((d) => d.id === formData.doctorId)?.specialty}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type de rendez-vous</label>
                <select
                  value={formData.appointmentType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Sélectionnez un type</option>
                  {APPOINTMENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.appointmentType && <p className="text-sm text-red-500 mt-1">{errors.appointmentType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date du rendez-vous</label>
                <div className="border rounded-md p-3">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateChange}
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
                {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Heure du rendez-vous</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`p-2 border rounded-md text-sm ${
                        formData.time === time ? "bg-emerald-500 text-white border-emerald-500" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleTimeChange(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes (optionnel)</label>
                <textarea
                  value={formData.notes}
                  onChange={handleNotesChange}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Ajoutez des informations supplémentaires..."
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                Retour
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer le rendez-vous"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
