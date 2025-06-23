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
  stock: boolean
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
      return `${prix.toFixed(0)} FCFA`
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as boolean
      return (
        <Badge variant={stock ? "default" : "destructive"}>
          {stock ? "En stock" : "Épuisé"}
        </Badge>
      )
    },
  },
] 