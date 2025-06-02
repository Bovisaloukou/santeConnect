"use client"

import { useState } from "react"
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
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  etat: "NORMAL" | "UNDERSTAFFED" | "OVERLOADED" | "CRITICAL" | "TEMP_CLOSED"
}

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
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Cardiologie",
      description: "Service spécialisé en cardiologie",
      etat: "NORMAL"
    },
    {
      id: "2",
      name: "Dermatologie",
      description: "Consultation et traitement des affections cutanées",
      etat: "OVERLOADED"
    },
    {
      id: "3",
      name: "Pédiatrie",
      description: "Soins médicaux pour les enfants et adolescents",
      etat: "UNDERSTAFFED"
    },
    {
      id: "4",
      name: "Urgences",
      description: "Service d'urgence 24/7",
      etat: "CRITICAL"
    },
    {
      id: "5",
      name: "Radiologie",
      description: "Service d'imagerie médicale",
      etat: "TEMP_CLOSED"
    }
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    description: "",
    etat: "NORMAL"
  })

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...formData, id: editingService.id } as Service : s))
    } else {
      setServices([...services, { ...formData, id: Date.now().toString() } as Service])
    }
    setIsDialogOpen(false)
    setFormData({ name: "", description: "", etat: "NORMAL" })
    setEditingService(null)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setFormData(service)
    setIsDialogOpen(true)
  }

  const handleDeleteService = (id: string) => {
    setServiceToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (serviceToDelete) {
      setServices(services.filter(s => s.id !== serviceToDelete))
      setIsDeleteDialogOpen(false)
      setServiceToDelete(null)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestion des Services</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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
                <Label htmlFor="name">Nom du service</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Consultation générale"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description détaillée du service..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
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
                    setFormData({ name: "", description: "", etat: "NORMAL" })
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
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.description}</TableCell>
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
                        onClick={() => handleDeleteService(service.id)}
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