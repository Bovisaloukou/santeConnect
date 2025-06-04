"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useApi } from "@/lib/hooks/useApi"
import type { MedicalDocument } from "@/lib/types"
import { getMockData } from "@/lib/mock-data"
import { FileText, Download, Trash, Search } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function PatientDocumentsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  // Récupérer les documents
  const {
    data: documents = [],
    isLoading,
    setData: setDocuments,
  } = useApi<MedicalDocument[]>({
    endpoint: "/api/patients/patient-1/documents",
    mockData: getMockData<MedicalDocument[]>("documents") as MedicalDocument[],
  })

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("documentName") as string
    const type = formData.get("documentType") as "prescription" | "analysis" | "report" | "other"
    const file = formData.get("documentFile") as File

    try {
      // Simuler un téléchargement réussi
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newDocument: MedicalDocument = {
        id: `doc-${Date.now()}`,
        patientId: "patient-1",
        name,
        type,
        fileUrl: URL.createObjectURL(file),
        uploadedBy: "Vous",
        uploadedAt: new Date().toISOString(),
      }

      setDocuments([newDocument, ...documents])

      toast({
        title: "Document téléchargé",
        description: "Votre document a été téléchargé avec succès.",
      })

      // Réinitialiser le formulaire
      e.currentTarget.reset()
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error)
      toast({
        title: "Erreur",
        description: "Impossible de télécharger votre document. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    try {
      // Simuler une suppression réussie
      await new Promise((resolve) => setTimeout(resolve, 500))

      setDocuments(documents.filter((doc) => doc.id !== documentId))

      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#34495E] mb-6">Mes Documents Médicaux</h1>

      <Tabs defaultValue="all">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="prescriptions">Ordonnances</TabsTrigger>
            <TabsTrigger value="analyses">Analyses</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          <div className="flex mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un document"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prescriptions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments
              .filter((doc) => doc.type === "prescription")
              .map((doc) => (
                <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
              ))}
            {filteredDocuments.filter((doc) => doc.type === "prescription").length === 0 && (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Aucune ordonnance trouvée</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analyses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments
              .filter((doc) => doc.type === "analysis")
              .map((doc) => (
                <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
              ))}
            {filteredDocuments.filter((doc) => doc.type === "analysis").length === 0 && (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Aucune analyse trouvée</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments
              .filter((doc) => doc.type === "report")
              .map((doc) => (
                <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
              ))}
            {filteredDocuments.filter((doc) => doc.type === "report").length === 0 && (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Aucun rapport trouvé</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DocumentCard({
  document,
  onDelete,
}: {
  document: MedicalDocument
  onDelete: (documentId: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          {document.name}
        </CardTitle>
        <CardDescription>
          Ajouté le {new Date(document.uploadedAt).toLocaleDateString()} par {document.uploadedBy}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </a>
          </Button>
          <Button variant="outline" onClick={() => onDelete(document.id)}>
            <Trash className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
