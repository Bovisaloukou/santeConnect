"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type Medicament = {
  id: string
  nom: string
  description: string
  prix: number
  stock: number
}

export const columns: ColumnDef<Medicament>[] = [
  {
    accessorKey: "nom",
    header: "Nom",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "prix",
    header: "Prix",
    cell: ({ row }) => {
      const prix = row.getValue("prix") as number
      return `${prix.toFixed(2)} €`
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number
      return (
        <Badge variant={stock > 10 ? "default" : stock > 0 ? "secondary" : "destructive"}>
          {stock > 10 ? "En stock" : stock > 0 ? "Stock faible" : "Épuisé"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const medicament = row.original

      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
] 