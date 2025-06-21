"use client"

import { useState, useEffect } from "react"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { userApi } from "@/lib/api/user"
import { healthCenterApi } from "@/lib/api/healthCenter"
import { healthServiceApi } from "@/lib/api/healthService"

interface Service {
  uuid: string
  serviceName: string
  description: string | null
  etat: "NORMAL" | "UNDERSTAFFED" | "OVERLOADED" | "CRITICAL" | "TEMP_CLOSED"
  healthCenterUuid: string
}

const medicalSpecialtiesList = [
  { value: "medecine-generale", label: "Médecine Générale" },
  { value: "gynecologie", label: "Gynécologie" },
  { value: "pediatrie", label: "Pédiatrie" },
  { value: "cardiologie", label: "Cardiologie" },
  { value: "dermatologie", label: "Dermatologie" },
  { value: "neurologie", label: "Neurologie" },
  { value: "ophtalmologie", label: "Ophtalmologie" },
  { value: "orl", label: "ORL" },
  { value: "psychiatrie", label: "Psychiatrie" },
  { value: "radiologie", label: "Radiologie" },
  { value: "urologie", label: "Urologie" },
  { value: "gastro-enterologie", label: "Gastro-entérologie et Hépatologie" },
  { value: "pneumologie", label: "Pneumologie" },
  { value: "rhumatologie", label: "Rhumatologie" },
  { value: "endocrinologie", label: "Endocrinologie-Diabétologie-Nutrition" },
  { value: "nephrologie", label: "Néphrologie" },
  { value: "oncologie", label: "Oncologie" },
  { value: "chirurgie-generale", label: "Chirurgie Générale et Digestive" },
  { value: "chirurgie-orthopedique", label: "Chirurgie Orthopédique et Traumatologique" },
  { value: "medecine-urgence", label: "Médecine d'Urgence" },
  { value: "kinesitherapie", label: "Kinésithérapie" },
  { value: "dentaire", label: "Chirurgie Dentaire" },
];

const getEtatLabel = (etat: Service["etat"]): string => {
  const etats: Record<Service["etat"], string> = {
    NORMAL: "Normal",
    UNDERSTAFFED: "Sous-effectif",
    OVERLOADED: "Surchargé",
    CRITICAL: "Critique",
    TEMP_CLOSED: "Fermeture temporaire"
  }
  return etats[etat]
}

export default function ServicesPage() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login')
    },
  })
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<Partial<Service>>({
    serviceName: "",
    description: "",
    etat: "NORMAL"
  })

  const getAvailableServices = () => {
    const existingServiceNames = services.map(service => service.serviceName)
    return medicalSpecialtiesList.filter(specialty => 
      !existingServiceNames.includes(specialty.label)
    )
  }

  const loadServices = async () => {
    if (status !== "authenticated" || !session?.user?.id) return

    try {
      setLoading(true)
      // Récupérer le profil utilisateur
      const userProfile = await userApi.getProfile(session.user.id)
      
      // Vérifier si l'utilisateur a un centre de santé
      if (!userProfile.healthCenters || userProfile.healthCenters.length === 0) {
        throw new Error("Aucun centre de santé trouvé pour cet utilisateur")
      }

      // Récupérer le premier centre de santé
      const healthCenterUuid = userProfile.healthCenters[0].uuid
      const healthCenterResponse = await healthCenterApi.getById(healthCenterUuid)
      
      // Mettre à jour l'état avec les services du centre
      setServices(healthCenterResponse.data.healthServices)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      loadServices()
    }
  }, [status, session?.user?.id])

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingService) {
        await healthServiceApi.update(editingService.uuid, {
          serviceName: formData.serviceName!,
          description: formData.description || undefined,
          etat: formData.etat!,
          healthCenterUuid: editingService.healthCenterUuid
        })
        await loadServices()
      } else {
        const userProfile = await userApi.getProfile(session?.user?.id || '')
        if (!userProfile.healthCenters || userProfile.healthCenters.length === 0) {
          throw new Error("Aucun centre de santé trouvé pour cet utilisateur")
        }
        const healthCenterUuid = userProfile.healthCenters[0].uuid
        await healthServiceApi.create({
          serviceName: formData.serviceName!,
          description: formData.description!,
          etat: formData.etat!,
          healthCenterUuid
        })
        await loadServices()
      }
      setIsDialogOpen(false)
      setFormData({ serviceName: "", description: "", etat: "NORMAL" })
      setEditingService(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    }
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setFormData({
      serviceName: service.serviceName,
      description: service.description || "",
      etat: service.etat
    })
    setIsDialogOpen(true)
  }

  const handleDeleteService = (uuid: string) => {
    setServiceToDelete(uuid)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (serviceToDelete) {
      try {
        await healthServiceApi.delete(serviceToDelete)
        await loadServices()
        setIsDeleteDialogOpen(false)
        setServiceToDelete(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p>Chargement des services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Erreur: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestion des Services</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={getAvailableServices().length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Modifier le service" : "Ajouter un service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddService} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service médical</Label>
                <Select 
                  onValueChange={(value) => {
                    const selectedService = medicalSpecialtiesList.find(s => s.value === value)
                    setFormData({ ...formData, serviceName: selectedService?.label || "" })
                  }}
                  value={medicalSpecialtiesList.find(s => s.label === formData.serviceName)?.value || ""}
                  disabled={editingService !== null}
                >
                  <SelectTrigger id="serviceName">
                    <SelectValue placeholder={
                      editingService 
                        ? editingService.serviceName 
                        : "Sélectionner un service"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {editingService ? (
                      <SelectItem 
                        key={medicalSpecialtiesList.find(s => s.label === editingService.serviceName)?.value} 
                        value={medicalSpecialtiesList.find(s => s.label === editingService.serviceName)?.value || ""}
                      >
                        {editingService.serviceName}
                      </SelectItem>
                    ) : (
                      getAvailableServices().map((specialty) => (
                        <SelectItem key={specialty.value} value={specialty.value}>
                          {specialty.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {!editingService && getAvailableServices().length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Tous les services médicaux ont déjà été ajoutés
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description détaillée du service..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="etat">État</Label>
                <select
                  id="etat"
                  className="w-full p-2 border rounded-md"
                  value={formData.etat}
                  onChange={(e) => setFormData({ ...formData, etat: e.target.value as Service["etat"] })}
                  required
                >
                  <option value="NORMAL">Normal</option>
                  <option value="UNDERSTAFFED">Sous-effectif</option>
                  <option value="OVERLOADED">Surchargé</option>
                  <option value="CRITICAL">Critique</option>
                  <option value="TEMP_CLOSED">Fermeture temporaire</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setFormData({ serviceName: "", description: "", etat: "NORMAL" })
                    setEditingService(null)
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingService ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>État</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Aucun service disponible
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.uuid}>
                    <TableCell>{service.serviceName}</TableCell>
                    <TableCell>{service.description || "Aucune description"}</TableCell>
                    <TableCell>{getEtatLabel(service.etat)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditService(service)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteService(service.uuid)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer ce service ?</p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 