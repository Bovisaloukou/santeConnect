"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Clock, FileText, Phone, Mail, MapPin, Building, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userApi } from "@/lib/api/user"
import { pharmacyApi } from "@/lib/api/pharmacy"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Pharmacy {
  uuid: string
  name: string
  adress: string
  department: string
  municipality: string
  telephone: string
  horaires: string[]
  services: string[]
  medicaments: Array<{
    uuid: string
    name: string
    description: string
    prix: number
    surOrdonnance: boolean
  }>
}

export default function PharmacyPage() {
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
  const [pharmacyData, setPharmacyData] = useState<Pharmacy | null>(null)

  const loadPharmacyData = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.id) return

    try {
      setLoading(true)
      // Récupérer le profil utilisateur
      const userProfile = await userApi.getProfile(session.user.id)
      
      // Vérifier si l'utilisateur a une pharmacie
      if (!userProfile.pharmacies || userProfile.pharmacies.length === 0) {
        throw new Error("Aucune pharmacie trouvée pour cet utilisateur")
      }

      // Récupérer la première pharmacie
      const pharmacyUuid = userProfile.pharmacies[0].uuid
      const pharmacyResponse = await pharmacyApi.getById(pharmacyUuid)
      
      // Mettre à jour l'état avec les données de la pharmacie
      setPharmacyData(pharmacyResponse.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id, status])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      loadPharmacyData()
    }
  }, [status, session?.user?.id])

  const handleSave = async () => {
    try {
      if (!pharmacyData) return;
      
      await pharmacyApi.update(pharmacyData.uuid, {
        name: pharmacyData.name,
        adress: pharmacyData.adress,
        telephone: pharmacyData.telephone,
        horaires: pharmacyData.horaires,
        services: pharmacyData.services
      });

      setIsEditing(false);
      await loadPharmacyData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la mise à jour");
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p>Chargement des données...</p>
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

  if (!pharmacyData) {
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
      {/* Section Informations de la Pharmacie */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Informations de la Pharmacie</CardTitle>
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
                  <Label className="text-sm font-medium text-[#34495E]">Nom de la Pharmacie</Label>
                  {isEditing ? (
                    <Input
                      value={pharmacyData.name}
                      onChange={(e) => setPharmacyData({ ...pharmacyData, name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base">{pharmacyData.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Téléphone</Label>
                  {isEditing ? (
                    <Input
                      value={pharmacyData.telephone}
                      onChange={(e) => setPharmacyData({ ...pharmacyData, telephone: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base">{pharmacyData.telephone}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Adresse</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={pharmacyData.adress}
                        onChange={(e) => setPharmacyData({ ...pharmacyData, adress: e.target.value })}
                        placeholder="Adresse complète"
                        className="mt-1"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={pharmacyData.municipality}
                          onChange={(e) => setPharmacyData({ ...pharmacyData, municipality: e.target.value })}
                          placeholder="Code postal"
                        />
                        <Input
                          value={pharmacyData.department}
                          onChange={(e) => setPharmacyData({ ...pharmacyData, department: e.target.value })}
                          placeholder="Ville"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-base">{pharmacyData.adress}</p>
                      <p className="text-sm text-[#95A5A6]">{pharmacyData.municipality}, {pharmacyData.department}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Horaires d'ouverture</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      {pharmacyData.horaires.map((horaire, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Label className="w-24 capitalize">{index === 0 ? 'Lundi' : index === 1 ? 'Mardi' : index === 2 ? 'Mercredi' : index === 3 ? 'Jeudi' : index === 4 ? 'Vendredi' : 'Samedi'}</Label>
                          <Input
                            value={horaire}
                            onChange={(e) => setPharmacyData({
                              ...pharmacyData,
                              horaires: pharmacyData.horaires.map((h, i) => i === index ? e.target.value : h)
                            })}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {pharmacyData.horaires.map((horaire: string, index: number) => (
                        <p key={index} className="text-sm">
                          {horaire}
                        </p>
                      ))}
                    </div>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pharmacyData.services?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Services disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médicaments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pharmacyData.medicaments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Médicaments en stock</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 