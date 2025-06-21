"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Stethoscope, FileText, Phone, Mail, MapPin, Building, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userApi } from "@/lib/api/user"
import { healthCenterApi } from "@/lib/api/healthCenter"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface HealthCenter {
  uuid: string
  name: string
  type: string
  fullAddress: string
  department: string
  municipality: string
  email: string
  phoneNumber: string
  healthServices: Array<{
    uuid: string
    serviceName: string
    description: string | null
    etat: string
  }>
}

// Fonction de mapping pour l'affichage des types en français
const getTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    HOSPITAL: "Hôpital",
    CLINIC: "Clinique",
    HEALTH_CENTER: "Centre de santé",
    DOCTOR_OFFICE: "Cabinet médical"
  }
  return typeLabels[type] || type
}

export default function HealthCenterPage() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login')
    },
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [healthCenterData, setHealthCenterData] = useState<HealthCenter | null>(null)

  const loadHealthCenterData = useCallback(async () => {
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
      
      // Mettre à jour l'état avec les données du centre
      setHealthCenterData(healthCenterResponse.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id, status])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      loadHealthCenterData()
    }
  }, [status, session?.user?.id])

  const handleSave = async () => {
    try {
      if (!healthCenterData) return;
      
      await healthCenterApi.update(healthCenterData.uuid, {
        name: healthCenterData.name,
        type: healthCenterData.type,
        fullAddress: healthCenterData.fullAddress,
        department: healthCenterData.department,
        municipality: healthCenterData.municipality,
        email: healthCenterData.email,
        phoneNumber: healthCenterData.phoneNumber
      });

      setIsEditing(false);
      // Recharger les données pour s'assurer d'avoir les dernières informations
      await loadHealthCenterData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la mise à jour");
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
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

  if (!healthCenterData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Section Informations du Centre */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Informations du Centre</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            {isEditing ? "Annuler" : "Modifier"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Nom du Centre</Label>
                  {isEditing ? (
                    <Input
                      value={healthCenterData.name}
                      onChange={(e) => setHealthCenterData({ ...healthCenterData, name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base">{healthCenterData.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Type</Label>
                  {isEditing ? (
                    <Input
                      value={healthCenterData.type}
                      onChange={(e) => setHealthCenterData({ ...healthCenterData, type: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base">{getTypeLabel(healthCenterData.type)}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Téléphone</Label>
                  {isEditing ? (
                    <Input
                      value={healthCenterData.phoneNumber}
                      onChange={(e) => setHealthCenterData({ ...healthCenterData, phoneNumber: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base">{healthCenterData.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Email</Label>
                  {isEditing ? (
                    <Input
                      value={healthCenterData.email}
                      onChange={(e) => setHealthCenterData({ ...healthCenterData, email: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base">{healthCenterData.email}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Adresse</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={healthCenterData.fullAddress}
                        onChange={(e) => setHealthCenterData({ ...healthCenterData, fullAddress: e.target.value })}
                        placeholder="Adresse complète"
                        className="mt-1"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={healthCenterData.municipality}
                          onChange={(e) => setHealthCenterData({ ...healthCenterData, municipality: e.target.value })}
                          placeholder="Code postal"
                        />
                        <Input
                          value={healthCenterData.department}
                          onChange={(e) => setHealthCenterData({ ...healthCenterData, department: e.target.value })}
                          placeholder="Ville"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-base">{healthCenterData.fullAddress}</p>
                      <p className="text-sm text-[#95A5A6]">{healthCenterData.municipality}, {healthCenterData.department}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} className="bg-[#3498DB] hover:bg-[#2980B9]">
                Enregistrer les modifications
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthCenterData.healthServices?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Services actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médecins</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Médecins affiliés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Patients suivis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Demandes en attente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 