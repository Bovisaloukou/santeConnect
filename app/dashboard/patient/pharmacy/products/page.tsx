"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { useRouter } from "next/navigation"

export default function ProductsPage() {
  const router = useRouter()
  const [medicaments, setMedicaments] = useState([])

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
        searchKey="nom"
      />
    </div>
  )
} 