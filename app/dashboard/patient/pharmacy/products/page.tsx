"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, Medicament } from "./columns"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { medicamentsApi } from "@/lib/api/medicaments"
import { Medicament as ApiMedicament } from "@/lib/api/types"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProductsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [medicaments, setMedicaments] = useState<Medicament[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMedicament, setEditingMedicament] = useState<Medicament | null>(null)
  const [editForm, setEditForm] = useState({ nom: "", description: "", prix: 0 })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    const loadMedicaments = async () => {
      try {
        if (session?.user?.pharmacyUuid) {
          const data = await medicamentsApi.getByPharmacyId(session.user.pharmacyUuid)
          const transformedData = data.map(med => ({
            id: med.uuid,
            nom: med.name,
            description: med.description,
            prix: med.prix,
            stock: true
          }))
          setMedicaments(transformedData)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des médicaments:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMedicaments()
  }, [session?.user?.pharmacyUuid, status])

  const handleEditClick = (medicament: Medicament) => {
    setEditingMedicament(medicament)
    setEditForm({
      nom: medicament.nom,
      description: medicament.description,
      prix: medicament.prix,
    })
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMedicament) return
    try {
      await medicamentsApi.update(editingMedicament.id, {
        name: editForm.nom,
        description: editForm.description,
        prix: editForm.prix,
      })
      setIsEditModalOpen(false)
      setEditingMedicament(null)
      // Recharge la liste
      if (session?.user?.pharmacyUuid) {
        const data = await medicamentsApi.getByPharmacyId(session.user.pharmacyUuid)
        const transformedData = data.map(med => ({
          id: med.uuid,
          nom: med.name,
          description: med.description,
          prix: med.prix,
          stock: true
        }))
        setMedicaments(transformedData)
      }
    } catch (error) {
      alert("Erreur lors de la modification")
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await medicamentsApi.delete(deleteId)
      setIsDeleteDialogOpen(false)
      setDeleteId(null)
      // Recharge la liste
      if (session?.user?.pharmacyUuid) {
        const data = await medicamentsApi.getByPharmacyId(session.user.pharmacyUuid)
        const transformedData = data.map(med => ({
          id: med.uuid,
          nom: med.name,
          description: med.description,
          prix: med.prix,
          stock: true
        }))
        setMedicaments(transformedData)
      }
    } catch (error) {
      alert("Erreur lors de la suppression")
    }
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Médicaments</h1>
        <Button onClick={() => router.push("/dashboard/patient/pharmacy/products/add")}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un médicament
        </Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <DataTable 
          columns={[
            ...columns,
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }: any) => {
                const medicament = row.original
                return (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(medicament)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(medicament.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              }
            }
          ]} 
          data={medicaments}
          searchKey="name"
        />
      )}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le médicament</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input
                value={editForm.nom}
                onChange={e => setEditForm({ ...editForm, nom: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Prix</Label>
              <Input
                type="number"
                value={editForm.prix}
                onChange={e => setEditForm({ ...editForm, prix: Number(e.target.value) })}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer ce médicament ?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 