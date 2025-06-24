"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useApi } from "@/lib/hooks/useApi"
import type { MedicalDocument } from "@/lib/types"
import { getMockData } from "@/lib/mock-data"
import { FileText, Download, Trash, Search } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { ordonnanceApi } from "@/lib/api/ordonnance"
import type { Ordonnance } from "@/lib/api/types"

export default function PatientDocumentsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([])

  useEffect(() => {
    const fetchOrdonnances = async () => {
      setIsLoading(true)
      try {
        const res = await ordonnanceApi.getAll()
        if (Array.isArray(res.data)) {
          setOrdonnances(res.data)
        } else if (res.data) {
          setOrdonnances([res.data])
        } else {
          setOrdonnances([])
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les ordonnances.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrdonnances()
  }, [toast])

  // Filtrer uniquement les ordonnances de type MEDICAMENT et par recherche
  const filteredOrdonnances = ordonnances
    .filter((ord) => ord.type === "MEDICAMENT")
    .filter((ord) => ord.contenu.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#34495E] mb-6">Mes Ordonnances</h1>
      <div className="flex justify-end mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher une ordonnance"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full md:w-64"
          />
        </div>
      </div>
      <div className="flex flex-col space-y-6">
        {filteredOrdonnances.length > 0 ? (
          filteredOrdonnances.map((ord) => (
            <OrdonnanceCard key={ord.uuid} ordonnance={ord} />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">Aucune ordonnance trouvée</p>
          </div>
        )}
      </div>
    </div>
  )
}

function OrdonnanceCard({ ordonnance }: { ordonnance: Ordonnance }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Ordonnance du {new Date(ordonnance.date_emission).toLocaleDateString()}
        </CardTitle>
        <CardDescription>
          Expire le {new Date(ordonnance.date_expiration).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: ordonnance.contenu }} />
      </CardContent>
    </Card>
  )
}
