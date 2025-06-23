"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, Pencil, UserPlus, X } from "lucide-react"
import { healthCenterApi } from "@/lib/api/healthCenter"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { medecinApi } from "@/lib/api/medecin"

interface Doctor {
  uuid: string
  numeroOrdre: string
  role: string
  specialite: string
  joursConsultation?: string[]
  userProfile: {
    firstName: string
    lastName: string
    email: string
  }
  statutActivation: boolean
}

interface HealthService {
  uuid: string
  serviceName: string
  medecins: Doctor[]
}

interface HealthCenter {
  uuid: string
  name: string
  healthServices: HealthService[]
}

const ALL_DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
]

export default function DoctorsPage() {
  const { data: session, status } = useSession()
  const [healthCenter, setHealthCenter] = useState<HealthCenter | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedPendingDoctor, setSelectedPendingDoctor] = useState<Doctor | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  useEffect(() => {
    const fetchHealthCenter = async () => {
      if (status === "loading") return
      
      try {
        if (session?.user?.healthCenterUuid) {
          const response = await healthCenterApi.getById(session.user.healthCenterUuid)
          setHealthCenter(response.data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du centre de santé:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealthCenter()
  }, [session?.user?.healthCenterUuid, status])

  const handleOpenEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setSelectedDays(doctor.joursConsultation || [])
    setIsDialogOpen(true)
  }

  const handleSaveChanges = async () => {
    if (!selectedDoctor || !healthCenter) return

    setIsUpdating(true)
    const updatedHealthServices = JSON.parse(
      JSON.stringify(healthCenter.healthServices)
    )

    let doctorFound = false
    for (const service of updatedHealthServices) {
      const doctorIndex = service.medecins.findIndex(
        (d: Doctor) => d.uuid === selectedDoctor.uuid
      )
      if (doctorIndex !== -1) {
        service.medecins[doctorIndex].joursConsultation = selectedDays
        doctorFound = true
        break
      }
    }

    if (!doctorFound) {
      toast.error("Le médecin n'a pas pu être trouvé pour la mise à jour.")
      setIsUpdating(false)
      return
    }

    try {
      await healthCenterApi.update(healthCenter.uuid, {
        healthServices: updatedHealthServices,
      })

      setHealthCenter(prev => ({
        ...prev!,
        healthServices: updatedHealthServices,
      }))

      toast.success("Les jours de consultation ont été mis à jour.")
      setIsDialogOpen(false)
      setSelectedDoctor(null)
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des jours de consultation:",
        error
      )
      toast.error("Une erreur est survenue lors de la mise à jour.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleApproveDoctor = (id: string) => {
    setHealthCenter(prevHealthCenter => ({
      ...prevHealthCenter!,
      healthServices: prevHealthCenter!.healthServices.map(service => ({
        ...service,
        medecins: service.medecins.map(d => 
          d.uuid === id ? { ...d, role: "approved" } : d
        )
      }))
    }))
  }

  const handleRejectDoctor = (id: string) => {
    setHealthCenter(prevHealthCenter => ({
      ...prevHealthCenter!,
      healthServices: prevHealthCenter!.healthServices.map(service => ({
        ...service,
        medecins: service.medecins.map(d => 
          d.uuid === id ? { ...d, role: "rejected" } : d
        )
      }))
    }))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "warning" },
      approved: { label: "Approuvé", variant: "success" },
      rejected: { label: "Rejeté", variant: "destructive" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge variant={config.variant as any}>
        {config.label}
      </Badge>
    )
  }

  // Médecins en attente d'activation
  const pendingDoctors = healthCenter?.healthServices
    .flatMap(service => service.medecins.map(medecin => ({ ...medecin, serviceName: service.serviceName })))
    .filter(medecin => medecin.statutActivation === false) || []

  if (status === "loading" || loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center p-6">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return <div className="container mx-auto p-6">Veuillez vous connecter pour accéder à cette page.</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestion des Médecins</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes d'affiliation</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingDoctors.length > 0 ? pendingDoctors.map(doctor => (
                <TableRow key={doctor.uuid}>
                  <TableCell>{`${doctor.userProfile.lastName} ${doctor.userProfile.firstName}`}</TableCell>
                  <TableCell>{doctor.specialite}</TableCell>
                  <TableCell>{doctor.userProfile.email}</TableCell>
                  <TableCell>{doctor.serviceName}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => { setSelectedPendingDoctor(doctor); setIsDetailsDialogOpen(true); }}>
                      Voir détails
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Aucune demande d'affiliation
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Médecins affiliés</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Jours de consultation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthCenter?.healthServices.map(service =>
                service.medecins
                  .filter(doctor => doctor.statutActivation === true)
                  .map(doctor => (
                    <TableRow key={doctor.uuid}>
                      <TableCell>{`${doctor.userProfile.lastName} ${doctor.userProfile.firstName}`}</TableCell>
                      <TableCell>{doctor.specialite}</TableCell>
                      <TableCell>{doctor.userProfile.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{service.serviceName}</Badge>
                      </TableCell>
                      <TableCell>
                        {doctor.joursConsultation?.join(", ") || "Non défini"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditDialog(doctor)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
              {!healthCenter?.healthServices.some(
                service => service.medecins.some(doctor => doctor.statutActivation === true)
              ) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Aucun médecin affilié
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Gérer les jours de consultation</DialogTitle>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-4 py-4">
              <p>
                Médecin:{" "}
                <span className="font-semibold">
                  {selectedDoctor.userProfile.firstName}{" "}
                  {selectedDoctor.userProfile.lastName}
                </span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                {ALL_DAYS.map(day => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={checked => {
                        setSelectedDays(prev =>
                          checked
                            ? [...prev, day]
                            : prev.filter(d => d !== day)
                        )
                      }}
                    />
                    <Label htmlFor={day}>{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isUpdating}
            >
              Annuler
            </Button>
            <Button onClick={handleSaveChanges} disabled={isUpdating}>
              {isUpdating && (
                <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de détails du médecin en attente */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails du médecin</DialogTitle>
          </DialogHeader>
          {selectedPendingDoctor && (
            <div className="space-y-2 py-4">
              <p><span className="font-semibold">Nom :</span> {selectedPendingDoctor.userProfile.lastName} {selectedPendingDoctor.userProfile.firstName}</p>
              <p><span className="font-semibold">Email :</span> {selectedPendingDoctor.userProfile.email}</p>
              <p><span className="font-semibold">Spécialité :</span> {selectedPendingDoctor.specialite}</p>
              <p><span className="font-semibold">Numéro d'ordre :</span> {selectedPendingDoctor.numeroOrdre}</p>
              <p><span className="font-semibold">Rôle :</span> {selectedPendingDoctor.role}</p>
              {/* Ajouter d'autres infos si besoin */}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
              disabled={isApproving}
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!selectedPendingDoctor) return;
                setIsApproving(true);
                try {
                  await medecinApi.update(selectedPendingDoctor.uuid, { statutActivation: true });
                  toast.success("Le médecin a été approuvé avec succès.");
                  // Mettre à jour l'état local pour refléter le changement
                  setHealthCenter(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      healthServices: prev.healthServices.map(service => ({
                        ...service,
                        medecins: service.medecins.map(med =>
                          med.uuid === selectedPendingDoctor.uuid
                            ? { ...med, statutActivation: true }
                            : med
                        )
                      }))
                    }
                  });
                  setIsDetailsDialogOpen(false);
                  setSelectedPendingDoctor(null);
                } catch (error) {
                  toast.error("Erreur lors de l'approbation du médecin.");
                } finally {
                  setIsApproving(false);
                }
              }}
              disabled={isApproving}
            >
              {isApproving ? <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirmer
            </Button>
            {/* Bouton Refuser (optionnel, ici il ferme juste la modale) */}
            <Button
              variant="destructive"
              onClick={() => { setIsDetailsDialogOpen(false); setSelectedPendingDoctor(null); }}
              disabled={isApproving}
            >
              Refuser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 