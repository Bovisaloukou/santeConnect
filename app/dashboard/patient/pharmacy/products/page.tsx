"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, Medicament } from "./columns"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { medicamentsApi } from "@/lib/api/medicaments"
import { Medicament as ApiMedicament } from "@/lib/api/types"

export default function ProductsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [medicaments, setMedicaments] = useState<Medicament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMedicaments = async () => {
      try {
        if (session?.user?.pharmacyUuid) {
          const data = await medicamentsApi.getByPharmacyId(session.user.pharmacyUuid)
          const transformedData = data.map(med => ({
            id: med.uuid,
            nom: med.name,
            description: med.description,
            prix: med.prix,
            stock: true // Valeur par défaut en stock
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
  }, [session])

  if (loading) {
    return <div>Chargement...</div>
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
      
      <DataTable 
        columns={columns} 
        data={medicaments}
        searchKey="name"
      />
    </div>
  )
} 